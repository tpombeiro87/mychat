//@flow
import React, { Component } from 'react'
import io from 'socket.io-client'

import Header from '../../components/Header'
import Message from '../../components/Message'
import CustomInput from '../../components/CustomInput'
import './style.css'

const SERVER_URL = 'http://localhost:3030'

type Props = {}

type State = {
  myUserName: string,
  myId?: string,
  chattingToUserName: string,
  messages: Array<{
    userName: string,
    userId: string,
    msg: string
  }>,
  msgBox: string,
  socket: {
    on: Function,
    emit: Function
  }
}

class App extends Component<Props, State> {
  messagesEnd: {
    scrollIntoView: Function
  }

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
        userName: 'System',
        userId: 'system',
        msg: 'You are Disconnected!'
      }))
  }

  componentWillMount () {
    try {
      const myId = localStorage.getItem('myId') || undefined
      const messages = JSON.parse(localStorage.getItem('messages') || '[]')
      const myUserName = localStorage.getItem('myUserName') || this.state.myUserName
      const chattingToUserName = localStorage.getItem('chattingToUserName') || this.state.chattingToUserName
      this.setState({myId, myUserName, chattingToUserName, messages})
    } catch (err) {
      console.log(err)
    }
  }

  updateLocalStorage () {
    let messages = this.state.messages
      .filter(m => m.userId !== 'system')
    messages = messages.slice(-10)
    localStorage.setItem('messages', JSON.stringify(messages))
    localStorage.setItem('myUserName', this.state.myUserName ? this.state.myUserName : '')
    localStorage.setItem('chattingToUserName', this.state.chattingToUserName ? this.state.chattingToUserName : '')
    localStorage.setItem('myId', this.state.myId ? this.state.myId : '')
  }

  onNewMessage (message: {msg: string, userId: string, userName: string, yourId?: string}) {
    const commandInputed = message.msg.split(' ')[0]
    // countdown
    if (commandInputed === '/countdown' && message.userId !== this.state.myId) {
      console.log('will open tab..')
      window.open(message.msg.replace('/countdown ', ''), '_new')
    }

    // nick set other guys nick on our chat
    if (commandInputed === '/nick' && message.userId !== this.state.myId) {
      const userName = message.msg.split(' ')[1]
      console.log('change nickname to', userName)
      this.setState({chattingToUserName: userName})
    }

    let messages = this.state.messages
    // oops
    if (commandInputed === '/oops') {
      console.log('will remove last message')
      messages = this.state.messages.slice(0, -1)
    }

    // on reload we will need to reidentify our messages so they
    // appear to be from us on the ui
    if (message.yourId) {
      const oldId = this.state.myId
      messages = messages.map(msg =>
        (msg.userId === oldId)
        ? {...msg, userId: message.yourId}
        : msg
      )
    }
    // update messages and id in case of srever sends it!
    this.setState({
      myId: message.yourId || this.state.myId,
      messages: messages.concat(message)
    })
    this.scrollToBottom()
    this.updateLocalStorage()
  }

  onBtnSendClick () {
    // if empty dont send message
    if (this.state.msgBox === '') return
    const commandInputed = this.state.msgBox.split(' ')[0]

    // countdown
    if (commandInputed === '/countdown') {
      console.log('Send Countdown Message')
      for (let i = 0; i <= 5; i++) {
        const sendCountDownMsg = (finalMsg) => {
          this.state.socket.emit('newMessage', {
            userId: this.state.myId,
            msg: i !== 5 ? `${5 - i}` : finalMsg
          })
        }
        setTimeout(sendCountDownMsg
          .bind(this, this.state.msgBox), 1000 * (i + 1)
        )
      }
    // normal message
    } else {
      console.log('Send Normal Message')
      this.state.socket.emit('newMessage', {
        userName: this.state.myUserName,
        userId: this.state.myId,
        msg: this.state.msgBox
      })
    }
    // reset of the area box value and set self nick
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
              <Message key={`message--${index}`}
                myId={this.state.myId}
                {...message} />
            )
          }
          <div ref={(el) => { this.messagesEnd = el }} />
        </div>
        <CustomInput
          value={this.state.msgBox}
          onChange={(evt) => this.setState({msgBox: evt.target.value})}
          onBtnSendClick={(evt) => this.onBtnSendClick()} />
      </div>
    )
  }
}

export default App
