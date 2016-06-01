import React from 'react'
import { asyncConnect } from 'redux-connect'
import { Table, Button, Modal, Select, Form } from 'antd'
import moment from 'moment'

import Title from '../Title'
import AddDeviceModal from '../AddDeviceModal'
import {
  toggleAddDeviceModal,
  loadDeviceTypes,
  loadDevices
} from '../../redux/modules/device'

import styles from './styles'

const columns = [{
  title: 'Device ID',
  dataIndex: 'id',
  key: 'id',
  sorter: (a, b) => a.id < b.id ? -1 : 1
}, {
  title: 'Device Name',
  dataIndex: 'name',
  key: 'name',
  sorter: (a, b) => a.name.localeCompare(b.name, 'zh-CN')
}, {
  title: 'Device Type',
  dataIndex: 'typename',
  key: 'typename',
  sorter: (a, b) => a.typename.localeCompare(b.typename, 'zh-CN')
}, {
  title: 'Device Secret',
  dataIndex: 'secret',
  key: 'secret'
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
      return Promise.all([
        dispatch(loadDeviceTypes()),
        dispatch(loadDevices())
      ])
    }
  }],
  (state) => ({
    devices: state.device.devices
  }),
  (dispatch) => ({
    toggleAddDeviceModal: () => dispatch(toggleAddDeviceModal())
  })
)
class DevicesPage extends React.Component {
  render() {
    return (
      <div>
        <Title type="bars">Devices Management</Title>
        <AddDeviceModal />
        <Button className={styles.button}
                size="large"
                type="primary"
                onClick={this.props.toggleAddDeviceModal}>
          Add new device
        </Button>
        <Table columns={columns}
               dataSource={this.props.devices}
               pagination={{ showSizeChanger: true }} />
      </div>
    )
  }
}

export default DevicesPage
