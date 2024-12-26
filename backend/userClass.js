class User {
  team = undefined;
  isPartyLeader = false;

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
}

export default User;