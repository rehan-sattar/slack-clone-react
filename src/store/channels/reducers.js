import { SET_CHANNEL, SET_PRIVATE_CHANNEL, SET_USER_POSTS } from './actionTypes'

const initialState = {
  currentChannel: null,
  private: false,
  userPosts: null,
}

export const channelReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CHANNEL:
      return { ...state, currentChannel: payload }
    case SET_PRIVATE_CHANNEL:
      return { ...state, private: payload.isChannelPrivate }
    case SET_USER_POSTS:
      return { ...state, userPosts: payload }
    default:
      return state
  }
}
