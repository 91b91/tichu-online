// backedn index.js
import express from 'express';
import { Server } from 'socket.io';
import roomsState from './roomsState.js'; // Import roomsState
import User from './userClass.js'; // Import User class

const PORT = process.env.PORT || 3500;
const SERVER_MSG_TAG = '[SERVER]';

const app = express();

const expressServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Create socket.io using express
const io = new Server(expressServer, {
  cors: {
    origin: 'http://localhost:5173', // Allow requests from your React app
    methods: ['GET', 'POST'], // Allowed methods
  },
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on('enterRoom', ({ name, userId, room }) => {
    console.log(`User with userId: ${userId} wants to join room: ${room}`);

    // Handle leaving the previous room
    const prevRoom = roomsState.getRoomBySocket(socket.id);
    if (prevRoom) {
      socket.leave(prevRoom.roomId);
      io.to(prevRoom.roomId).emit('message', buildMsg(SERVER_MSG_TAG, name, 'has left the room'));

      // Update the user list for the previous room
      io.to(prevRoom.roomId).emit('userList', {
        users: prevRoom.users.map(user => ({ userId: user.userId, name: user.name })),
      });
    }

    // Add the user to the new room
    const user = new User(name, userId, socket.id);
    try {
      roomsState.addUserToRoom(room, user);
      socket.join(room);
      socket.emit('joinedRoom');

      // Notify users in the new room
      io.to(room).emit('message', buildMsg(SERVER_MSG_TAG, name, 'has joined the room'));
      io.to(room).emit('userList', {
        users: roomsState.rooms[room].users.map(user => ({ userId: user.userId, name: user.name })),
      });
    } catch (error) {
      socket.emit('roomJoinError', error.message);
    }
  });

  socket.on('disconnect', () => {
    const room = roomsState.getRoomBySocket(socket.id);
    if (room) {
      const user = room.getUserBySocketId(socket.id);
      roomsState.removeUserFromRoom(room.roomId, socket.id);

      // Notify the room of the user leaving
      io.to(room.roomId).emit('message', buildMsg(SERVER_MSG_TAG, user?.name || 'Unknown User', 'has disconnected'));
      io.to(room.roomId).emit('userList', {
        users: room.users.map(user => ({ userId: user.userId, name: user.name })),
      });
    }

    console.log(`User ${socket.id} disconnected`);
  });

  socket.on('message', (data) => {
    const room = roomsState.getRoomBySocket(socket.id);
    if (room) {
      io.to(room.roomId).emit('message', data);
    }
  });
});

// Helper function to build messages
function buildMsg(tag, name, text) {
  return {
    tag: tag,
    name: name,
    text: text,
  };
}
