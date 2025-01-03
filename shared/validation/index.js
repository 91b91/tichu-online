// shared/validation/index.js
import { PLAY_TYPES } from "./play-types.js";
import { DECK_CARDS } from "./cards.js";

export const testSharedCode = () => {
return "Shared code is working!";
};

export function categorizePlay(cardIds) {
  // Handle empty or invalid input
  if (!Array.isArray(cardIds) || cardIds.length === 0) {
    return PLAY_TYPES.INVALID_PLAY;
  }

  // Convert card IDs to full card objects
  const cards = cardIds.map(id => DECK_CARDS.find(card => card.id === id));

  // Check if all card IDs are valid
  if (cards.some(card => !card)) {
    console.error("Invalid card ID(s) found:", cardIds);
    return PLAY_TYPES.INVALID_PLAY;
  }

  // Categorize play
  if (isStraightFlushBomb(cards)) {
    return PLAY_TYPES.STRAIGHT_FLUSH_BOMB;
  }
  if (isBombFour(cards)) {
    return PLAY_TYPES.BOMB_FOUR;
  }
  if (isFullHouse(cards)) {
    return PLAY_TYPES.FULL_HOUSE;
  }
  if (isConsecutiveDoubles(cards)) {
    return PLAY_TYPES.CONSECUTIVE_DOUBLES;
  }
  if (isStraight(cards)) {
    return PLAY_TYPES.STRAIGHT;
  }
  if (isTriple(cards)) {
    return PLAY_TYPES.TRIPLE;
  }
  if (isPair(cards)) {
    return PLAY_TYPES.PAIR;
  }
  if (isSingle(cards)) {
    return PLAY_TYPES.SINGLE;
  }

  // Default to invalid play
  return PLAY_TYPES.INVALID_PLAY;
}

function isSingle(cards) {
  return cards.length === 1;
}

function isPair(cards) {
  if (cards.length !== 2) {
    return false;
  }
  
  if (allMatchingRank(cards)) {
    // Basic pair
    return true;
  } else if (containsPhoenix(cards) && !containsNonPhoenixSpecial(cards)) {
    // Phoenix + non-special card is valid
    return true;
  } 

  // No valid pair
  return false;
}

function isTriple(cards) {
  if (cards.length !== 3) {
    // Not exactly three cards
    return false; 
  }

  const phoenix = cards.find(card => card.value === 'Phoenix');
  const nonPhoenixCards = cards.filter(card => card.value !== 'Phoenix');

  if (allMatchingRank(cards)) {
    // All three cards have the same rank
    return true; 
  }

  if (phoenix && isPair(nonPhoenixCards)) {
    // Phoenix + pair forms a valid triple
    return true; 
  }

  // No valid triple
  return false; 
}


function isBombFour(cards) {
  return (cards.length === 4 
    && !containsSpecialCard(cards)
    && allMatchingRank(cards)
  );
}

function isStraightFlushBomb(cards) {
  return (cards.length >= 5
    && !containsSpecialCard(cards)
    && allMatchingSuit(cards)
    && isConsecutiveRanks(cards)
  );
}

function isStraight(cards) {
  if (cards.length < 5 || containsDragon(cards) || containsHound(cards)) {
    return false; // Straights require at least 5 cards and no Dragons or Hounds
  }

  const sortedCards = sortCards(cards);

  // Check if ranks are consecutive
  return isConsecutiveRanks(sortedCards);
}


function isFullHouse(cards) {
  if (cards.length !== 5 || containsNonPhoenixSpecial(cards)) {
    return false; // Full house must be exactly 5 cards with no non-Phoenix special cards
  }

  const sortedCards = sortCards(cards);

  // Special case: [A A A A Phoenix] is not a valid full house
  if (isBombFour(sortedCards.slice(0, 4)) 
      && sortedCards[4].value === 'Phoenix') {
    return false;
  }

  // Check split 1: [A A B B B]
  const firstTwo = sortedCards.slice(0, 2);
  const lastThree = sortedCards.slice(2, 5);
  if (isPair(firstTwo) && isTriple(lastThree)) {
    return true;
  }

  // Check split 2: [A A A B B]
  const firstThree = sortedCards.slice(0, 3);
  const lastTwo = sortedCards.slice(3, 5);
  if (isTriple(firstThree) && isPair(lastTwo)) {
    return true;
  }

  return false; // No valid full house
}


function isConsecutiveDoubles(cards) {
  if (cards.length < 4
    || cards.length % 2 !== 0 
    || containsNonPhoenixSpecial(cards)) {
    return false;
  }

  // Group cards by rank
  const groupedByRank = Object.values(
    cards.reduce((acc, card) => {
      if (!acc[card.rank]) acc[card.rank] = [];
      acc[card.rank].push(card);
      return acc;
    }, {})
  );

  // Sort groups by rank
  const groupedByRankSorted = groupedByRank.sort(
    (a, b) => a[0].rank - b[0].rank
  )

  let phoenixAvailable = containsPhoenix(cards);

  // Check each group can form a valid pair
  for (const group of groupedByRankSorted) {
    if (group[0].value === 'Phoenix') {
      // Don't worry about the phoenix not forming a pair
      continue;
    } else if (group.length === 2) {
      // Valid pair
      continue;
    } else if (group.length === 1 && phoenixAvailable) {
      // Single card group, use Phoenix
      phoenixAvailable = false;
      continue;
    } else {
      // Invalid group
      return false;
    }
  }

  // Check groups are consecutive
  for (let i = 1; i < groupedByRankSorted.length; i++) {
    const previousGroup = groupedByRankSorted[i - 1];
    const currentGroup = groupedByRankSorted[i];

    if (currentGroup[0].value === 'Phoenix') {
      // The Phoenix group doesn't have to be consecutive
      continue;
    } else if (currentGroup[0].rank !== previousGroup[0].rank + 1) {
      // Groups are not consecutive
      return false;
    }
  }

  return true;
}


// ---- HELPER FUNCTIONS ----

// does contain checks...

function containsPhoenix(cards) {
  return cards.some(card => card.value === 'Phoenix');
}

function containsHound(cards) {
  return cards.some(card => card.value === 'Hound');
}

function containsDragon(cards) {
  return cards.some(card => card.value === 'Dragon');
}

function containsMahjong(cards) {
  return cards.some(card => card.value === 'Mahjong');
}

function containsSpecialCard(cards) {
  const specialCards = ['Mahjong', 'Hound', 'Dragon', 'Phoenix'];
  return cards.some(card => specialCards.includes(card.value))
}

function containsNonPhoenixSpecial(cards) {
  const specialCardsNoPhoenix = ['Mahjong', 'Hound', 'Dragon'];
  return cards.some(card => specialCardsNoPhoenix.includes(card.value))
}

// more complex helper functions... 

function allMatchingRank(cards) {
  if (cards.length === 0) return false;
  return cards.every(card => card.rank === cards[0].rank);
}

function allMatchingSuit(cards) {
  if (cards.length === 0) return false;
  return cards.every(card => card.suit === cards[0].suit);
}

function sortCards(cards) {
  return [...cards].sort((a, b) => a.rank - b.rank);
}

function isConsecutiveRanks(cards) {
  // Sort the cards by rank
  const sortedCards = sortCards(cards);
  
  // Skip the Phoenix in our sequence check if present
  const nonPhoenixCards = sortedCards.filter(card => card.value !== 'Phoenix');
  const hasPhoenix = sortedCards.length !== nonPhoenixCards.length;
  
  // Check each pair of adjacent cards
  let usedPhoenix = false;
  for (let i = 0; i < nonPhoenixCards.length - 1; i++) {
    const currentRank = nonPhoenixCards[i].rank;
    const nextRank = nonPhoenixCards[i + 1].rank;
    
    // If ranks aren't consecutive
    if (nextRank - currentRank !== 1) {
      // If gap is exactly 2 and we haven't used Phoenix yet
      if (nextRank - currentRank === 2 && hasPhoenix && !usedPhoenix) {
        usedPhoenix = true;
      } else {
        return false;
      }
    }
  }
  
  return true;
}
