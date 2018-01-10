//@flow
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { initializeApp, sendMessage, NEW_MESSAGE, SEND_MESSAGE } from './actions'

import Header from '../../components/Header'
import Message from '../../components/Message'
import CustomInput from '../../components/CustomInput'
import './style.css'

type Props = {
  dispatch: Function,
  myNick: string,
  myId?: string,
  remoteUserNick: string,
  messages: Array<{
    sender: string,
    msg: string,
    commandInputed: string
  }>,
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
    if (this.state.msgBox === '') return
    this.props.dispatch(sendMessage(this.props.socket, this.props.myId, this.state.msgBox))
  }

  componentDidUpdate () {
    // on new messages scroll to the latest one
    if (this.props.latestAction === NEW_MESSAGE) {
      this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
    // reset msgbox wen message is sent
    } else if (this.props.latestAction === SEND_MESSAGE && this.state.msgBox !== '') {
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
              <Message key={`message--${index}`}
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
