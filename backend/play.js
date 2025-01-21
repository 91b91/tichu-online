class Play {
  #userId;
  #cards;

  constructor(userId, cards = []) {
      this.#userId = userId;
      this.#cards = [...cards];
  }

  // Getters
  getUserId() {
    return this.#userId;
  }

  getCards() {
    return [...this.#cards];
  }  

  // Setters
  setUserId(userId) {
    if (!userId) {
      throw new Error('UserId cannot be empty');
    }
    this.#userId = userId;
  }

  setCards(cards) {
    if (!Array.isArray(cards)) {
      throw new Error('Cards must be an array');
    }
    this.#cards = [...cards];
  }

  toString() {
    return `Play(userId: ${this.#userId}, cards: [${this.#cards.join(', ')}])`;
  }

  toJSON() {
    return {
      userId: this.#userId,
      cards: [...this.#cards]
    };
  }

  isValidPlay(play) {
    this.#cards
    return true;
  }

  doesBeatPlay(playToBeat) {
    // TO-DO
    return true;
  }

  analyzeTichuPlay(cards) {

  }
} 

export default Play;