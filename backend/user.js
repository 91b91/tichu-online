class User {
  team = 'Not Selected'
  isPartyLeader = false;
  hand = [];  // Initialize as empty array

  constructor(name, userId, socketId) {
    this.name = name;
    this.userId = userId;
    this.socketId = socketId;
  }

  getTeam() {
    return this.team;
  }

  setTeam(team) {
    this.team = team;
  }

  getIsPartyLeader() {
    return this.isPartyLeader;
  }

  setIsPartyLeader(isPartyLeader) {
    this.isPartyLeader = isPartyLeader;
  }

  getHand() {
    return this.hand;
  }

  setHand(cards) {
    this.hand = cards;
  }

  addToHand(card) {
    this.hand.push(card);
  }

  removeFromHand(cardId) {
    this.hand = this.hand.filter(card => card.id !== cardId);
  }
}

export default User;