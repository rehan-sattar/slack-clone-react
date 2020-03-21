import { combineReducers } from 'redux'

import { userReducer } from './auth/reducers'
import { channelReducer } from './channels/reducers'

export default combineReducers({
  user: userReducer,
  channel: channelReducer,
})
