import { useState, useEffect } from 'react';
import { useUser } from "../contexts/UserContext";
import { useCardSelection } from '../contexts/CardSelectionContext'
import { SelectedCardsDisplay } from './SelectedCardsDisplay';
import { ErrorMessage } from './ErrorMessage';
import { categorizePlay } from '@shared/validation';

export function ActionButtons() {
  const { selectedCards } = useCardSelection();
  const { currentUser, playSelectedCards, playStack } = useUser();
  const [error, setError] = useState("");

  useEffect(() => {
    const selectedCardIds = selectedCards.map(card => card.id);
    console.log(categorizePlay(selectedCardIds));
  }, [selectedCards])

  async function handlePlay() {
    console.log('playpls')
    try {
      const selectedCardIds = selectedCards.map(card => card.id);
      await playSelectedCards(
        currentUser.userId, 
        selectedCardIds,
      )
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  }

  return (
    <div className="action-button-container">
      <button 
        onClick={handlePlay} 
        className="basic-red-button action-button play-button"
      >
        <div className="play-button-text">Play</div>
        <SelectedCardsDisplay></SelectedCardsDisplay>
      </button>
      <button className="basic-red-button action-button">Pass</button>
      <button className="basic-red-button action-button">Tichu</button>
      {error && <ErrorMessage errorText={error}/>}
    </div>
  );
}