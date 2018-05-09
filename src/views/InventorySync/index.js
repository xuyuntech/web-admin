import React from 'react';
import { Upload, message, Icon, Table, Divider } from 'antd';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';
import { API } from '../../const';


const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <Link to={`/crawler/task/${text}`}>{text}</Link>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="javascript:;">Action 一 {record.name}</a>
      <Divider type="vertical" />
      <a href="javascript:;">Delete</a>
      <Divider type="vertical" />
      <a href="javascript:;" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>
  ),
}];

const data = [];

export default class extends React.Component {
  state = {
    uploading: false,
    uploaded: false,
    syncData: null,
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
            this.setState({ uploaded: true, syncData: response.data });
          }
        }
      }
      >
        <Button>
          <Icon type="upload" /> 点击上传 Excel 表
        </Button>
      </Upload>
    );
  }
  getSyncData = () => {
    const { syncData } = this.state;
    if (!Array.isArray(syncData)) {
      return null;
    }
    const sData = [];
    syncData.forEach((item) => {
      const { changeArr = [] } = item;
      changeArr.forEach((changeItem) => {
        if (changeItem && !changeItem.err) {
          sData.push(changeItem);
        } else {
          // console.log(changeItem);
        }
      });
    });
    console.log('syncData', sData);
    return sData;
  };
  getActions() {
    const { uploaded } = this.state;
    return !uploaded ? this.getUploadComp()
      :
    <Button url={API.INVENTORY_SYNC.SYNC_ALL} method="POST" data={this.getSyncData}>
      <Icon type="upload" /> 同步
    </Button>;
  }
  render() {
    return (
      <div className="panel">
        <div className="panel-heading">
          <h3 className="panel-title">库存同步</h3>
        </div>
        <div className="panel-body">
          {this.getActions()}
          <p />
          <Table
            style={{ backgroundColor: '#fff' }}
            size="small"
            title={() => '库存状态'}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>
    );
  }
}
