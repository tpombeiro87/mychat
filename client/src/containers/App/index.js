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
      chattingToUserName: 'no one',
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
      chattingToUserName: (this.state.myId !== message.userId && message.userId !== 'system')
        ? message.userName
        : this.state.chattingToUserName,
      messages: this.state.messages.concat(message)
    })
  }

  onBtnSendClick (event) {
    const commandInputed = this.state.msgBox.split(' ')[0]

    if (commandInputed === '/nick') {
      const myUserName = this.state.msgBox.split(' ')[1]
      console.log('Change Nickname to', myUserName)
      this.setState({
        myUserName,
        msgBox: ''
      })
    } else {
      console.log('Send Normal Message')
      this.state.socket.emit('newMessage', {
        userName: this.state.myUserName,
        userId: this.state.myId,
        msg: this.state.msgBox
      })
      this.setState({
        msgBox: ''
      })
    }
  }

  render () {
    return (
      <div className='box'>
        <Header myUserName={this.state.myUserName} chattingToUserName={this.state.chattingToUserName} />
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
          onBtnSendClick={(evt) => this.onBtnSendClick(evt)} />
      </div>
    )
  }
}

export default App
