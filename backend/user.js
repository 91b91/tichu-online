import { USER_PROGRESS_STATE } from '../shared/game/user-progress.js'

class User {
  team = 'Not Selected'
  isPartyLeader = false;
  hand = [];  // Initialize as empty array
  isTichu = false;
  isGrandTichu = false;
  progressState = USER_PROGRESS_STATE.IN_LOBBY;

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

  callTichu() {
    this.isTichu = true;
  }

  callGrandTichu() {
    this.isTichu = false;
    this.isGrandTichu = true;
  }

  updateProgressState(newProgressState) {
    this.progressState = newProgressState;
  }

  flipCards() {
    this.hand.forEach(card => card.isFaceUp = true);
  }
}

export default User;