import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CardLoader } from '../CardLoader'
import type { CardData } from '../types'

describe('CardLoader', () => {
  let cardLoader: CardLoader
  
  beforeEach(() => {
    cardLoader = new CardLoader()
    vi.clearAllMocks()
  })

  describe('loadCards', () => {
    it('should load cards successfully', async () => {
      const mockData: CardData = {
        name: 'Test Deck',
        description: 'Test Description', 
        version: '1.0',
        cards: [
          {
            id: 'test-1',
            front: { text: 'テスト**です**', focus: 'です' },
            back: {
              meaning: 'It is a test',
              description: 'Polite form',
              rule: 'Noun + です',
              nuance: 'Formal',
              example_translation: 'It is a test'
            },
            tags: ['test']
          }
        ]
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await cardLoader.loadCards('./test.json')

      expect(result.cards).toHaveLength(1)
      expect(result.deckInfo.name).toBe('Test Deck')
      expect(result.cards[0].id).toBe('test-1')
    })

    it('should throw error for 404 response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      await expect(cardLoader.loadCards('./missing.json'))
        .rejects
        .toThrow('Failed to load cards: 404 Not Found')
    })

    it('should throw error for invalid JSON structure', async () => {
      const invalidData = { name: 'Test', cards: 'invalid' }
      
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidData,
      } as Response)

      await expect(cardLoader.loadCards('./invalid.json'))
        .rejects
        .toThrow('Invalid card data format: missing cards array')
    })

    it('should throw error for empty deck', async () => {
      const emptyData = { name: 'Empty', cards: [] }
      
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => emptyData,
      } as Response)

      await expect(cardLoader.loadCards('./empty.json'))
        .rejects
        .toThrow('No cards found in the deck')
    })
  })

  describe('shuffleCards', () => {
    it('should shuffle cards and return them', async () => {
      // First load some cards
      const mockData: CardData = {
        name: 'Test Deck',
        description: 'Test Description',
        version: '1.0', 
        cards: [
          { id: '1', front: { text: '1', focus: '1' }, back: { meaning: '1', description: '1', rule: '1', nuance: '1', example_translation: '1' }, tags: [] },
          { id: '2', front: { text: '2', focus: '2' }, back: { meaning: '2', description: '2', rule: '2', nuance: '2', example_translation: '2' }, tags: [] },
          { id: '3', front: { text: '3', focus: '3' }, back: { meaning: '3', description: '3', rule: '3', nuance: '3', example_translation: '3' }, tags: [] },
        ]
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      await cardLoader.loadCards('./test.json')
      
      const originalOrder = cardLoader.getCards().map(card => card.id)
      const shuffledCards = cardLoader.shuffleCards()
      
      expect(shuffledCards).toHaveLength(3)
      expect(shuffledCards.map(card => card.id).sort()).toEqual(['1', '2', '3'])
      // Note: There's a small chance this could fail if shuffle returns same order
    })
  })

  describe('getters', () => {
    it('should return empty arrays when no cards loaded', () => {
      expect(cardLoader.getCards()).toHaveLength(0)
      expect(cardLoader.getDeckInfo()).toEqual({})
    })
  })
})