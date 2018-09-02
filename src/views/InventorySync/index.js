import React from 'react';
import { Upload, message, Icon, Table, Button, Pagination, Spin } from 'antd';
import _ from 'lodash';
import fetchStream from 'fetch-stream';
import bFetch from '../../common/BFetch';
import { API } from '../../const';


const priceQuantityCls = (o, t) => {
  if (o > t) {
    return 'success';
  } else if (o < t) {
    return 'danger';
  }
  return '';
};

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '商品名称',
      dataIndex: 'item_title',
      key: 'item_title',
    }, {
      title: '商品编码',
      dataIndex: 'item_no',
      key: 'item_no',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const { status } = record;
        switch (status) {
          case 'success':
            return (
              <Icon type="check-circle" />
            );
          case 'failed':
            return (
              <Icon type="close-circle" />
            );
          case 'loading':
            return (
              <Spin />
            );
          default:
            return (
              <span>
                <a href="javascript:;" onClick={() => { this.syncOne(record); }}>同步本条</a>
              </span>
            );
        }
      },
    }];
  }
  state = {
    uploading: false,
    parsing: false,
    uploaded: false,
    syncingAll: false,
    syncData: [],
  };
  onShowSizeChange = (page, pageSize) => {
    this.pageSize = pageSize;
  };
  getUploadComp() {
    return (
      <Upload
        name="file"
        action={API.INVENTORY_SYNC.UPLOAD}
        disabled={this.state.uploading}
        headers={{
        // authorization: 'authorization-text',
      }}
        onChange={
        (info) => {
          console.log('info', info);
          const { file: { status, response = {} } } = info;
          this.setState({ uploading: status === 'uploading' });
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
          if (response.status === 0) {
            console.log(response);
            message.success('文件上传成功，开始解析');
            this.startParse();
            // const hasData = response.data.length > 0;
            // this.setState({ uploaded: hasData, syncData: response.data });
            // if (!hasData) {
            //   message.info('库存没有变化, 无需更新');
            // }
          }
        }
      }
      >
        <Button>
          <Icon type="upload" /> 点击上传 Excel 库存表
        </Button>
      </Upload>
    );
  }
  getActions() {
    const { uploaded, syncingAll } = this.state;
    return !uploaded ? this.getUploadComp()
      :
    <Button loading={syncingAll} onClick={this.syncAll}>
      同步所有
    </Button>;
  }
  getSyncData = () => {
    const { syncData } = this.state;
    if (!Array.isArray(syncData)) {
      return null;
    }
    return syncData.map(item => ({
      ...item,
      update_jsons: item.changesByShop.map(change => change.update_json),
    }));
  };
  syncOne = async (data) => {
    const { item_no, changesByShop } = data;
    try {
      await bFetch(API.INVENTORY_SYNC.SYNC_ALL, {
        method: 'POST',
        body: JSON.stringify({
          item_no,
          update_jsons: changesByShop.map(change => change.update_json),
        }),
      });
      this.updateStatus(item_no, 'success');
    } catch (err) {
      this.updateStatus(item_no, 'failed', err);
    }
  };
  syncAll = async () => {
    const data = this.getSyncData();
    this.setState({ syncingAll: true, syncData: data.map(item => ({ ...item, status: 'loading' })) });
    const chunkData = _.chunk(data, 10);
    for (let i = 0; i < chunkData.length; i += 1) {
      await Promise.all(chunkData[i].map(async (item) => {
        await this.syncOne(item);
      }));
    }
    this.setState({ syncingAll: false });
    // .forEach(async (items) => {

    // });
  };
  addTableLine(str) {
    const { syncData } = this.state;
    console.log('str -> ', str);
    try {
      const data = JSON.parse(str);
      const {
        item_id, item_no, item_title, offline_id, offline_name, skus,
      } = data;
      let changesByShop = [];
      const idx = _.findIndex(syncData, { item_id });
      if (idx >= 0) {
        changesByShop = syncData[idx].changesByShop; //eslint-disable-line
      }
      changesByShop.push({
        offline_id, offline_name, skus,
      });
      const d = {
        item_id, item_no, item_title, changesByShop,
      };
      if (idx >= 0) {
        syncData[idx] = d;
      } else {
        syncData.push(d);
      }
      this.setState({ syncData });
    } catch (err) {
      console.error('addTableLine err:', err);
    }
  }
  startParse() {
    this.setState({ parsing: true });
    fetchStream(
      {
        url: `${API.INVENTORY_SYNC.PARSING}`,
      },
      (result, err) => {
        if (err) {
          console.error('fetchStream err', err);
          return false;
        }
        if (!result) {
          console.error('fetchStream no result');
          return false;
        }
        if (result.done) {
          console.log('fetchStream done');
          return;
        }
        const str = String(result.value);
        switch (str) {
          case 'ping':
            return true;
          default:
            this.addTableLine(str);
        }
        return true;
      },
    );
  }
  updateStatus(item_no, status, err = null) {
    const { syncData = [] } = this.state;
    const i = _.findIndex(syncData, o => o.item_no === item_no);
    if (i < 0) return;
    syncData[i].status = status;
    syncData[i].err = err;
    this.setState({ syncData });
  }

  expandedRowRender = (record) => {
    const { changesByShop } = record;
    return (
      changesByShop.map((item) => {
        const { offline_name, skus } = item;
        return (
          <div key={offline_name}>
            <p>{offline_name}</p>
            <div>
              {
                skus.map((sku) => {
                  const {
                    k, v, price, quantity, to_price, to_quantity, id,
                  } = sku;
                  return (
                    <p key={id}>
                      {`规格: ${k}:${v}, `}
                      <span className={`badge badge-${priceQuantityCls(price, to_price)}`}>{`价格变化: ${price} -> ${Number.prototype.toFixed.call(to_price, 2)}, `}</span>
                      <span className={`badge badge-${priceQuantityCls(quantity, to_quantity)}`}>{`库存变化: ${quantity} -> ${to_quantity}`}</span>
                    </p>
                  );
                })
              }
            </div>
          </div>
        );
      })
    );
  };
  render() {
    const { syncData = [], parsing } = this.state;
    return (
      <div className="panel">
        <div className="panel-heading">
          <h3 className="panel-title">库存同步</h3>
        </div>
        <div className="panel-body">
          {this.getActions()}
          <p />
          <Table
            loading={parsing}
            style={{ backgroundColor: '#fff' }}
            expandedRowRender={this.expandedRowRender}
            defaultExpandAllRows
            size="small"
            rowKey="item_no"
            title={() => '库存状态'}
            columns={this.columns}
            dataSource={syncData}
            pagination={
              <Pagination
                onShowSizeChange={this.onShowSizeChange}
                showSizeChanger
                showTotal={total => `共 ${total} 条`}
                total={syncData.length}
                // pageSize={10}
              />
              }
          />
        </div>
      </div>
    );
  }
}
