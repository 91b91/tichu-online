import React from "react";
import { Hand } from "../components/Hand";
import { CardSelectionProvider } from '../contexts/CardSelectionContext';
import { ChatDisplay } from '../components/ChatDisplay';
import { ChatInput } from "../components/ChatInput";
import { ActionButtons } from "../components/ActionButtons";
import { PlayerTile } from '../components/PlayerTile';

import { useUser } from "../contexts/UserContext";
import { getGamePlayers } from "@shared/game/player-categorisation";

function GamePage() {
  const { userList, currentUser } = useUser();

  // Get teammate, left opponent, and right opponent using getGamePlayers
  const { teammate, leftOpponent, rightOpponent } = getGamePlayers(userList, currentUser);

  return (
    <CardSelectionProvider>
      <div className="game-page-wrapper">
        <div className="game-grid-container">
          {/* Top row */}
          <div className="grid-item">grid-item</div>
          <div className="grid-item">
            <PlayerTile user={teammate} />
          </div>
          <div className="grid-item">grid-item</div>
          
          {/* Middle row */}
          <div className="grid-item">
            <PlayerTile user={leftOpponent} />
          </div>
          <div className="grid-item center-grid-item"></div>
          <div className="grid-item">
            <PlayerTile user={rightOpponent} />
          </div>

          {/* Bottom rows */}
          <div className="grid-item grid-item-bottom">
            <div className="bottom-grid-container">
              <div className="grid-item">
                <PlayerTile user={currentUser} />
              </div>
              <div className="grid-item">
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
