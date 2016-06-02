import store from '../store'
import { push } from 'react-router-redux'
import { message } from 'antd'

const ADD_DEVICE_TYPE = 'HEDGEHOG/device/ADD_DEVICE_TYPE'
const ADD_DEVICE_TYPE_SUCCESS = 'HEDGEHOG/device/ADD_DEVICE_TYPE_SUCCESS'
const ADD_DEVICE_TYPE_FAIL = 'HEDGEHOG/device/ADD_DEVICE_TYPE_FAIL'

const LOAD_DEVICE_TYPES = 'HEDGEHOG/device/LOAD_DEVICE_TYPES'
const LOAD_DEVICE_TYPES_SUCCESS = 'HEDGEHOG/device/LOAD_DEVICE_TYPES_SUCCESS'
const LOAD_DEVICE_TYPES_FAIL = 'HEDGEHOG/device/LOAD_DEVICE_TYPES_FAIL'

const ADD_DEVICE = 'HEDGEHOG/device/ADD_DEVICE'
const ADD_DEVICE_SUCCESS = 'HEDGEHOG/device/ADD_DEVICE_SUCCESS'
const ADD_DEVICE_FAIL = 'HEDGEHOG/device/ADD_DEVICE_FAIL'

const LOAD_DEVICES = 'HEDGEHOG/device/LOAD_DEVICES'
const LOAD_DEVICES_SUCCESS = 'HEDGEHOG/device/LOAD_DEVICES_SUCCESS'
const LOAD_DEVICES_FAIL = 'HEDGEHOG/device/LOAD_DEVICES_FAIL'

const TOGGLE_ADD_DEVICE_MODAL = 'HEDGEHOG/device/TOGGLE_ADD_DEVICE_MODAL'

export const addDeviceType = (data) => ({
  types: [ADD_DEVICE_TYPE, ADD_DEVICE_TYPE_SUCCESS, ADD_DEVICE_TYPE_FAIL],
  promise: (client) => client.post('/api/device/type/add', data)
})

export const loadDeviceTypes = () => ({
  types: [LOAD_DEVICE_TYPES, LOAD_DEVICE_TYPES_SUCCESS, LOAD_DEVICE_TYPES_FAIL],
  promise: (client) => client.get('/api/device/types')
})

export const addDevice = (data) => ({
  types: [ADD_DEVICE, ADD_DEVICE_SUCCESS, ADD_DEVICE_FAIL],
  promise: (client) => client.post('/api/device/add', data)
})

export const loadDevices = () => ({
  types: [LOAD_DEVICES, LOAD_DEVICES_SUCCESS, LOAD_DEVICES_FAIL],
  promise: (client) => client.get('/api/devices')
})

export const toggleAddDeviceModal = () => ({
  type: TOGGLE_ADD_DEVICE_MODAL
})

const initialState = {
  showAddDeviceModal: false
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_DEVICE_TYPE_SUCCESS:
      message.success('添加成功')
      setTimeout(() => {
        store.dispatch(push('/types'))
      }, 0)
      return state
    case LOAD_DEVICE_TYPES_SUCCESS:
      return {
        ...state,
        types: action.result.types.map(e => ({ ...e, key: e.id }))
      }
    case ADD_DEVICE_SUCCESS:
      message.success('添加成功')
      setTimeout(() => {
        store.dispatch(push('/devices'))
      }, 0)
      return {
        ...state,
        showAddDeviceModal: false
      }
    case LOAD_DEVICES_SUCCESS:
      return {
        ...state,
        devices: action.result.devices.map(e => ({
          ...e,
          secret: e.key,
          key: e.id
        }))
      }
    case TOGGLE_ADD_DEVICE_MODAL:
      return {
        ...state,
        showAddDeviceModal: !state.showAddDeviceModal
      }
    default:
      return state
  }
}
