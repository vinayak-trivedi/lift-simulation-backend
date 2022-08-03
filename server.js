const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
    cors: {
      origins: ['http://127.0.0.1:5500/']
    }
});
app.get('/', (req, res) => {
    res.send("lift-simulation-backend")
})

io.on('connection',(socket) => {
    const userDevice =socket.handshake.query.userdevice;  
    console.log('A user connected')
    console.log(userDevice)
    socket.on('create', (room) => {
        socket.join(room)
        console.log(`Joined room ${room}`)
    })
    socket.on('addfloor', () => {
        io.to(userDevice).emit('addfloor', ++floors)
    })
    socket.on('removefloor',() => {
        io.to(userDevice).emit('removefloor', --floors)
    })
    socket.on('addlift', () => {
        io.to(userDevice).emit('addlift')
    })
    socket.on('removelift', () => {
        io.to(userDevice).emit('removelift')
    })
    socket.on('called', called)

})

const called = (calledOn, device) => {
    io.to(device).emit('move', calledOn)
}
server.listen(process.env.PORT)