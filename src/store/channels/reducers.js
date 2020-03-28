import { SET_CHANNEL, SET_PRIVATE_CHANNEL } from './actionTypes'

const initialState = {
  currentChannel: null,
  private: false,
}

export const channelReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CHANNEL:
      return { ...state, currentChannel: payload }
    case SET_PRIVATE_CHANNEL:
      return { ...state, private: payload.isChannelPrivate }
    default:
      return state
  }
}
