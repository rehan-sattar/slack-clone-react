import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import reducer from './roorReducer'

export default createStore(reducer, composeWithDevTools())
