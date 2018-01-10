// @ flow
export const INITIALIZE_APP = 'INITIALIZE_APP'
export const initializeApp = (socket) => {
  return (dispatch) => {
    socket.on('message',
      (message) => {
        dispatch(onNewMessage(message))
      })
    socket.on('disconnect',
      () => dispatch(onNewMessage({
        userId: 'system',
        msg: 'You are Disconnected!'
      })))
  }
}

export const NEW_MESSAGE = 'NEW_MESSAGE'
// : {msg: string, userId: string, userName: string, yourId?: string}
export const onNewMessage = (newMessage) => {
  return {
    type: NEW_MESSAGE,
    newMessage
  }
}

export const SEND_MESSAGE = 'SEND_MESSAGE'
export const sendMessage = (socket, myId, messageTxt) => {
  return (dispatch) => {
    const commandInputed = messageTxt.split(' ')[0]

    // countdown
    if (commandInputed === '/countdown') {
      console.log('Send Countdown Message')
      for (let i = 0; i <= 5; i++) {
        const sendCountDownMsg = (finalMsg) => {
          socket.emit('newMessage', {
            userId: myId,
            msg: i !== 5 ? `${5 - i}` : finalMsg
          })
        }
        setTimeout(sendCountDownMsg
          .bind(this, // tobe runned in this context
             messageTxt // last message to emit
           ), 1000 * (i + 1) // every one second
        )
      }

    // normal message
    } else {
      console.log('send Normal Message')
      socket.emit('newMessage', { userId: myId, msg: messageTxt })
    }

    // reset of the area box value and set self nick
    dispatch({
      type: SEND_MESSAGE
    })
  }
}

// loadFromLocalStorage () {
//   try {
//     const myId = localStorage.getItem('myId') || undefined
//     const messages = JSON.parse(localStorage.getItem('messages') || '[]')
//     const myNick = localStorage.getItem('myNick') || this.state.myNick
//     const  remoteUserNick = localStorage.getItem(' remoteUserNick') || this.state. remoteUserNick
//     this.setState({myId, myNick,  remoteUserNick, messages})
//   } catch (err) {
//     console.log(err)
//   }
// }
//
// updateLocalStorage () {
//   let messages = this.state.messages
//     .filter(m => m.userId !== 'system')
//   messages = messages.slice(-10)
//   localStorage.setItem('messages', JSON.stringify(messages))
//   localStorage.setItem('myNick', this.state.myNick ? this.state.myNick : '')
//   localStorage.setItem(' remoteUserNick', this.state. remoteUserNick ? this.state. remoteUserNick : '')
//   localStorage.setItem('myId', this.state.myId ? this.state.myId : '')
// }
