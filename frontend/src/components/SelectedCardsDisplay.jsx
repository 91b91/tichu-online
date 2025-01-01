// SelectedCardsDisplay.js
import React from 'react';
import { useCardSelection } from '../contexts/CardSelectionContext'

export function SelectedCardsDisplay() {
  const { selectedCards } = useCardSelection();

  if (selectedCards.length === 0) {
    return null;
  }

  return (
    <div className="selected-cards-display">
      {selectedCards.length > 0 ? (
        <div>
          <p>{selectedCards.map(card => card.value).join(' ')}</p>
        </div>
      ) : (
        <p>none</p>
      )}
    </div>
  );
}