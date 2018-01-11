//@flow

class Message {
  msg: string
  userId: string
  commandInputed: string
  sender: string

  constructor (rawMsg: {msg: string, userId: string}, myId: string) {
    this.msg = rawMsg.msg
    this.userId = rawMsg.userId

    this._setCommandInputed()
    this._defineSender(myId)
    this._emojisTranslations()
  }

  extractNicks (myId: string) {
    let remoteUserNick
    let myNick
    if (this.commandInputed === 'nick') {
      if (this.userId !== myId) {
        remoteUserNick = this.msg.split(' ')[1]
        console.log('remote user changed nick to', remoteUserNick)
      }
      if (this.userId === myId) {
        myNick = this.msg.split(' ')[1]
        console.log('I changed nickname to', myNick)
      }
    }
    return {myNick, remoteUserNick}
  }

  reidentifySender (newId: string, oldId: string) {
    if (this.userId === oldId) {
      this.userId = newId
    }
  }

  executeCommandCountdown (myId?: string) {
    if (this.commandInputed === 'countdown' && this.userId !== myId) {
      console.log('will open tab..')
      window.open(this.msg.replace('/countdown ', ''), '_new')
    }
  }

  _setCommandInputed () {
    const commandInputed = this.msg.split(' ')[0]
    const validCommands = ['/nick', '/think', '/highlight', '/countdown', '/fadelast', '/oops']
    if (validCommands.includes(commandInputed)) {
      this.commandInputed = commandInputed.replace('/', '')
    }
  }

  _defineSender (myId: string) {
    // to identify origin of message
    if (this.userId === 'system') {
      this.sender = 'system'
    } else if (this.userId === myId) {
      this.sender = 'self'
    } else {
      this.sender = 'remote'
    }
  }

  _emojisTranslations () {
    // emoji support
    this.msg = this.msg
      .replace(new RegExp('(;[)])', 'g'), '😉')
      .replace(new RegExp('(:[)])', 'g'), '😊')
  }
}

exports.Message = Message
