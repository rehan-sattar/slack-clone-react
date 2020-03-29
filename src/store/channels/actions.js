import { SET_CHANNEL, SET_PRIVATE_CHANNEL, SET_USER_POSTS } from './actionTypes'

export const setChannel = channel => ({
  type: SET_CHANNEL,
  payload: channel,
})

export const setPrivateChannel = isChannelPrivate => ({
  type: SET_PRIVATE_CHANNEL,
  payload: {
    isChannelPrivate,
  },
})

export const setUserPosts = userPosts => ({
  type: SET_USER_POSTS,
  payload: userPosts,
})
