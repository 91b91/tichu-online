import { PLAY_TYPES } from "./constants/play-types";

export const generatePlayObject = (cardIds) => {
  // Handle empty or invalid input
  if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0) {
    return { 
      type: PLAY_TYPES.INVALID_PLAY,
      cards: [],
      containsPhoenix: false,
      length: 0
    };
  }

  // Convert card IDs to full card objects
  const cards = cardIds.map(id => DECK_CARDS.find(card => card.id === id));
  
  // Check if all cards exist in deck
  if (cards.some(card => !card)) {
    return { 
      type: PLAY_TYPES.INVALID_PLAY,
      cards: [],
      containsPhoenix: false,
      length: 0
    };
  }

  // Check for Phoenix
  const phoenix = cards.find(card => card.value === 'Phoenix');
  const containsPhoenix = !!phoenix;
  const nonPhoenixCards = cards.filter(card => card.value !== 'Phoenix');

  // Invalid: Phoenix + Dragon combination
  if (containsPhoenix && cards.some(card => card.value === 'Dragon')) {
    return { 
      type: PLAY_TYPES.INVALID_PLAY,
      cards,
      containsPhoenix,
      length: cards.length
    };
  }

  // Base return object that will be extended
  const baseObject = {
    cards,
    containsPhoenix,
    length: cards.length
  };

  // Single card
  if (cards.length === 1) {
    return { 
      ...baseObject,
      type: PLAY_TYPES.SINGLE, 
      leadCard: cards[0]
    };
  }

  // Check for pair
  if (cards.length === 2) {
    if (containsPhoenix) {
      // Phoenix + any card is a valid pair
      return {
        ...baseObject,
        type: PLAY_TYPES.PAIR,
        leadCard: nonPhoenixCards[0] // The non-Phoenix card leads
      };
    } else if (cards[0].rank === cards[1].rank) {
      return { 
        ...baseObject,
        type: PLAY_TYPES.PAIR, 
        leadCard: cards[0]
      };
    }
  }

  // Check for triple
  if (cards.length === 3) {
    if (containsPhoenix) {
      // Check if other two cards are the same rank
      if (nonPhoenixCards.length === 2 && nonPhoenixCards[0].rank === nonPhoenixCards[1].rank) {
        return {
          ...baseObject,
          type: PLAY_TYPES.TRIPLE,
          leadCard: nonPhoenixCards[0]
        };
      }
    } else if (cards.every(card => card.rank === cards[0].rank)) {
      return { 
        ...baseObject,
        type: PLAY_TYPES.TRIPLE, 
        leadCard: cards[0]
      };
    }
  }

  // Check for four of a kind (bomb) - Phoenix can't be used here
  if (cards.length === 4 && !containsPhoenix && cards.every(card => card.rank === cards[0].rank)) {
    return { 
      ...baseObject,
      type: PLAY_TYPES.BOMB_FOUR, 
      leadCard: cards[0]
    };
  }

  // For 5 or more cards
  if (cards.length >= 5) {
    // Sort by rank for easier checking
    const sorted = [...cards].sort((a, b) => a.rank - b.rank);

    // Check for straight flush (bomb) - Phoenix can't be used
    if (!containsPhoenix && cards.every(card => card.suit === cards[0].suit)) {
      const isStraight = checkConsecutiveRanks(sorted);
      if (isStraight) {
        return { 
          ...baseObject,
          type: PLAY_TYPES.STRAIGHT_FLUSH, 
          leadCard: sorted[sorted.length - 1]
        };
      }
    }

    // Check for regular straight
    if (containsPhoenix) {
      // Try to find a gap in the sequence that the Phoenix could fill
      const isValidStraightWithPhoenix = checkStraightWithPhoenix(nonPhoenixCards);
      if (isValidStraightWithPhoenix) {
        return {
          ...baseObject,
          type: PLAY_TYPES.STRAIGHT,
          leadCard: findHighestCard(cards)
        };
      }
    } else {
      const isStraight = checkConsecutiveRanks(sorted);
      if (isStraight) {
        return { 
          ...baseObject,
          type: PLAY_TYPES.STRAIGHT, 
          leadCard: sorted[sorted.length - 1]
        };
      }
    }

    // Check for full house (only if exactly 5 cards)
    if (cards.length === 5) {
      if (containsPhoenix) {
        // Check for possible full house with Phoenix
        const isValidFullHouseWithPhoenix = checkFullHouseWithPhoenix(nonPhoenixCards);
        if (isValidFullHouseWithPhoenix) {
          const leadCard = findFullHouseLeadCard(cards);
          return {
            ...baseObject,
            type: PLAY_TYPES.FULL_HOUSE,
            leadCard
          };
        }
      } else {
        const rankCounts = new Map();
        cards.forEach(card => {
          rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
        });
        
        if (rankCounts.size === 2 && [...rankCounts.values()].includes(3)) {
          const tripleRank = [...rankCounts.entries()].find(([_, count]) => count === 3)[0];
          return { 
            ...baseObject,
            type: PLAY_TYPES.FULL_HOUSE, 
            leadCard: cards.find(card => card.rank === tripleRank)
          };
        }
      }
    }
  }

  return { 
    type: PLAY_TYPES.INVALID_PLAY,
    cards,
    containsPhoenix,
    length: cards.length
  };
};

// Helper function to check if ranks are consecutive
const checkConsecutiveRanks = (sortedCards) => {
  for (let i = 1; i < sortedCards.length; i++) {
    if (sortedCards[i].rank !== sortedCards[i-1].rank + 1) {
      return false;
    }
  }
  return true;
};

// Helper function to check if cards can form a straight with a Phoenix
const checkStraightWithPhoenix = (nonPhoenixCards) => {
  const sorted = [...nonPhoenixCards].sort((a, b) => a.rank - b.rank);
  
  // Look for a single gap that the Phoenix could fill
  let gaps = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].rank - sorted[i-1].rank - 1;
    if (gap > 1) return false; // Gap too big
    if (gap === 1) gaps++;
  }
  return gaps === 1; // Exactly one gap that Phoenix can fill
};

// Helper function to check if cards can form a full house with a Phoenix
const checkFullHouseWithPhoenix = (nonPhoenixCards) => {
  const rankCounts = new Map();
  nonPhoenixCards.forEach(card => {
    rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
  });

  // Check possible patterns (2-2 with Phoenix making a triple)
  if (rankCounts.size === 2) {
    const counts = [...rankCounts.values()];
    return counts.includes(2);
  }
  return false;
};

// Helper function to find the highest card
const findHighestCard = (cards) => {
  return cards.reduce((highest, card) => 
    card.value !== 'Phoenix' && card.rank > highest.rank ? card : highest
  , cards[0]);
};

// Helper function to find the lead card in a full house
const findFullHouseLeadCard = (cards) => {
  const nonPhoenixCards = cards.filter(card => card.value !== 'Phoenix');
  const rankCounts = new Map();
  nonPhoenixCards.forEach(card => {
    rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
  });
  
  // Find the rank that will be the triple (with Phoenix if needed)
  for (const [rank, count] of rankCounts.entries()) {
    if (count === 3 || count === 2) {
      return cards.find(card => card.rank === rank);
    }
  }
  return cards[0];
};