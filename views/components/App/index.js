import React from 'react'

import NavBar from '../NavBar'
import LoginForm from '../LoginForm'

import './styles'

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <LoginForm />
        { this.props.children }
      </div>
    )
  }
}

export default App
