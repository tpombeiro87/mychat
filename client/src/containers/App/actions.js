//@flow
import localStorageManagement from './misc/localStorageManagement'

type typeSocket = {
  on: Function,
  emit: Function
}

export const INITIALIZE_APP = 'INITIALIZE_APP'
export const initializeApp = (socket: typeSocket) => {
  return (dispatch: Function) => {
    socket.on('message',
      (message) => {
        dispatch(onNewMessage(message))
      })
    socket.on('disconnect',
      () => dispatch(onNewMessage({
        userId: 'system',
        msg: 'You are Disconnected!'
      })))

    dispatch({
      initData: localStorageManagement.loadInitData(),
      type: INITIALIZE_APP
    })
  }
}

export const NEW_MESSAGE = 'NEW_MESSAGE'
export const onNewMessage = (newMessage: {msg: string, userId: string}) => {
  return {
    type: NEW_MESSAGE,
    newMessage
  }
}

export const SEND_MESSAGE = 'SEND_MESSAGE'
export const sendMessage = (socket: typeSocket, myId?: string, messageTxt: string) => {
  return (dispatch: Function) => {
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
