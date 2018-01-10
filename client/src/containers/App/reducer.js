import { NEW_MESSAGE, SEND_MESSAGE } from './actions'
import io from 'socket.io-client'

const SERVER_URL = 'http://localhost:3030'

const initialState = {
  myNick: 'N.D.',
  myId: undefined,
  remoteUserNick: 'N.D.',
  messages: [],
  socket: io(SERVER_URL),
  latestAction: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NEW_MESSAGE:
      let newMessage = Object.assign({}, action.newMessage)
      // checking for commands
      const validCommands = ['/think', '/highlight', '/countdown', '/fadelast', '/oops']
      const commandInputed = newMessage.msg.split(' ')[0]
      if (validCommands.includes(commandInputed)) {
        newMessage.commandInputed = commandInputed
      }

      // to identify origin of message
      if (newMessage.userId === 'system') newMessage.sender = 'system'
      else if (newMessage.userId === state.myId) newMessage.sender = 'self'
      else newMessage.sender = 'remote'

      // emoji support
      newMessage.msg = newMessage.msg
        .replace(new RegExp('(;[)])', 'g'), '😉')
        .replace(new RegExp('(:[)])', 'g'), '😊')

      // remote user changed nick
      let remoteUserNick = state.remoteUserNick
      if (commandInputed === '/nick' && newMessage.userId !== state.myId) {
        remoteUserNick = newMessage.msg.split(' ')[1]
        console.log('remote user changed nick to', remoteUserNick)
      }
      // I changed nick
      let myNick = state.myNick
      if (commandInputed === '/nick' && newMessage.userId === state.myId) {
        myNick = newMessage.msg.split(' ')[1]
        console.log('I changed nickname to', myNick)
      }

      let messages = state.messages
      // oops
      if (commandInputed === '/oops') {
        console.log('will remove last message')
        messages = state.messages.slice(0, -1)
      }

      // on reload we will need to reidentify our messages so they
      // appear to be from us on the ui
      // yourId is only sent by the server on connect
      if (newMessage.yourId) {
        const oldId = state.myId
        messages = messages.map(msg =>
          (msg.userId === oldId)
          ? {...msg, userId: newMessage.yourId}
          : msg
        )
      }

      // update messages and id in case of srever sends it!
      return {
        ...state,
        myId: newMessage.yourId || state.myId,
        myNick,
        remoteUserNick,
        messages: messages.concat(newMessage),
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
