import store from '../store'
import { push } from 'react-router-redux'
import { message } from 'antd'

const LOAD_INFO = 'HEDGEHOG/auth/LOAD_INFO'
const LOAD_INFO_SUCCESS = 'HEDGEHOG/auth/LOAD_INFO_SUCCESS'
const LOAD_INFO_FAIL = 'HEDGEHOG/auth/LOAD_INFO_FAIL'

const LOGIN = 'HEDGEHOG/auth/LOGIN'
const LOGIN_SUCCESS = 'HEDGEHOG/auth/LOGIN_SUCCESS'
const LOGIN_FAIL = 'HEDGEHOG/auth/LOGIN_FAIL'

const LOGOUT = 'HEDGEHOG/auth/LOGOUT'
const LOGOUT_SUCCESS = 'HEDGEHOG/auth/LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'HEDGEHOG/auth/LOGOUT_FAIL'

const SIGNUP = 'HEDGEHOG/auth/SIGNUP'
const SIGNUP_SUCCESS = 'HEDGEHOG/auth/SIGNUP_SUCCESS'
const SIGNUP_FAIL = 'HEDGEHOG/auth/SIGNUP_FAIL'

export const loadInfo = () => ({
  types: [LOAD_INFO, LOAD_INFO_SUCCESS, LOAD_INFO_FAIL],
  promise: (client) => client.get('/api/me')
})

export const login = (data) => ({
  types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
  promise: (client) => client.post('/api/login', data)
})

export const signup = (data) => ({
  types: [SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAIL],
  promise: (client) => client.post('/api/signup', data)
})

export const logout = () => ({
  types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
  promise: (client) => client.get('/api/logout')
})

export const isInfoLoaded = (state) => (
  !!state.auth.user
)

const initialState = {
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      setTimeout(() => {
        store.dispatch(push('/types'))
      }, 0)
      return {
        ...state,
        user: action.result.user
      }
    case SIGNUP_SUCCESS:
      setTimeout(() => {
        store.dispatch(push('/types'))
      }, 0)
      return {
        ...state,
        user: action.result.user
      }
    case LOGOUT_SUCCESS:
      setTimeout(() => {
        store.dispatch(push('/'))
      }, 0)
      return {
        ...state,
        user: null
      }
    case LOAD_INFO_SUCCESS:
      return {
        ...state,
        user: action.result.user
      }
    case SIGNUP_FAIL:
      message.error('注册失败，用户名可能已经被占用')
      return state
    case LOGIN_FAIL:
      message.error('用户名或密码错误')
      return state
    default:
      return state
  }
}
