const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const logger = require('./logger')
let users = []
io.on('connection', (socket) => {
  if (users.length < 2) {
    users = users.concat(socket.id)
    logger.log(`A user connected id: ${socket.id}, num of users on: ${users.length}`)
  } else {
    logger.log(`Disconnected! Already two users on the chat!`)
    socket.send({
      userId: 'system',
      yourId: socket.id,
      msg: 'The chat is full!'
    })
    socket.disconnect()
  }
  socket.send({
    userId: 'system',
    yourId: socket.id,
    msg: 'Connected to Tiago Chat!'
  })

  socket.on('newMessage', (message) => {
    logger.log(`socket.id :: ${socket.id}`)
    if (message.userId === socket.id) {
      logger.log(`Emitting message now.. ${JSON.stringify(message)}`)
      io.emit('message', message)
    } else {
      logger.error(`Message rejected.. impersonation attempt ${JSON.stringify(message)}`)
    }
  })

  socket.on('disconnect', () => {
    users.splice(users.indexOf(socket.id))
    logger.log(`A user disconnectedid: ${socket.id}, num of users on: ${users.length}`)
  })
})

server.listen(3030, () => {
  logger.log('Listening on *:3030')
})
