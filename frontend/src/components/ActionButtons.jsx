import { useState, useEffect } from 'react';
import { useUser } from "../contexts/UserContext";
import { useCardSelection } from '../contexts/CardSelectionContext'
import { SelectedCardsDisplay } from './SelectedCardsDisplay';
import { ErrorMessage } from './ErrorMessage';
import { categorizePlay } from '@shared/game/play-validation';
import { USER_PROGRESS_STATE } from '@shared/game/user-progress';
import { usePlayers } from "../hooks/usePlayers";

export function ActionButtons() {
  const { selectedCards } = useCardSelection();
  const { currentUser, playSelectedCards, callTichu } = useUser();
  const [error, setError] = useState("");
  const { teammate, leftOpponent, rightOpponent } = usePlayers();

  async function handleCallTichu() {
    await callTichu(currentUser.userId);
  }

  function isUserPassing() {
    console.log(currentUser.progressState);
    return (
      currentUser.progressState === USER_PROGRESS_STATE.PASS_CARDS_LEFT_OPPONENT
      || currentUser.progressState === USER_PROGRESS_STATE.PASS_CARDS_RIGHT_OPPONENT
      || currentUser.progressState === USER_PROGRESS_STATE.PASS_CARDS_TEAMMATE
    );
  }

  return (
    <div className="action-button-container">
      {
        isUserPassing() 
          ? <PassCardsButton />
          : <PlayButton />
      }
      <button className="basic-red-button action-button">Pass</button>
      <button 
        onClick={handleCallTichu}
        className="basic-red-button action-button"
      >
        Tichu
      </button>
      {error && <ErrorMessage errorText={error}/>}
    </div>
  );
}

function PlayButton() {
  const { selectedCards } = useCardSelection();
  const { currentUser, playSelectedCards } = useUser();

  useEffect(() => {
    const selectedCardIds = selectedCards.map(card => card.id);
    console.log(categorizePlay(selectedCardIds));
  }, [selectedCards])

  async function handlePlay() {
    try {
      const selectedCardIds = selectedCards.map(card => card.id);
      await playSelectedCards(
        currentUser.userId, 
        selectedCardIds,
      )
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <button 
        onClick={handlePlay} 
        className="basic-red-button action-button play-button"
      >
        <div className="play-button-text">Play</div>
        <SelectedCardsDisplay></SelectedCardsDisplay>
    </button>
  );
}

function PassCardsButton() {
  const { selectedCards } = useCardSelection();
  const { currentUser, playSelectedCards } = useUser();

  useEffect(() => {
    const selectedCardIds = selectedCards.map(card => card.id);
  }, [selectedCards]);

  const getButtonText = () => {
    if (currentUser.progressState === USER_PROGRESS_STATE.PASS_CARDS_LEFT_OPPONENT) {
      return 'Pass to Left Opponent';
    } else if (currentUser.progressState === USER_PROGRESS_STATE.PASS_CARDS_RIGHT_OPPONENT) {
      return 'Pass to Right Opponent';
    } else if (currentUser.progressState === USER_PROGRESS_STATE.PASS_CARDS_TEAMMATE) {
      return 'Pass to Teammate';
    }
    return ''; // Default text if no condition matches
  };

  const handlePassCards = () => {
    // Add your logic here for what happens when the button is clicked
    console.log(currentUser.USER_PROGRESS_STATE);
    console.log(selectedCards);
  };

  return (
    <button 
      onClick={handlePassCards} 
      className="basic-red-button action-button play-button"
    >
      <div className="play-button-text">
        {getButtonText()}
      </div>
      <SelectedCardsDisplay />
    </button>
  );
}
