import { SET_CHANNEL } from './actionTypes'

const initialState = {
  currentChannel: null,
}

export const channelReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CHANNEL:
      return { ...state, currentChannel: payload }

    default:
      return state
  }
}
