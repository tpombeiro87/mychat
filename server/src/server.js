const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

let users = {}

// Whenever someone connects this gets executed
io.on('connection', (socket) => {
  console.log('A user connected')

  setTimeout(function () {
    socket.send({
      user: 'system',
      msg: 'Welcome to Tiago Chat!'
    })
  }, 2000)

  socket.on('newMessage', (message) => {
    console.log('A message just reached..', message)
    // para tds menos o q enviou
    // socket.broadcast.emit('message', message)
    // para tds
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

server.listen(3030, () => {
  console.log('listening on *:3030')
})
