//@flow
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { initializeApp, sendMessage, NEW_MESSAGE, SEND_MESSAGE } from './actions'
import { Message as MessageClass} from './misc/MessageClass'
import localStorageManagement from './misc/localStorageManagement'

import Header from '../../components/Header'
import MessageComponent from '../../components/Message'
import CustomInput from '../../components/CustomInput'
import './style.css'

type Props = {
  dispatch: Function,
  myNick: string,
  myId?: string,
  remoteUserNick: string,
  messages: Array<MessageClass>,
  socket: {
    on: Function,
    emit: Function
  },
  latestAction: string
}

type State = {
  msgBox: string
}

class App extends Component<Props, State> {
  messagesEnd: HTMLDivElement

  constructor () {
    super()
    this.state = { msgBox: '' }
  }

  componentWillMount () {
    this.props.dispatch(initializeApp(this.props.socket))
  }

  onBtnSendClick () {
    // if empty dont send message
    if (this.state.msgBox !== '') {
      this.props.dispatch(sendMessage(this.props.socket, this.props.myId, this.state.msgBox))
    }
  }

  componentDidUpdate () {
    if (this.props.latestAction === NEW_MESSAGE) {
      // get last message and execute countdown command if necessary
      this.props.messages.slice(-1)[0].executeCommandCountdown(this.props.myId)
      // save to local storage new state
      localStorageManagement.update(this.props.messages, this.props.myId, this.props.myNick, this.props.remoteUserNick)
      // on new messages scroll to the latest one
      this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
    } else if (this.props.latestAction === SEND_MESSAGE && this.state.msgBox !== '') {
      // reset msgbox wen message is sent
      this.setState({msgBox: ''})
    }
  }

  render () {
    return (
      <div className='box'>
        <Header myNick={this.props.myNick} remoteUserNick={this.props.remoteUserNick} />
        <div className='message-holders'>
          {
            this.props.messages.map((message, index) =>
              <MessageComponent key={`message--${index}`}
                msg={message.msg}
                sender={message.sender}
                commandInputed={message.commandInputed} />
            )
          }
          <div ref={(el) => { if (el) this.messagesEnd = el }} />
        </div>
        <CustomInput
          value={this.state.msgBox}
          onChange={(evt) => this.setState({msgBox: evt.target.value})}
          onBtnSendClick={(evt) => this.onBtnSendClick()} />
      </div>
    )
  }
}

export default connect(
  // mapStateToProps
  (state) => state
)(App)
