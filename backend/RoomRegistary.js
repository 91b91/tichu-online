import Room from './room.js'

// singleton
const RoomRegistary = {
  rooms: {},
  socketToRoomMap: {},

  addRoom(roomId) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = new Room(roomId);
    }
    return this.rooms[roomId];
  },

  addUserToRoom(roomId, user) {
    const room = this.addRoom(roomId);
    room.addUser(user); // Errors from here will naturally propagate
    this.socketToRoomMap[user.socketId] = roomId;
    return room;
  },

  removeUserFromRoom(roomId, socketId) {
    const room = this.rooms[roomId];
    if (room) {
      room.removeUserBySocketId(socketId);
      delete this.socketToRoomMap[socketId];

      if (room.users.length === 0) {
        delete this.rooms[roomId];
      }
    }
  },

  getRoomByRoomId(roomId) {
    return this.rooms[roomId] || null;
  },

  getRoomBySocket(socketId) {
    const roomId = this.socketToRoomMap[socketId];
    return this.getRoomByRoomId(roomId);
  },

  getRoomByUserId(userId) {
    for (const roomId in this.rooms) {
      const room = this.rooms[roomId];
      if (room.getUserByUserId(userId)) {
        return room;
      }
    }
    return null;
  },

}

export default RoomRegistary;

