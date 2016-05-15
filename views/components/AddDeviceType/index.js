import React from 'react'
import { Form, Input, Button, Checkbox, Radio, Tooltip, Icon, Modal, Table, Select } from 'antd';

import NavBar from '../NavBar'
import Title from '../Title'

import styles from './styles'

const columns = [{
  title: 'Type ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: 'Device Type',
  dataIndex: 'type',
  key: 'type'
}, {
  title: 'Payload',
  dataIndex: 'data',
  key: 'data'
}, {
  title: 'Time',
  dataIndex: 'created_at',
  key: 'created_at'
}]

const types = ['Gateway', 'ResPI MK.II', 'Temperature Measure II',
               'GroupIII', 'Sensor II']

const data = []
for (let i = 0; i < 5; i++) {
  data.push({
    key: i,
    id: i + 1,
    type: types[i],
    data: '{"name":{"range":[0,7],"type":"string"},"temperature":{"type":"float","range":[8,11]}}',
    created_at: new Date().toString()
  })
}

const pagination = {
  total: data.length,
  showSizeChanger: true,
  onShowSizeChange(current, pageSize) {
    console.log('Current: ', current, ' PageSize: ', pageSize)
  },
  onChange(current) {
    console.log('Current: ', current)
  },
}

class Demo extends React.Component{
  state = {
    rows: 0
  };
  handleSubmit = (e) => {
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
  };
  handleClick = () => {
    this.setState({
      rows: this.state.rows + 1
    })
  };
  render() {
    return (
      <div className={styles.container}>
      <Form horizontal onSubmit={this.handleSubmit}>
        <Form.Item
          label="Type: ">
          <Input placeholder="Input typename" />
        </Form.Item>
        </Form>
        { Array(this.state.rows).fill(0).map((e, i) => (
          <Form key={i} horizontal>
            <Form.Item label="Data name: ">
              <Input placeholder="Input segment name" />
            </Form.Item>
            <Form.Item label="Data range">
              <Input placeholder="Input data range" />
            </Form.Item>
            <Form.Item label="Data type">
              <Select placeholder="Select data type">
                <Select.Option>String</Select.Option>
                <Select.Option>Integer</Select.Option>
                <Select.Option>REAL</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        ))}
        <Button onClick={this.handleClick} type="primary" size="large" style={{ marginRight: 10 }}>添加一个字段</Button>
        <Button size="large" type="primary" htmlType="submit">确定</Button>
      </div>
    );
  }
};

class AddDeviceType extends React.Component {
  state = {
    showModal: false
  };
  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    })
  };
  render() {
    return (
      <div>
        <Title type="bars">Types Management</Title>
        <Modal title="Add new type"
               visible={this.state.showModal}
               onCancel={this.toggleModal}
               footer={null}>
          <Demo />
        </Modal>
        <Button style={{ marginBottom: 10 }}
                size="large"
                type="primary"
                onClick={this.toggleModal}>Add new type</Button>
        <Table columns={columns} dataSource={data} pagination={pagination} />
      </div>
    )
  }
}

export default AddDeviceType
