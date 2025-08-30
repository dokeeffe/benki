import { describe, it, expect, beforeEach } from 'vitest'
import { CardRenderer } from '../CardRenderer'
import type { FlashCard } from '../types'

describe('CardRenderer', () => {
  let cardRenderer: CardRenderer
  let mockCard: FlashCard

  beforeEach(() => {
    // Reset DOM for each test
    document.body.innerHTML = `
      <div id="focus-grammar"></div>
      <div id="japanese-text"></div>
      <div id="meaning"></div>
      <div id="description"></div>
      <div id="rule"></div>
      <div id="nuance"></div>
      <div id="translation"></div>
      <div id="flashcard">
        <div class="card-front"></div>
        <div class="card-back hidden"></div>
      </div>
    `
    
    cardRenderer = new CardRenderer()
    
    mockCard = {
      id: 'test-1',
      front: {
        text: 'テスト**です**',
        focus: 'です'
      },
      back: {
        meaning: 'It is a test',
        description: 'Polite form of copula',
        rule: 'Noun + です',
        nuance: 'Formal and polite',
        example_translation: 'It is a test.'
      },
      tags: ['grammar', 'polite']
    }
  })

  describe('renderCard', () => {
    it('should render card front by default', () => {
      cardRenderer.renderCard(mockCard)
      
      const focusGrammar = document.getElementById('focus-grammar')
      const japaneseText = document.getElementById('japanese-text')
      
      expect(focusGrammar?.textContent).toBe('です')
      expect(japaneseText?.innerHTML).toBe('テスト<strong>です</strong>')
    })

    it('should render card back content', () => {
      cardRenderer.renderCard(mockCard)
      
      const meaning = document.getElementById('meaning')
      const description = document.getElementById('description')
      const rule = document.getElementById('rule')
      const nuance = document.getElementById('nuance')
      const translation = document.getElementById('translation')
      
      expect(meaning?.textContent).toBe('It is a test')
      expect(description?.textContent).toBe('Polite form of copula')
      expect(rule?.textContent).toBe('Noun + です')
      expect(nuance?.textContent).toBe('Formal and polite')
      expect(translation?.textContent).toBe('It is a test.')
    })

    it('should show card as flipped when specified', () => {
      cardRenderer.renderCard(mockCard, true)
      
      expect(cardRenderer.isFlipped()).toBe(true)
    })
  })

  describe('markdown parsing', () => {
    it('should convert **text** to <strong>text</strong>', () => {
      const testCard = {
        ...mockCard,
        front: {
          text: '**重要**な文法です。**注意**してください。',
          focus: '重要'
        }
      }
      
      cardRenderer.renderCard(testCard)
      
      const japaneseText = document.getElementById('japanese-text')
      expect(japaneseText?.innerHTML).toBe('<strong>重要</strong>な文法です。<strong>注意</strong>してください。')
    })

    it('should handle text without markdown', () => {
      const testCard = {
        ...mockCard,
        front: {
          text: 'これは普通の文です。',
          focus: 'です'
        }
      }
      
      cardRenderer.renderCard(testCard)
      
      const japaneseText = document.getElementById('japanese-text')
      expect(japaneseText?.innerHTML).toBe('これは普通の文です。')
    })
  })

  describe('card flipping', () => {
    beforeEach(() => {
      cardRenderer.renderCard(mockCard)
    })

    it('should flip card and return new state', () => {
      expect(cardRenderer.isFlipped()).toBe(false)
      
      const newState = cardRenderer.flipCard()
      
      expect(newState).toBe(true)
      expect(cardRenderer.isFlipped()).toBe(true)
    })

    it('should flip card back and forth', () => {
      cardRenderer.flipCard() // flip to back
      expect(cardRenderer.isFlipped()).toBe(true)
      
      cardRenderer.flipCard() // flip to front  
      expect(cardRenderer.isFlipped()).toBe(false)
    })

    it('should set flipped state directly', () => {
      cardRenderer.setFlipped(true)
      expect(cardRenderer.isFlipped()).toBe(true)
      
      cardRenderer.setFlipped(false)
      expect(cardRenderer.isFlipped()).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all text content and reset flip state', () => {
      cardRenderer.renderCard(mockCard, true)
      cardRenderer.clear()
      
      const focusGrammar = document.getElementById('focus-grammar')
      const japaneseText = document.getElementById('japanese-text')
      const meaning = document.getElementById('meaning')
      
      expect(focusGrammar?.textContent).toBe('')
      expect(japaneseText?.textContent).toBe('')
      expect(meaning?.textContent).toBe('')
      expect(cardRenderer.isFlipped()).toBe(false)
    })
  })
})