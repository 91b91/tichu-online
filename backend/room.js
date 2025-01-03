import { DECK_CARDS } from './constants/cards.js'

class Room {
  static MAX_CAPACITY = 4;
  users = [];
  playStack=[];

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
  }

  getUserList() {
    return this.users.map(user => (
      {
        userId: user.userId,
        name: user.name,
        team: user.team,
        isPartyLeader: user.getIsPartyLeader(),
        hand: user.getHand()
      }
    ));
  }

  initializeGame() {
    if (this.users.length != 4) {
      throw new Error('There must be 4 players in the lobby to start a game.')
    }
    if (!this.isValidTeamAssignment()) {
      throw new Error('Check each player has been assigned a team. Each team must have exactly two players.')
    }

    this.dealCards(this.users, DECK_CARDS);
  }

  isValidTeamAssignment() {
    const team1Count = this.users.filter(user => user.getTeam() === 'Team 1').length;
    const team2Count = this.users.filter(user => user.getTeam() === 'Team 2').length;

    return (team1Count === 2 && team2Count === 2)
  }

  // maybe make this private?
  dealCards(users, deckCards) {
    // Create a copy of the deck to shuffle
    const shuffledDeck = [...deckCards];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
  
    // Deal cards to each user (assuming 4 players, 14 cards each in Tichu)
    const cardsPerPlayer = 14;
    users.forEach((user, index) => {
      const startIndex = index * cardsPerPlayer;
      const userCards = shuffledDeck.slice(startIndex, startIndex + cardsPerPlayer);
      user.setHand(userCards.sort((a, b) => a.rank - b.rank));
    });
  }

  // DO THESE FOLLOWING FUNCTIONS LOOK OK??? 
  addToPlayStack(play) {
    if (!play || typeof play.toJSON !== 'function') {
      throw new Error('Invalid play object');
    }

    const playOnTop = this.playStack[this.playStack.length - 1];
    if (playOnTop && play.getUserId() === playOnTop.getUserId()) {
      throw new Error('You cannot play on your own play.');
    }
    
    this.playStack.push(play);
  }

  getPlayStackJSON() {
    return this.playStack.map((play) => play.toJSON());
  }
}

export default Room;