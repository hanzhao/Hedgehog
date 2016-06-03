import React from 'react'
import { asyncConnect } from 'redux-connect'

import NavBar from '../NavBar'
import { loadInfo, isInfoLoaded } from '../../redux/modules/auth'

import './styles'

@asyncConnect(
  [{
    promise: ({ store: { dispatch, getState } }) => {
      const promises = []
      if (!isInfoLoaded(getState())) {
        promises.push(dispatch(loadInfo()))
      }
      return Promise.all(promises)
    }
  }]
)
class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        { this.props.children }
      </div>
    )
  }
}

export default App
