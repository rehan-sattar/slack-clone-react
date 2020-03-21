import { SET_CHANNEL } from './actionTypes'

export const setChannel = channel => ({
  type: SET_CHANNEL,
  payload: channel,
})
