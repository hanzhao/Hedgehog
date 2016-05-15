'use strict'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import store from './redux/store'

import App from './components/App'
import MainPage from './components/MainPage'
import Panel from './components/Panel'
import DevicesPage from './components/DevicesPage'
import DataPage from './components/DataPage'
import AddDeviceType from './components/AddDeviceType'

const history = syncHistoryWithStore(browserHistory, store)

const router = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={MainPage} />
        <Route path="/" component={Panel}>
          <Route path="/devices" component={DevicesPage} />
          <Route path="/types" component={AddDeviceType} />
          <Route path="/data" component={DataPage} />
        </Route>
      </Route>
    </Router>
  </Provider>
)

// React Start!
ReactDOM.render(router, document.getElementById('react-root'))
