import io from 'socket.io-client'

import { INITIALIZE_APP, NEW_MESSAGE, SEND_MESSAGE } from './actions'
import localStorageManagement from './misc/localStorageManagement'
import { Message } from './misc/MessageClass'

const SERVER_URL = 'http://localhost:3030'

const initialState = {
  myId: undefined,
  myNick: 'N.D.',
  remoteUserNick: 'N.D.',
  messages: [],
  socket: io(SERVER_URL),
  latestAction: ''
}

const reducer = (state = initialState, action) => {
  debugger
  switch (action.type) {
    case INITIALIZE_APP:
      return {
        ...state,
        ...localStorageManagement.loadInitData(),
        latestAction: INITIALIZE_APP
      }

    case NEW_MESSAGE:
      let newMessage = new Message(action.newMessage, state.myId)

      const {remoteUserNick = state.remoteUserNick,
           myNick = state.myNick} = newMessage.extractNicks(state.myId)

      newMessage.executeCommandCountdown()

      let messages = state.messages
      const newId = action.newMessage.yourId
      if (newId) {
        // on reload we will need to reidentify our messages so they
        // appear to be from us on the ui
        // yourId is only sent by the server on connect
        const oldId = state.myId
        messages.forEach(message =>
          message.reidentifySender(newId, oldId)
        )
      }
      // oops
      if (newMessage.commandInputed === 'oops') {
        messages = messages.slice(0, -1)
        console.log('will remove last message')
      }

      // add new message
      messages = messages.concat(newMessage)
      // save to local storage new state
      localStorageManagement.update(messages, state.myId, state.myNick, state.remoteUserNick)

      return {
        ...state,
        myId: newId || state.myId, // update myid in case of server sends it!
        myNick,
        remoteUserNick,
        messages,
        latestAction: NEW_MESSAGE
      }

    case SEND_MESSAGE:
      return {
        ...state,
        latestAction: SEND_MESSAGE
      }

    default:
      return state
  }
}

export default reducer
