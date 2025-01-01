import React from 'react';
import { useUser } from "../contexts/UserContext";
import { SelectedCardsDisplay } from './SelectedCardsDisplay';

export function ActionButtons() {
  const { currentUser } = useUser();

  return (
    <div className="action-button-container">
      <button className="basic-red-button action-button play-button">
        <div className="play-button-text">Play</div>
        <SelectedCardsDisplay></SelectedCardsDisplay>
      </button>
      <button className="basic-red-button action-button">Pass</button>
      <button className="basic-red-button action-button">Tichu</button>
    </div>
  );
}