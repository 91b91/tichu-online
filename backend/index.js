import express from 'express'
import { Server } from "socket.io"

const PORT = process.env.PORT || 3500;

const app = express();

const expressServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// create socket.io using express
const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from react app (hopefully?!)
    methods: ["GET", "POST"], // Allowed methods
  },
})

// keep track list of users - could be updated to database in future
const UsersState = {
  users: [],
  setUsers: function(newUsersArray) {
    this.users = newUsersArray;
  }
}

io.on('connection', socket => {
  console.log(`User ${socket.id} connected`);

  socket.on('enterRoom', ({ name, room }) => {
    // leave the previous room - TBD: might not be necessary with later design
    const prevRoom = getUser(socket.id)?.room;
    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit('message', `${name} has left the room`)
    }

    // activate the user
    const user = addUser(socket.id, name, room);

    // join room
    socket.join(user.room);
    io.to(user.room).emit('message', `${name} has joined the room`)
  });

  socket.on('disconnect', () => {
    // make sure the user state is updated
    const user = getUser(socket.id);
    removeUser(socket.id);

    console.log(`User ${socket.id} disconnected`)
  })

  socket.on('message', (data) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit('message', data);
    }
  })
})

function addUser(id, name, room) {
  const user = { id, name, room }
  UsersState.setUsers([
    ...UsersState.users.filter(user => user.id !== id),
    user
  ])
  return user;
}

function removeUser(id) {
  return UsersState.users.filter(user => user.id !== id);
}

function getUser(id) {
  return UsersState.users.find(user => user.id === id);
}