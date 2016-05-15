const TOGGLE_LOGIN_MODAL = 'HEDGEHOG/auth/TOGGLE_LOGIN_MODAL'

export const toggleLoginModal = () => ({
  type: TOGGLE_LOGIN_MODAL
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
    default:
      return state
  }
}
