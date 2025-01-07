import React from "react";
import { Hand } from "../components/Hand";
import { CardSelectionProvider } from '../contexts/CardSelectionContext';
import { ChatDisplay } from '../components/ChatDisplay';
import { ChatInput } from "../components/ChatInput";
import { ActionButtons } from "../components/ActionButtons";
import { PlayerTile } from '../components/PlayerTile';

import { useUser } from "../contexts/UserContext";

function GamePage() {
  const { userList, currentUser } = useUser();

  return (
    <CardSelectionProvider>
      <div className="game-page-wrapper">
        <div className="game-grid-container">
          {/* Top row */}
          <div className="grid-item">grid-item</div>
          <div className="grid-item">
            <PlayerTile
              playerName={"teammate"}
              tag={"Tichu"}
              cardsRemaining={2}
            />
          </div>
          <div className="grid-item">grid-item</div>
          
          {/* Middle row */}
          <div className="grid-item">
            <PlayerTile
              playerName={"opposition-left"}
              tag={"Tichu"}
              cardsRemaining={1}
            />
          </div>
          <div className="grid-item">center-grid-item</div>
          <div className="grid-item">
            <PlayerTile
              playerName={"opposition-right"}
              tag={""}
              cardsRemaining={3}
            />
          </div>
          {/* Bottom rows */}
          <div className="grid-item grid-item-bottom">
            <div className="bottom-grid-container">
              <div className="grid-item">
                <PlayerTile 
                  playerName={currentUser.name}
                  tag={"GrandTichu"}
                  cardsRemaining={currentUser.hand.length}
                />
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