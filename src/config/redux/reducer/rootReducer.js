import { combineReducers } from 'redux'
import userReducer from './userReducer'
import interfaceReducer from './interfaceReducer'

const rootReducer = combineReducers({
  user: userReducer,
  interface: interfaceReducer,
})

export default rootReducer
