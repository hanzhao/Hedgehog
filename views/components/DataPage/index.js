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
  title: 'Data',
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
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    data: '{"add":1,"temperature":25.8}',
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

class DataPage extends React.Component {
  render() {
    return (
      <div>
        <Title type="bars">Data Management</Title>
        <Table columns={columns} dataSource={data} pagination={pagination} />
      </div>
    )
  }
}

export default DataPage
