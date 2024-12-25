class Room {
  static MAX_CAPACITY = 4;
  users = [];

  constructor(roomId) {
    this.roomId = roomId;
  }

  addUser(user) {
    console.log(this.users);
  
    // Access static property using the class name
    if (this.users.length >= Room.MAX_CAPACITY) {
      throw new Error(`This room has already reached its maximum capacity of ${Room.MAX_CAPACITY}.`);
    } else if (this.users.some(u => u.name === user.name)) {
      throw new Error(`Player has already joined game room. Please join with a different player name.`);
    } else {
      console.log(`${user.socketId} has joined a room`);
      this.users.push(user);
    }
  }  

  getUserByUserId(userId) {
    return this.users.find(user => user.userId === userId);
  }

  getUserBySocketId(socketId) {
    return this.users.find(user => user.socketId === socketId);
  }

  removeUserBySocketId(socketId) {
    this.users = this.users.filter(user => user.socketId !== socketId);
  }
}

export default Room;