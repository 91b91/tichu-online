// backedn index.js
import express from 'express';
import { Server } from 'socket.io';
import RoomRegistary from './RoomRegistary.js';
import User from './user.js';
import Play from './play.js'

// TEST SHARED FOLDER IS WORKING
import { testSharedCode } from '../shared/game/play-validation.js';
console.log('Backend test:', testSharedCode());

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
    const prevRoom = RoomRegistary.getRoomBySocket(socket.id);
    if (prevRoom) {
      socket.leave(prevRoom.roomId);
      RoomRegistary.removeUserFromRoom(prevRoom.roomId, socket.id);

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
      RoomRegistary.addUserToRoom(room, user);
      socket.join(room);
      socket.emit('roomJoinSuccess');

      // Notify users in the new room
      io.to(room).emit('message', buildMsg(SERVER_MSG_TAG, name, 'has joined the room'));
      io.to(room).emit('userList', {
        users: RoomRegistary.rooms[room].getUserList()
      });
    } catch (error) {
      socket.emit('roomJoinError', error.message);
    }
  });

  // ---- DISCONNECTING ----
  socket.on('disconnect', () => {
    const room = RoomRegistary.getRoomBySocket(socket.id);
    if (room) {
      const user = room.getUserBySocketId(socket.id);
      RoomRegistary.removeUserFromRoom(room.roomId, socket.id);

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
    const room = RoomRegistary.getRoomBySocket(socket.id);
    if (room) {
      io.to(room.roomId).emit('message', data);
    }
  });

  // ---- USER TEAM UPDATES ----
  socket.on('updateUsersTeam', ({ userId, team }) => {
    const room = RoomRegistary.getRoomBySocket(socket.id);
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
    const room = RoomRegistary.getRoomByRoomId(roomId);
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
    const room = RoomRegistary.getRoomByUserId(userId);
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

  // ---- TICHU -----
  socket.on('callTichuRequest', ({ userId }) => {
    const room = RoomRegistary.getRoomByUserId(userId);
    const user = room.getUserByUserId(userId);

    user.callTichu();

    io.to(room.roomId).emit('userList', {
      users: room.getUserList()
    });

    socket.emit('callTichuSuccess')
  });

  // ---- UPDATE GAME STATE ----
  socket.on('updateUserProgressRequest', ({ userId, userProgress }) => {
    const room = RoomRegistary.getRoomByUserId(userId);
    try {
      const user = room.getUserByUserId(userId);

      user.updateProgressState(userProgress);

      io.to(room.roomId).emit('userList', {
        users: room.getUserList()
      });

      io.to(room.roomId).emit('updateUserProgressSuccess');
    } catch(error) {
      socket.emit('updateUserProgressFailure', error.message);
    }
  });


  // ---- FLIP CARDS ----
  socket.on('flipCardsRequest', ({ userId }) =>  {
    const room = RoomRegistary.getRoomByUserId(userId);
    try {
      const user = room.getUserByUserId(userId);
      
      user.flipCards();

      io.to(room.roomId).emit('userList', {
        users: room.getUserList()
      });

      io.to(room.roomId).emit('flipCardsSuccess');
    } catch(error) {
      console.log(error.message);
      socket.emit('flipCardsFailure', error.message);
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
