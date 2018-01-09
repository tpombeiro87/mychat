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
        msg: 'You are Disconnected!'
      }))
  }

  componentDidUpdate (prevProps, prevState) {
    let messages = this.state.messages
      .filter(m => m.userId !== 'system')
    messages = messages.slice(-10)
    localStorage.setItem('messages', JSON.stringify(messages))
    localStorage.setItem('myId', this.state.myId)
  }

  componentWillMount () {
    try {
      const myId = localStorage.getItem('myId')
      const messages = JSON.parse(localStorage.getItem('messages'))
      this.setState({myId, messages})
    } catch (err) {
      console.log(err)
    }
  }

  onNewMessage (message) {
    const commandInputed = message.msg.split(' ')[0]
    if (commandInputed === '/countdown' && message.userId !== this.state.myId) {
      console.log('will open tab..')
      window.open(message.msg.replace('/countdown ', ''), '_new')
    }

    if (commandInputed === '/nick' && message.userId !== this.state.myId) {
      const userName = message.msg.split(' ')[1]
      console.log('Change Nickname to', userName)
      this.setState({chattingToUserName: userName})
    }

    let messages = this.state.messages
    if (commandInputed === '/oops') {
      console.log('will remove last message')
      messages = this.state.messages.slice(0, -1)
    }

    if (message.yourId) {
      const oldId = this.state.myId
      messages = messages.map(msg =>
        (msg.userId === oldId)
        ? {...msg, userId: message.yourId}
        : msg
      )
    }

    this.setState({
      myId: message.yourId || this.state.myId,
      messages: messages.concat(message)
    })
    this.scrollToBottom()
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

  scrollToBottom () {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
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
          <div style={{ float: 'left', clear: 'both' }}
            ref={(el) => { this.messagesEnd = el }} />
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
