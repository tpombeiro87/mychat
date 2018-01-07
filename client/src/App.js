import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import io from 'socket.io-client'

class App extends Component {
  constructor () {
    super()
    this.state = {
      myUserName: 'Tiago-' + parseInt(Math.random() * 10, 10),
      messages: [],
      socket: io('http://localhost:3030'),
      msgBox: ''
    }

    const addMessage = (newMessage) => {
      this.setState({
        messages: this.state.messages.concat(newMessage)
      })
    }
    this.state.socket.on('connect', () => addMessage({
      user: 'clientApp',
      msg: 'You are connected!'
    }))
    this.state.socket.on('message', addMessage)
    this.state.socket.on('disconnect', () => addMessage({
      user: 'clientApp',
      msg: 'You are disconnected!'
    }))
  }

  onKeyDown (event) {
    if (event.key === 'Enter') {
      console.log('Send Message')
      this.state.socket.emit('newMessage', {
        user: this.state.myUserName,
        msg: event.target.value
      })
      this.setState({
        msgBox: ''
      })
    }
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to Tiago Chat</h1>
        </header>
        <p className='App-intro'>
          Messages:
        </p>
        <ul>
          {
            this.state.messages.map((message, index) =>
              <li key={`msg--${index}`}>User: {message.user} :: {message.msg}</li>)
          }
        </ul>
        <input value={this.state.msgBox} onChange={(evt) => this.setState({msgBox: evt.target.value})} onKeyDown={(evt) => this.onKeyDown(evt)} />
      </div>
    )
  }
}

export default App
