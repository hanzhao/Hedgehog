import React from 'react'
import md5 from 'md5'
import { Table, Button, Modal, Select, Form } from 'antd'

import Title from '../Title'

const columns = [{
  title: 'Device ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: 'Device Type',
  dataIndex: 'type',
  key: 'type'
}, {
  title: 'Device Secret',
  dataIndex: 'secret',
  key: 'secret'
}]

const types = ['Gateway', 'ResPI MK.II', 'Temperature Measure II',
               'GroupIII', 'Sensor II']

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    secret: md5(md5(i + 1) + 'fatmousefatmouse')
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

class AddDeviceModal extends React.Component {
  render() {
    return (
      <Modal title="Add new device"
             visible={this.props.show}
             footer={null}
             onCancel={this.props.onCancel}>
        <Form horizontal>
          <Form.Item
            label="Device Type:"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}>
            <Select size="large" placeholder="Please select a device type...">
              { types.map(e => (
                <Select.Option key={e}>
                  { e }
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={this.props.goToTypes}>Add</Button>
          </div>
        </Form>
      </Modal>
    )
  }
}

class DevicesPage extends React.Component {
  state = {
    showAddDevice: false
  };
  handleToggle = () => {
    this.setState({
      showAddDevice: !this.state.showAddDevice
    })
  }
  render() {
    return (
      <div>
        <Title type="bars">Devices Management</Title>
        <AddDeviceModal show={this.state.showAddDevice} onCancel={this.handleToggle} />
        <Button style={{ marginBottom: 10 }}
                size="large"
                type="primary"
                onClick={this.handleToggle}>Add new device</Button>
        <Table columns={columns} dataSource={data} pagination={pagination} />
      </div>
    )
  }
}

export default DevicesPage
