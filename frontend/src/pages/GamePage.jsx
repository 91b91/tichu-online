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
          <div className="grid-item grid-item-bottom">
            <div className="flex-wrapper">
              <div className="item">item</div>
              <div className="left-item">item-left</div>
              <div className="right-item">item-right</div>
            </div>
          </div>
          <div className="grid-item grid-item-bottom">
            grid-item-bottom
          </div>
        </div>
      </div>
    </CardSelectionProvider>
  );
}

export default GamePage;