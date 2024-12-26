class Room {
  static MAX_CAPACITY = 4;
  users = [];

  constructor(roomId) {
    this.roomId = roomId;
  }

  addUser(user) {
    // Check if the room has reached its maximum capacity
    if (this.users.length >= Room.MAX_CAPACITY) {
      throw new Error(`This room has already reached its maximum capacity of ${Room.MAX_CAPACITY}.`);
    }
  
    // Check if the user name already exists but not the same userId
    if (this.users.some(u => u.name === user.name && u.userId !== user.userId)) {
      throw new Error(`Player has already joined the game room. Please join with a different player name.`);
    }
  
    // Assign party leader if this is the first user
    if (this.users.length === 0) {
      user.setIsPartyLeader(true);
    }
  
    // Add or replace the user in the room
    console.log(`${user.socketId} has joined the room`);
    this.users = [...this.users.filter(u => u.userId !== user.userId), user];
    console.log(this.users); // TEMP
  }
  

  getUserByUserId(userId) {
    return this.users.find(user => user.userId === userId);
  }

  getUserBySocketId(socketId) {
    return this.users.find(user => user.socketId === socketId);
  }

  // This should only be called directly by roomsState.js so it can handle updating the state.
  removeUserBySocketId(socketId) {
    const removedUser = this.getUserBySocketId(socketId)

    this.users = this.users.filter(user => user.socketId !== socketId);

    if (removedUser.getIsPartyLeader() && this.users.length !==0 ) {
      this.users[0].setIsPartyLeader(true);
    }
    console.log(this.users); // TEMP
  }

  getUserList() {
    return this.users.map(user => (
      {
        userId: user.userId,
        name: user.name,
        team: user.team
      }
    ));
  }
}

export default Room;