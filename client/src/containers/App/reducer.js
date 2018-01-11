//@flow
import io from 'socket.io-client'

import { INITIALIZE_APP, NEW_MESSAGE, SEND_MESSAGE } from './actions'
import { Message } from './misc/MessageClass'

const SERVER_URL = 'http://localhost:3030'

type typeState = {
  myId: string,
  myNick: string,
  remoteUserNick: string,
  messages?: Array<Message>,
  socket: {},
  latestAction: string
}

type typeAction = {
  type: string,
  newMessage: {
    yourId?: string,
    msg: string,
    userId: string
  },
  initData: {}
}

const initialState = {
  myId: '',
  myNick: 'N.D.',
  remoteUserNick: 'N.D.',
  messages: [],
  socket: io(SERVER_URL),
  latestAction: '',
  action: {
    newMessage: {}
  }
}

const reducer = (state?: typeState = initialState, action: typeAction) => {
  switch (action.type) {
    case INITIALIZE_APP:
      return {
        ...state,
        ...action.initData,
        latestAction: INITIALIZE_APP
      }

    case NEW_MESSAGE:
      let newMessage = new Message(action.newMessage, state.myId)

      const {remoteUserNick = state.remoteUserNick,
           myNick = state.myNick} = newMessage.extractNicks(state.myId)

      let messages = state.messages || []
      const newId = action.newMessage ? action.newMessage.yourId : undefined
      if (newId) {
        // on reload we will need to reidentify our messages so they
        // appear to be from us on the ui
        // yourId is only sent by the server on connect
        const oldId = state.myId
        messages.forEach(message =>
          message.reidentifySender(newId, oldId)
        )
      }
      // oops command remove last message
      if (newMessage.commandInputed === 'oops' && messages) {
        messages = messages.slice(0, -1)
        console.log('will remove last message')
      }

      // add new message
      messages = messages.concat(newMessage)

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
