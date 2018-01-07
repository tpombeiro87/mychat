const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const logger = require('./logger')

io.on('connection', (socket) => {
  logger.log(`A user connected id: ${socket.id}`)
  socket.send({
    userName: 'System',
    userId: 'system',
    yourId: socket.id,
    msg: 'Welcome to Tiago Chat!'
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
    logger.log(`A user disconnectedid: ${socket.id}`)
  })
})

server.listen(3030, () => {
  logger.log('Listening on *:3030')
})
