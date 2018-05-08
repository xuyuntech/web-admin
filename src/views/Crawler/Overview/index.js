import React from 'react';
import { Table, Icon, Divider } from 'antd';
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


export default class extends React.Component {
  render() {
    return (
      <div>
        <div className="panel">
          <div className="panel-heading">
            <h3 className="panel-title">当前运行中的任务</h3>
          </div>
          <div className="panel-body">
            <Table style={{ backgroundColor: '#fff' }} size="small" columns={columns} dataSource={data} />
          </div>
        </div>
        <div className="panel">
          <div className="panel-heading">
            <h3 className="panel-title">子节点信息</h3>
          </div>
          <div className="panel-body">
            <Table style={{ backgroundColor: '#fff' }} size="small" columns={columns} dataSource={data} />
          </div>
        </div>
      </div>
    );
  }
}
