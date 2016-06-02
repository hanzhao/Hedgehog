'use strict'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { ReduxAsyncConnect } from 'redux-connect'
import { syncHistoryWithStore } from 'react-router-redux'

import store from './redux/store'

import App from './components/App'
import MainPage from './components/MainPage'
import SignUpPage from './components/SignUpPage'
import LogInPage from './components/LogInPage'
import Panel from './components/Panel'
import DeviceTypesPage from './components/DeviceTypesPage'
import AddDeviceTypePage from './components/AddDeviceTypePage'
import DevicesPage from './components/DevicesPage'
import DataOverviewPage from './components/DataOverviewPage'
import DeviceDataPage from './components/DeviceDataPage'

const history = syncHistoryWithStore(browserHistory, store)

const router = (
  <Provider store={store}>
    <Router history={history}
            render={(props) => <ReduxAsyncConnect {...props} />}>
      <Route path="/" component={App}>
        <IndexRoute component={MainPage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/login" component={LogInPage} />
        <Route path="/" component={Panel}>
          <Route path="/types" component={DeviceTypesPage} />
          <Route path="/type/add" component={AddDeviceTypePage} />
          <Route path="/devices" component={DevicesPage} />
          <Route path="/overview" component={DataOverviewPage} />
          <Route path="/device/:deviceId/data" component={DeviceDataPage} />
        </Route>
      </Route>
    </Router>
  </Provider>
)

// React Start!
ReactDOM.render(router, document.getElementById('react-root'))
