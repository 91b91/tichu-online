// backedn index.js
import express from 'express';
import { Server } from 'socket.io';
import roomsState from './roomsState.js';
import User from './user.js';
import Play from './play.js'

const PORT = process.env.PORT || 3500;
const SERVER_MSG_TAG = '[SERVER]';

const app = express();

const expressServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Create socket.io using express
const io = new Server(expressServer, {
  cors: {
    origin: 'http://localhost:5173', // Allow requests from React frontend during development
    methods: ['GET', 'POST'], // Allowed methods
  },
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  // ---- ENTERING A ROOM ----
  socket.on('enterRoom', ({ name, userId, room }) => {
    console.log(`User with userId: ${userId} wants to join room: ${room}`);

    // Handle leaving the previous room
    const prevRoom = roomsState.getRoomBySocket(socket.id);
    if (prevRoom) {
      socket.leave(prevRoom.roomId);
      roomsState.removeUserFromRoom(prevRoom.roomId, socket.id);

      io.to(prevRoom.roomId).emit('message', 
        buildMsg(SERVER_MSG_TAG, name, 'has left the room')
      );

      io.to(prevRoom.roomId).emit('userList', {
        users: prevRoom.getUserList()
      });
    }

    // Add the user to the new room
    const user = new User(name, userId, socket.id);
    try {
      // Try to add the user (Error when duplicate name OR full capacity)
      roomsState.addUserToRoom(room, user);
      socket.join(room);
      socket.emit('roomJoinSuccess');

      // Notify users in the new room
      io.to(room).emit('message', buildMsg(SERVER_MSG_TAG, name, 'has joined the room'));
      io.to(room).emit('userList', {
        users: roomsState.rooms[room].getUserList()
      });
    } catch (error) {
      socket.emit('roomJoinError', error.message);
    }
  });

  // ---- DISCONNECTING ----
  socket.on('disconnect', () => {
    const room = roomsState.getRoomBySocket(socket.id);
    if (room) {
      const user = room.getUserBySocketId(socket.id);
      roomsState.removeUserFromRoom(room.roomId, socket.id);

      // Notify the room of the user leaving
      io.to(room.roomId).emit('message', buildMsg(SERVER_MSG_TAG, user?.name 
        || 'Unknown User', 'has disconnected'));
      
      // Update the user list for that room
      io.to(room.roomId).emit('userList', {
        users: room.getUserList()
      });
    }

    console.log(`User ${socket.id} disconnected`);
  });

  // ---- MESSAGES FROM USERS ----
  socket.on('message', (data) => {
    const room = roomsState.getRoomBySocket(socket.id);
    if (room) {
      io.to(room.roomId).emit('message', data);
    }
  });

  // ---- USER TEAM UPDATES ----
  socket.on('updateUsersTeam', ({ userId, team }) => {
    const room = roomsState.getRoomBySocket(socket.id);
    if (room) {
      const user = room.getUserByUserId(userId);
      user.setTeam(team)
      
      // Update the user list for that room
      io.to(room.roomId).emit('userList', {
        users: room.getUserList()
      });
    }
  });

  // ---- START GAME REQUEST ----
  socket.on('startGameRequest', ({ roomId }) => {
    const room = roomsState.getRoomByRoomId(roomId);
    try {
      room.initializeGame(roomId);
      // Update the user list for that room (hands have been updated);
      io.to(room.roomId).emit('userList', {
        users: room.getUserList()
      });
      // Alert all users in the room that the game has started
      io.to(room.roomId).emit('startGameSuccess')
    } catch (error) {
      socket.emit('startGameError', error.message)
    }
  });

  // ---- PLAY SELECTED CARDS REQUEST ----
  socket.on('playSelectedCardsRequest', ({ userId, selectedCards }) => {
    const room = roomsState.getRoomByUserId(userId);
    if (!room) {
      console.log('OH NO');
      return;
    }
    try {
      room.addToPlayStack(new Play(userId, selectedCards));

      io.to(room.roomId).emit('playStack', 
        room.getPlayStackJSON()
      );

      console.log(room.getPlayStackJSON());

      io.to(room.roomId).emit('playSelectedCardsSuccess')
    } catch(error) {
      socket.emit('playSelectedCardsError', error.message);
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
