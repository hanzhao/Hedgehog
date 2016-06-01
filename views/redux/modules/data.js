const LOAD_OVERVIEW = 'HEDGEHOG/data/LOAD_OVERVIEW'
const LOAD_OVERVIEW_SUCCESS = 'HEDGEHOG/data/LOAD_OVERVIEW_SUCCESS'
const LOAD_OVERVIEW_FAIL = 'HEDGEHOG/data/LOAD_OVERVIEW_FAIL'

const LOAD_DEVICE_DATA = 'HEDGEHOG/data/LOAD_DEVICE_DATA'
const LOAD_DEVICE_DATA_SUCCESS = 'HEDGEHOG/data/LOAD_DEVICE_DATA_SUCCESS'
const LOAD_DEVICE_DATA_FAIL = 'HEDGEHOG/data/LOAD_DEVICE_DATA_FAIL'

const LOAD_DEVICE_TYPE = 'HEDGEHOG/data/LOAD_DEVICE_TYPE'
const LOAD_DEVICE_TYPE_SUCCESS = 'HEDGEHOG/data/LOAD_DEVICE_TYPE_SUCCESS'
const LOAD_DEVICE_TYPE_FAIL = 'HEDGEHOG/data/LOAD_DEVICE_TYPE_FAIL'

const PUSH_BACK_DATA = 'HEDGEHOG/data/PUSH_BACK_DATA'
const ENABLE_STREAMING = 'HEDGEHOG/data/ENABLE_STREAMING'
const DISABLE_STREAMING = 'HEDGEHOG/data/DISABLE_STREAMING'

export const loadOverview = () => ({
  types: [LOAD_OVERVIEW, LOAD_OVERVIEW_SUCCESS, LOAD_OVERVIEW_FAIL],
  promise: (client) => client.get('/api/overview')
})

export const loadDeviceData = (id) => ({
  types: [LOAD_DEVICE_DATA, LOAD_DEVICE_DATA_SUCCESS, LOAD_DEVICE_DATA_FAIL],
  promise: (client) => client.get('/api/data', { device_id: id })
})

export const loadDeviceType = (id) => ({
  types: [LOAD_DEVICE_TYPE, LOAD_DEVICE_TYPE_SUCCESS, LOAD_DEVICE_TYPE_FAIL],
  promise: (client) => client.get('/api/device_info', { device_id: id })
})

export const pushBack = (data) => ({
  type: PUSH_BACK_DATA,
  data
})

export const enableStreaming = () => ({
  type: ENABLE_STREAMING
})

export const disableStreaming = () => ({
  type: DISABLE_STREAMING
})

const initialState = {

}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_OVERVIEW_SUCCESS:
      return {
        ...state,
        deviceTypes: action.result.device_types,
        devices: action.result.devices
      }
    case LOAD_DEVICE_DATA_SUCCESS:
      return {
        ...state,
        data: action.result.data.map(e => ({ ...e, key: e.id })).reverse()
      }
    case LOAD_DEVICE_TYPE_SUCCESS:
      return {
        ...state,
        device: action.result.type,
        active: action.result.type.active
      }
    case PUSH_BACK_DATA:
      let data = action.data
      if (!(action.data instanceof Array)) {
        data = [data]
      }
      data = data.map(e => ({
        ...e,
        key: e.id
      }))
      return {
        ...state,
        data: [ ...state.data, ...data ],
        active: true
      }
    case ENABLE_STREAMING:
      return {
        ...state,
        streaming: true
      }
    case DISABLE_STREAMING:
      return {
        ...state,
        streaming: false
      }
    default:
      return state
  }
}
