import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import io from 'socket.io-client'

const SERVER_URL = 'http://localhost:3030'

class App extends Component {
  constructor () {
    super()
    this.state = {
      myUserName: 'Anonymous User - ' + parseInt(Math.random() * 100, 10),
      myId: undefined,
      messages: [],
      msgBox: '',
      socket: io(SERVER_URL)
    }

    const addMessage = (newMessage) => {
      this.setState({
        myId: newMessage.yourId,
        messages: this.state.messages.concat(newMessage)
      })
    }

    this.state.socket.on('message', addMessage)
    this.state.socket.on('disconnect', () => addMessage({
      userId: 'clientApp',
      msg: 'You are disconnected!'
    }))
  }

  onKeyDown (event) {
    if (event.key === 'Enter') {
      console.log('Send Message')
      this.state.socket.emit('newMessage', {
        userName: this.state.myUserName,
        userId: this.state.myId,
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
              <li key={`msg--${index}`}>User: {message.userName} :: {message.msg}</li>)
          }
        </ul>
        <div className=''>
          <input value={this.state.msgBox} onChange={(evt) => this.setState({msgBox: evt.target.value})} onKeyDown={(evt) => this.onKeyDown(evt)} />
        </div>
      </div>
    )
  }
}

export default App
