import React from 'react'
import { asyncConnect } from 'redux-connect'
import { Link } from 'react-router'
import { Button, Icon, Table, Popover } from 'antd'
import moment from 'moment'
import stringify from 'json-stringify-pretty-compact'

import NavBar from '../NavBar'
import Title from '../Title'
import FieldsAlert from '../FieldsAlert'
import { loadDeviceTypes } from '../../redux/modules/device'

import styles from './styles'

const columns = [{
  title: 'Type ID',
  dataIndex: 'id',
  key: 'id',
  sorter: (a, b) => a.id < b.id ? -1 : 1
}, {
  title: 'Device Type',
  dataIndex: 'name',
  key: 'name',
  sorter: (a, b) => a.name.localeCompare(b.name, 'zh-CN')
}, {
  title: 'Fields',
  dataIndex: 'fields',
  key: 'fields',
  render(fields, record) {
    return (
      <Popover overlay={
        <FieldsAlert className={styles.overlay} data={record} />
      }>
        <pre>{ stringify(fields) }</pre>
      </Popover>
    )
  }
}, {
  title: 'Created by',
  dataIndex: 'username',
  key: 'username',
  sorter: (a, b) => a.username.localeCompare(b.username, 'zh-CN')
}, {
  title: 'Created At',
  dataIndex: 'created_at',
  key: 'created_at',
  render(text) {
    return <span>{ moment.utc(text).fromNow() }</span>
  }
}]

@asyncConnect(
  [{
    promise: ({ store: { dispatch, getState } }) => {
      return dispatch(loadDeviceTypes())
    }
  }],
  (state) => ({
    types: state.device.types
  })
)
class AddDeviceType extends React.Component {
  render() {
    const types = this.props.types
    return (
      <div>
        <Title type="bars">Types Management</Title>
        <div className={styles.button}>
          <Link to="/type/add">
            <Button size="large" type="primary">
              Add new type
            </Button>
          </Link>
        </div>
        <Table columns={columns} dataSource={types} pagination={{ showSizeChanger: true }} />
      </div>
    )
  }
}

export default AddDeviceType
