import React from "react";
import { Hand } from "../components/Hand";
import { CardSelectionProvider } from '../contexts/CardSelectionContext';
import { ActionButtons } from "../components/ActionButtons";

function GamePage() {
  return (
    <CardSelectionProvider>
      <div className="game-page-wrapper">
        <div className="game-grid-container">
          {/* Top row */}
          <div className="grid-item">grid-item</div>
          <div className="grid-item">teammate-grid-item</div>
          <div className="grid-item">grid-item</div>
          
          {/* Middle row */}
          <div className="grid-item">opposition-left-grid-item</div>
          <div className="grid-item">center-grid-item</div>
          <div className="grid-item">opposition-right-grid-item</div>
          
          {/* Bottom rows */}
          <div className="grid-item grid-item-bottom">user-player-grid-item</div>
          <div className="grid-item grid-item-bottom">chat</div>
        </div>
      </div>
    </CardSelectionProvider>
  );
}

export default GamePage;