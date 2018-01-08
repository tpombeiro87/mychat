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
      myUserName: 'N.D.',
      myId: undefined,
      chattingToUserName: 'N.D.',
      messages: [],
      msgBox: '',
      socket: io(SERVER_URL)
    }

    this.state.socket.on('message',
      (message) => {
        this.onNewMessage(message)
      }
    )
    this.state.socket.on('disconnect',
      () => this.onNewMessage({
        userId: 'system',
        msg: 'You are disconnected!'
      }))
  }

  onNewMessage (message) {
    const commandInputed = message.msg.split(' ')[0]
    if (commandInputed === '/countdown' && message.userId !== this.state.myId) {
      console.log('will open tab..')
      window.open(message.msg.replace('/countdown ', ''), '_new')
    }

    if (commandInputed === '/nick') {
      const userName = this.state.msgBox.split(' ')[1]
      console.log('Change Nickname to', userName)
      this.setState({chattingToUserName: userName})
    }

    if (commandInputed === '/oops') {
      console.log('will remove last message')
      const newMessages = this.state.messages.slice(0, -1)
      this.setState({messages: newMessages})
    } else {
      this.setState({
        myId: message.yourId || this.state.myId,
        messages: this.state.messages.concat(message)
      })
    }
  }

  onBtnSendClick (event) {
    const commandInputed = this.state.msgBox.split(' ')[0]

    if (commandInputed === '/countdown') {
      console.log('Send Countdown Message')
      for (let i = 0; i <= 5; i++) {
        const sendCountDownMsg = (finalMsg) => {
          this.state.socket.emit('newMessage', {
            userId: this.state.myId,
            msg: i !== 5 ? `${5 - i}` : finalMsg
          })
        }
        setTimeout(sendCountDownMsg.bind(this, this.state.msgBox), 1000 * (i + 1))
      }
    } else {
      console.log('Send Normal Message')
      this.state.socket.emit('newMessage', {
        userName: this.state.myUserName,
        userId: this.state.myId,
        msg: this.state.msgBox
      })
    }
    this.setState({
      myUserName: commandInputed === '/nick'
        ? this.state.msgBox.split(' ')[1]
        : this.state.myUserName,
      msgBox: ''
    })
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
