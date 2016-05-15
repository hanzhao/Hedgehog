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

const history = syncHistoryWithStore(browserHistory, store)

const router = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={MainPage} />
      </Route>
    </Router>
  </Provider>
)

// React Start!
ReactDOM.render(router, document.getElementById('react-root'))
