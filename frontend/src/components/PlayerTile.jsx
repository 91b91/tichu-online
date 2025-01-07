import { useUser } from "../contexts/UserContext";

export function PlayerTile({ playerName, tag, cardsRemaining}) {
  return (
    <div className="player-tile-container">
      <div className="tile-profile-picture">
        {playerName.charAt(0).toUpperCase()}
      </div>
      <div className="name-and-tag-container">
        <div className="tile-player-name">
          {playerName}
        </div>
        <div className="tile-tag">
          {tag}
        </div>
      </div>
      <div className="tile-cards-remaining">
        {cardsRemaining}
      </div>
    </div>
  )
}