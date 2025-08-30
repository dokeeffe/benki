import type { FlashCard, DeckInfo, CardData } from './types.js'

export class CardLoader {
  private cards: FlashCard[] = []
  private deckInfo: DeckInfo = {} as DeckInfo

  async loadCards(jsonPath: string = './cards/N2-grammar.json'): Promise<{ cards: FlashCard[], deckInfo: DeckInfo }> {
    try {
      const response: Response = await fetch(jsonPath)
      
      if (!response.ok) {
        throw new Error(`Failed to load cards: ${response.status} ${response.statusText}`)
      }

      const data: CardData = await response.json()
      
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

  getCards(): FlashCard[] {
    return this.cards
  }

  getDeckInfo(): DeckInfo {
    return this.deckInfo
  }

  shuffleCards(): FlashCard[] {
    const shuffled: FlashCard[] = [...this.cards]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    this.cards = shuffled
    return this.cards
  }
}