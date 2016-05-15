import store from '../store'
import { push } from 'react-router-redux'

const TOGGLE_LOGIN_MODAL = 'HEDGEHOG/auth/TOGGLE_LOGIN_MODAL'

const FAKE_LOGIN = 'HEDGEHOG/auth/FAKE_LOGIN'
const FAKE_LOGOUT = 'HEDGEHOG/auth/FAKE_LOGOUT'

export const toggleLoginModal = () => ({
  type: TOGGLE_LOGIN_MODAL
})

export const login = () => ({
  type: FAKE_LOGIN
})

export const logout = () => ({
  type: FAKE_LOGOUT
})

const initialState = {
  showLoginModal: false
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_LOGIN_MODAL:
      return {
        ...state,
        showLoginModal: !state.showLoginModal
      }
    case FAKE_LOGIN:
      setTimeout(() => {
        store.dispatch(push('/devices'))
      }, 300)
      return {
        ...state,
        showLoginModal: false,
        user: 'Magica'
      }
    case FAKE_LOGOUT:
      return {
        ...state,
        user: null
      }
    default:
      return state
  }
}
