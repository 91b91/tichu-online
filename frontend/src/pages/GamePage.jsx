import React from "react";
import { Hand } from "../components/Hand";
import { CardSelectionProvider } from '../contexts/CardSelectionContext';
import { ChatDisplay } from '../components/ChatDisplay';
import { ChatInput } from "../components/ChatInput";
import { ActionButtons } from "../components/ActionButtons";
import { PlayerTile } from '../components/PlayerTile';
import { OtherPlayerCards } from "../components/OtherPlayerCards";

import { useUser } from "../contexts/UserContext";
import { usePlayers } from "../hooks/usePlayers";

function GamePage() {
  const { currentUser } = useUser();
  const { teammate, leftOpponent, rightOpponent } = usePlayers();

  return (
    <CardSelectionProvider>
      <div className="game-page-wrapper">
        <div className="game-grid-container">
          {/* Top row */}
          <div className="grid-item">grid-item</div>
          <div className="grid-item">
            <OtherPlayerCards player={teammate}/>
            <PlayerTile user={teammate} />
          </div>
          <div className="grid-item">grid-item</div>
          
          {/* Middle row */}
          <div className="grid-item">
            <PlayerTile user={leftOpponent} />
            <OtherPlayerCards player={leftOpponent}/>
          </div>
          <div className="grid-item center-grid-item"></div>
          <div className="grid-item">
            <PlayerTile user={rightOpponent} />
            <OtherPlayerCards player={rightOpponent}/>
          </div>

          {/* Bottom rows */}
          <div className="grid-item grid-item-bottom">
            <div className="bottom-grid-container">
              <div className="grid-item grid-item-user">
                <PlayerTile user={currentUser} />
              </div>
              <div className="grid-item grid-item-user">
                <Hand />
                <ActionButtons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardSelectionProvider>
  );
}

export default GamePage;
