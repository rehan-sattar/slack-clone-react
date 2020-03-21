import { SET_USER, CLEAR_USER } from './actionTypes'

const initialUserState = {
  isLoading: true,
  currentUser: null,
}

export const userReducer = (state = initialUserState, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return {
        isLoading: false,
        currentUser: payload,
      }
    case CLEAR_USER:
      return {
        ...initialUserState,
        isLoading: false,
      }
    default:
      return state
  }
}
