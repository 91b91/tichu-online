import { useUser } from "../contexts/UserContext";

export function PlayerList() {
  const { userList, updateUsersTeam, currentUser } = useUser();

  const handleTeamChange = (userId, team) => {
    updateUsersTeam(userId, team);
  };

  return (
    <>
      {userList.map((user) => (
        <div key={user.userId}>
          <p>
            {user.name}
            {user.isPartyLeader ? " (PL)" : ""}
          </p>
          <select
            value={user.team || "Not Selected"}
            onChange={(e) => handleTeamChange(user.userId, e.target.value)}
            disabled={!currentUser?.isPartyLeader} // Disable dropdown if not the party leader
            title={!currentUser?.isPartyLeader ? "Team selection is restricted to the party leader" : ""}
          >
            <option value="Not Selected" disabled>
              Choose team
            </option>
            <option value="Team 1">Team 1</option>
            <option value="Team 2">Team 2</option>
          </select>
        </div>
      ))}
    </>
  );
}
