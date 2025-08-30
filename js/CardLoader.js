export class CardLoader {
  constructor() {
    this.cards = []
    this.deckInfo = {}
  }

  async loadCards(jsonPath = '/cards/N2-grammar.json') {
    try {
      const response = await fetch(jsonPath)
      
      if (!response.ok) {
        throw new Error(`Failed to load cards: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.cards || !Array.isArray(data.cards)) {
        throw new Error('Invalid card data format: missing cards array')
      }

      if (data.cards.length === 0) {
        throw new Error('No cards found in the deck')
      }

      this.cards = data.cards
      this.deckInfo = {
        name: data.name || 'Unknown Deck',
        description: data.description || '',
        version: data.version || '1.0'
      }

      return {
        cards: this.cards,
        deckInfo: this.deckInfo
      }
    } catch (error) {
      console.error('Error loading cards:', error)
      throw error
    }
  }

  getCards() {
    return this.cards
  }

  getDeckInfo() {
    return this.deckInfo
  }

  shuffleCards() {
    const shuffled = [...this.cards]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    this.cards = shuffled
    return this.cards
  }
}