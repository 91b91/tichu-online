import { useState } from 'react';
import { useUser } from "../contexts/UserContext";
import { useCardSelection } from '../contexts/CardSelectionContext'
import { SelectedCardsDisplay } from './SelectedCardsDisplay';
import { ErrorMessage } from './ErrorMessage';

export function ActionButtons() {
  const { selectedCards } = useCardSelection();
  const { currentUser, playSelectedCards, playStack } = useUser();
  const [error, setError] = useState("");

  async function handlePlay() {
    console.log('playpls')
    try {
      await playSelectedCards(
        currentUser.userId, 
        selectedCards.map(card => card.id)
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