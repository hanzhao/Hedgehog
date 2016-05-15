import store from '../store'
import { push } from 'react-router-redux'

const TOGGLE_LOGIN_MODAL = 'HEDGEHOG/auth/TOGGLE_LOGIN_MODAL'

const FAKE_LOGIN = 'HEDGEHOG/auth/FAKE_LOGIN'

export const toggleLoginModal = () => ({
  type: TOGGLE_LOGIN_MODAL
})

export const login = () => ({
  type: FAKE_LOGIN
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
        store.dispatch(push('/types'))
      }, 300)
      return {
        ...state,
        showLoginModal: false
      }
    default:
      return state
  }
}
