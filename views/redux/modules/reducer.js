import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { reducer as form } from 'redux-form'

import auth from './auth'
import device from './device'
import data from './data'

export default combineReducers({
  routing,
  reduxAsyncConnect,
  form,
  auth,
  device,
  data
})
