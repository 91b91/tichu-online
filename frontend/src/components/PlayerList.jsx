import { useUser } from "../contexts/UserContext";

export function PlayerList() {
  const { userList, updateUsersTeam, currentUser } = useUser();

  const handleTeamChange = (userId, team) => {
    updateUsersTeam(userId, team);
  };

  return (
    <div className="player-grid">
      {Array.from({ length: 4 }).map((_, index) => {
        const user = userList[index];
        return user ? (
          <PlayerLobbyCard
            key={user.userId}
            user={user}
            handleTeamChange={handleTeamChange}
            isDisabled={!currentUser?.isPartyLeader}
          />
        ) : (
          <div key={index} className="empty-slot">
            waiting for player {index + 1}...
          </div>
        );
      })}
    </div>
  );
}

function PlayerLobbyCard({ user, handleTeamChange, isDisabled }) {
  return (
    <div className="player-card-container">
      <div className="player-profile">
        <span>{user.name.charAt(0).toUpperCase()}</span>
      </div>
      <p className="player-name-text">
        {user.name}
        <span className="crown">{user.isPartyLeader && " (👑)"}</span>
      </p>
      <select className="team-selector"
        value={user.team || "Not Selected"}
        onChange={(e) => handleTeamChange(user.userId, e.target.value)}
        disabled={isDisabled}
        title={isDisabled ? "Team selection is restricted to the party leader" : ""}
      >
        <option value="Not Selected" disabled>
          Select
        </option>
        <option value="Team 1">Team 1</option>
        <option value="Team 2">Team 2</option>
      </select>
    </div>
  );
}
