//@flow
import { Message } from './MessageClass'

const loadInitData = () => {
  let initData = {}
  try {
    let messages = JSON.parse(localStorage.getItem('messages') || '[]')
    let myId = localStorage.getItem('myId') || ''
    initData = {
      myId,
      messages: messages.map(message => new Message(message, myId)),
      myNick: localStorage.getItem('myNick') || undefined,
      remoteUserNick: localStorage.getItem('remoteUserNick') || undefined
    }
  } catch (err) {
    console.log(err)
  }
  return initData
}

const update = (messages: Array<Message>, myId?: string, myNick: string, remoteUserNick: string) => {
  let messagesToSave = messages
    .filter(m => m.userId !== 'system')
  messagesToSave = messagesToSave.slice(-10)
  localStorage.setItem('messages', JSON.stringify(messagesToSave))
  localStorage.setItem('myNick', myNick || '')
  localStorage.setItem('remoteUserNick', remoteUserNick || '')
  localStorage.setItem('myId', myId || '')
}

export default {
  loadInitData,
  update
}
