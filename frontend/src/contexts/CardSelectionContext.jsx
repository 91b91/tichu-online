// CardSelectionContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const CardSelectionContext = createContext();

export function CardSelectionProvider({ children }) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

  const selectCards = useCallback((cards) => {
    setSelectedCards(cards);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCards([]);
    setLastSelectedIndex(null);
  }, []);

  const updateLastSelectedIndex = useCallback((index) => {
    setLastSelectedIndex(index);
  }, []);

  const value = {
    selectedCards,
    selectCards,
    clearSelection,
    lastSelectedIndex,
    updateLastSelectedIndex
  };

  return (
    <CardSelectionContext.Provider value={value}>
      {children}
    </CardSelectionContext.Provider>
  );
}

export function useCardSelection() {
  const context = useContext(CardSelectionContext);
  if (!context) {
    throw new Error('useCardSelection must be used within a CardSelectionProvider');
  }
  return context;
}