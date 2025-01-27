import { USER_PROGRESS_STATE } from '../shared/game/user-progress.js'

class User {
  isPartyLeader = false;
  
  team = 'Not Selected'
  progressState = USER_PROGRESS_STATE.IN_LOBBY;
  isTichu = false;
  isGrandTichu = false;

  faceUpCardIds = [];  
  faceDownCardIds = [];
  passedCardsIds = [];

  constructor(name, userId, socketId) {
    this.name = name;
    this.userId = userId;
    this.socketId = socketId;
  }

  flipCards() {
    // Move all IDs from faceDownCardIds to faceUpCardIds
    this.faceUpCardIds = [...this.faceDownCardIds, ...this.faceUpCardIds];
    // Clear faceDownCardIds after moving the IDs
    this.faceDownCardIds = [];
  }

  callTichu() {
    this.isTichu = true;
  }

  callGrandTichu() {
    this.isGrandTichu = true;
  }
  
}


export default User;