import express from 'express'
import { Server } from "socket.io"

const PORT = process.env.PORT || 3500;
const SERVER_MSG_TAG = '[SERVER]';

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

  socket.on('enterRoom', ({ name, userId, room }) => {
    console.log(`user with uuid: ${userId} wants to join the room ${room}`)
    const prevRoom = getUser(socket.id)?.room;
    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit('message', buildMsg(SERVER_MSG_TAG, name, 'has left the room'));
    }

    // activate the user
    const user = addUser(socket.id, name, room);

    // update the previous rooms user list
    if (prevRoom) {
      io.to(prevRoom).emit('userList', {
        users: getUsersInRoom(prevRoom)
      });
    }

    // join room
    socket.join(user.room);
    io.to(user.room).emit('message', buildMsg(SERVER_MSG_TAG, name, 'has joined the room'));

    // update the user list for the current room
    io.to(user.room).emit('userList', {
      users: getUsersInRoom(user.room)
    });
  });

  socket.on('disconnect', () => {
    // make sure the user state is updated
    const user = getUser(socket.id);
    removeUser(socket.id);

    console.log(`User ${socket.id} disconnected`);
  });

  socket.on('message', (data) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit('message', data);
    }
  });
});


function addUser(id, name, room) {
  const user = { id, name, room }
  UsersState.setUsers([
    ...UsersState.users.filter(user => user.id !== id),
    user
  ])
  return user;
}

function removeUser(id) {
  UsersState.setUsers(UsersState.users.filter(user => user.id !== id));
}

function getUser(id) {
  return UsersState.users.find(user => user.id === id);
}

function getUsersInRoom(room) {
  return UsersState.users.filter(user => user.room === room);
}

function buildMsg(tag, name, text) {
  return {
    tag: tag,
    name: name,
    text: text
  }
}