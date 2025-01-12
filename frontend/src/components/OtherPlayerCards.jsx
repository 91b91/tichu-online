export function OtherPlayerCards({ player }) {
  if (!player || !player.hand) {
    return null;
  }

  return (
    <div className="other-player-cards">
      {player.hand.map((card, index) => (
        <div 
          key={index} 
          className="facedown-card-wrapper"
          data-index={index}
        >
          <img
            className="facedown-card-image"
            src="/card-assets/tichu-card-back-red.png"
            alt="Card back"
          />
        </div>
      ))}
    </div>
  );
}