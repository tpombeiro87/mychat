import React, { Component } from 'react'
import io from 'socket.io-client'

import Header from '../../components/Header'
import Message from '../../components/Message'
import CustomInput from '../../components/CustomInput'
import './style.css'

const SERVER_URL = 'http://localhost:3030'

class App extends Component {
  constructor () {
    super()
    this.state = {
      myUserName: 'Anonymous User - ' + parseInt(Math.random() * 100, 10),
      myId: undefined,
      chattingToUserName: 'none',
      messages: [],
      msgBox: '',
      socket: io(SERVER_URL)
    }

    this.state.socket.on('message',
      (message) => {
        this.addMessage(message)
      }
    )
    this.state.socket.on('disconnect',
      () => this.addMessage({
        userId: 'system',
        msg: 'You are disconnected!'
      }))
  }

  addMessage (message) {
    this.setState({
      myId: message.yourId || this.state.myId,
      messages: this.state.messages.concat(message)
    })
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
      <div className='box'>
        <Header chattingToUserName={this.state.chattingToUserName} />
        <div className='message-holders'>
          {
            this.state.messages.map((message, index) =>
              <Message key={`message--${index}`} myId={this.state.myId} {...message} />
            )
          }
        </div>
        <CustomInput
          value={this.state.msgBox}
          onChange={(evt) => this.setState({msgBox: evt.target.value})}
          onKeyDown={(evt) => this.onKeyDown(evt)} />
      </div>
    )
  }
}

export default App
