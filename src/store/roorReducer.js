import { combineReducers } from 'redux'

import { userReducer } from './auth/reducers'

export default combineReducers({
  user: userReducer,
})
