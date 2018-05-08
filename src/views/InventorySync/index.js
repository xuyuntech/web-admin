import React from 'react';
import { Upload, message, Button, Icon, Table, Divider } from 'antd';
import { Link } from 'react-router-dom';


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

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

const props = {
  name: 'file',
  action: '//localhost:3001/upload',
  headers: {
    // authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export default class extends React.Component {
  render() {
    return (
      <div className="panel">
        <div className="panel-heading">
          <h3 className="panel-title">库存同步</h3>
        </div>
        <div className="panel-body">
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 点击上传 Excel 表
            </Button>
          </Upload>
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
