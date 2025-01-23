export function PlayerTile({ user }) {
  return (
    <div className="player-tile-container">
      {user.isTichu && <div className="tichu-animation-container"></div>}
      <div className="tile-profile-picture">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="name-and-tag-container">
        <div className="tile-player-name">{user.name}</div>
        {user.isTichu && <div className="tile-tag">Tichu</div>}
      </div>
      <div className="tile-cards-remaining">{user.hand.length}</div>
    </div>
  );
}