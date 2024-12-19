import express from 'express'
import { Server } from "socket.io"

const PORT = process.env.PORT || 3500

const app = express()

const expressServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});

// Create socket.io server
const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from react app (hopefully?!)
    methods: ["GET", "POST"], // Allowed methods
  },
})

io.on('connection', socket => {
  console.log(`User ${socket.id} connected`)

  socket.on('message', (data) => {
    console.log(data);
    io.emit('message', data)
  })

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`)
  })
})