export const DECK_CARDS = [
  // Jade cards
  { id: 'jade-2', suit: 'Jade', value: 2, rank: 2, points: 0 },
  { id: 'jade-3', suit: 'Jade', value: 3, rank: 3, points: 0 },
  { id: 'jade-4', suit: 'Jade', value: 4, rank: 4, points: 0 },
  { id: 'jade-5', suit: 'Jade', value: 5, rank: 5, points: 5 },
  { id: 'jade-6', suit: 'Jade', value: 6, rank: 6, points: 0 },
  { id: 'jade-7', suit: 'Jade', value: 7, rank: 7, points: 0 },
  { id: 'jade-8', suit: 'Jade', value: 8, rank: 8, points: 0 },
  { id: 'jade-9', suit: 'Jade', value: 9, rank: 9, points: 0 },
  { id: 'jade-10', suit: 'Jade', value: 10, rank: 10, points: 10 },
  { id: 'jade-J', suit: 'Jade', value: 'J', rank: 11, points: 0 },
  { id: 'jade-Q', suit: 'Jade', value: 'Q', rank: 12, points: 0 },
  { id: 'jade-K', suit: 'Jade', value: 'K', rank: 13, points: 10 },
  { id: 'jade-A', suit: 'Jade', value: 'A', rank: 14, points: 0 },

  // Pagoda cards
  { id: 'pagoda-2', suit: 'Pagoda', value: 2, rank: 2, points: 0 },
  { id: 'pagoda-3', suit: 'Pagoda', value: 3, rank: 3, points: 0 },
  { id: 'pagoda-4', suit: 'Pagoda', value: 4, rank: 4, points: 0 },
  { id: 'pagoda-5', suit: 'Pagoda', value: 5, rank: 5, points: 5 },
  { id: 'pagoda-6', suit: 'Pagoda', value: 6, rank: 6, points: 0 },
  { id: 'pagoda-7', suit: 'Pagoda', value: 7, rank: 7, points: 0 },
  { id: 'pagoda-8', suit: 'Pagoda', value: 8, rank: 8, points: 0 },
  { id: 'pagoda-9', suit: 'Pagoda', value: 9, rank: 9, points: 0 },
  { id: 'pagoda-10', suit: 'Pagoda', value: 10, rank: 10, points: 10 },
  { id: 'pagoda-J', suit: 'Pagoda', value: 'J', rank: 11, points: 0 },
  { id: 'pagoda-Q', suit: 'Pagoda', value: 'Q', rank: 12, points: 0 },
  { id: 'pagoda-K', suit: 'Pagoda', value: 'K', rank: 13, points: 10 },
  { id: 'pagoda-A', suit: 'Pagoda', value: 'A', rank: 14, points: 0 },

  // Star cards
  { id: 'star-2', suit: 'Star', value: 2, rank: 2, points: 0 },
  { id: 'star-3', suit: 'Star', value: 3, rank: 3, points: 0 },
  { id: 'star-4', suit: 'Star', value: 4, rank: 4, points: 0 },
  { id: 'star-5', suit: 'Star', value: 5, rank: 5, points: 5 },
  { id: 'star-6', suit: 'Star', value: 6, rank: 6, points: 0 },
  { id: 'star-7', suit: 'Star', value: 7, rank: 7, points: 0 },
  { id: 'star-8', suit: 'Star', value: 8, rank: 8, points: 0 },
  { id: 'star-9', suit: 'Star', value: 9, rank: 9, points: 0 },
  { id: 'star-10', suit: 'Star', value: 10, rank: 10, points: 10 },
  { id: 'star-J', suit: 'Star', value: 'J', rank: 11, points: 0 },
  { id: 'star-Q', suit: 'Star', value: 'Q', rank: 12, points: 0 },
  { id: 'star-K', suit: 'Star', value: 'K', rank: 13, points: 10 },
  { id: 'star-A', suit: 'Star', value: 'A', rank: 14, points: 0 },

  // Sword cards
  { id: 'sword-2', suit: 'Sword', value: 2, rank: 2, points: 0 },
  { id: 'sword-3', suit: 'Sword', value: 3, rank: 3, points: 0 },
  { id: 'sword-4', suit: 'Sword', value: 4, rank: 4, points: 0 },
  { id: 'sword-5', suit: 'Sword', value: 5, rank: 5, points: 5 },
  { id: 'sword-6', suit: 'Sword', value: 6, rank: 6, points: 0 },
  { id: 'sword-7', suit: 'Sword', value: 7, rank: 7, points: 0 },
  { id: 'sword-8', suit: 'Sword', value: 8, rank: 8, points: 0 },
  { id: 'sword-9', suit: 'Sword', value: 9, rank: 9, points: 0 },
  { id: 'sword-10', suit: 'Sword', value: 10, rank: 10, points: 10 },
  { id: 'sword-J', suit: 'Sword', value: 'J', rank: 11, points: 0 },
  { id: 'sword-Q', suit: 'Sword', value: 'Q', rank: 12, points: 0 },
  { id: 'sword-K', suit: 'Sword', value: 'K', rank: 13, points: 10 },
  { id: 'sword-A', suit: 'Sword', value: 'A', rank: 14, points: 0 },

  // Special cards
  { id: 'special-mahjong', suit: 'Special', value: 'Mahjong', rank: 1, points: 0 },
  { id: 'special-dog', suit: 'Special', value: 'Hound', rank: 1, points: 0 },
  { id: 'special-phoenix', suit: 'Special', value: 'Phoenix', rank: 15, points: -25 },
  { id: 'special-dragon', suit: 'Special', value: 'Dragon', rank: 16, points: 25 }
];

export const DECK_CARD_IDS = [
  'jade-2', 'jade-3', 'jade-4', 'jade-5', 'jade-6', 'jade-7', 'jade-8', 'jade-9', 'jade-10',
  'jade-J', 'jade-Q', 'jade-K', 'jade-A',
  'pagoda-2', 'pagoda-3', 'pagoda-4', 'pagoda-5', 'pagoda-6', 'pagoda-7', 'pagoda-8', 'pagoda-9', 'pagoda-10',
  'pagoda-J', 'pagoda-Q', 'pagoda-K', 'pagoda-A',
  'star-2', 'star-3', 'star-4', 'star-5', 'star-6', 'star-7', 'star-8', 'star-9', 'star-10',
  'star-J', 'star-Q', 'star-K', 'star-A',
  'sword-2', 'sword-3', 'sword-4', 'sword-5', 'sword-6', 'sword-7', 'sword-8', 'sword-9', 'sword-10',
  'sword-J', 'sword-Q', 'sword-K', 'sword-A',
  'special-mahjong', 'special-dog', 'special-phoenix', 'special-dragon'
];


/**
 * Checks if a card ID is valid (exists in the DECK_CARD_IDS list).
 * @param {string} id - The card ID to check.
 * @returns {boolean} - True if the ID is valid, false otherwise.
 */
export function isValidCardId(id) {
  return DECK_CARD_IDS.includes(id);
}

/**
 * Checks if all card IDs in an array are valid.
 * @param {string[]} ids - Array of card IDs to check.
 * @returns {boolean} - True if all IDs are valid, false otherwise.
 */
export function areValidCardIds(ids) {
  return ids.every(isValidCardId);
}

/**
 * Retrieves a full card object by its ID.
 * @param {string} id - The ID of the card to retrieve.
 * @returns {object} - The full card object.
 */
export function getCardById(id) {
  const card = DECK_CARDS.find(card => card.id === id);
  if (!card) {
    throw new Error(`Card with ID "${id}" not found`);
  }
  return card;
}

/**
 * Retrieves an array of full card objects corresponding to an array of card IDs.
 * @param {string[]} ids - The array of card IDs to retrieve.
 * @param {boolean} [strict=false] - Whether to throw an error if any invalid IDs are found:
 *   - If `true`: Throws an error if any card ID in `ids` is invalid.
 *   - If `false`: Skips invalid IDs and only returns valid cards.
 * @returns {object[]} - An array of full card objects. Invalid IDs are ignored.
 */
export function getCardsByIds(ids, strict = false) {
  const invalidIds = ids.filter(id => !isValidCardId(id));
  if (strict && invalidIds.length > 0) {
    throw new Error(`Invalid card IDs: ${invalidIds.join(', ')}`);
  }
  return ids
    .map(id => DECK_CARDS.find(card => card.id === id))
    .filter(card => card !== undefined);
}