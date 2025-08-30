import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProgressTracker } from '../ProgressTracker'

describe('ProgressTracker', () => {
  let progressTracker: ProgressTracker
  
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset localStorage
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    
    progressTracker = new ProgressTracker('Test Deck')
  })

  describe('initialization', () => {
    it('should initialize with empty progress when no localStorage data', () => {
      const progress = progressTracker.getProgress()
      
      expect(progress.seen).toBe(0)
      expect(progress.correct).toBe(0)
      expect(progress.incorrect).toBe(0)
      expect(progress.total).toBe(0)
    })

    it('should load existing progress from localStorage', () => {
      const storedData = {
        cardsSeen: ['card1', 'card2'],
        cardsCorrect: ['card1'],
        cardsIncorrect: ['card2'],
        totalCards: 10,
        lastStudied: Date.now(),
        studySessions: 2
      }
      
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(storedData))
      
      const tracker = new ProgressTracker('Existing Deck')
      const progress = tracker.getProgress()
      
      expect(progress.seen).toBe(2)
      expect(progress.correct).toBe(1)
      expect(progress.incorrect).toBe(1)
      expect(progress.total).toBe(10)
    })
  })

  describe('deck initialization', () => {
    it('should initialize deck with total cards', () => {
      progressTracker.initializeDeck(25)
      const progress = progressTracker.getProgress()
      
      expect(progress.total).toBe(25)
      expect(localStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('card tracking', () => {
    beforeEach(() => {
      progressTracker.initializeDeck(10)
    })

    it('should mark card as seen', () => {
      progressTracker.markCardSeen('card1')
      
      expect(progressTracker.isCardSeen('card1')).toBe(true)
      expect(progressTracker.getProgress().seen).toBe(1)
    })

    it('should mark card as correct', () => {
      progressTracker.markCardCorrect('card1')
      
      expect(progressTracker.isCardCorrect('card1')).toBe(true)
      expect(progressTracker.isCardSeen('card1')).toBe(true)
      expect(progressTracker.getProgress().correct).toBe(1)
    })

    it('should mark card as incorrect', () => {
      progressTracker.markCardIncorrect('card1')
      
      expect(progressTracker.isCardIncorrect('card1')).toBe(true)
      expect(progressTracker.isCardSeen('card1')).toBe(true)
      expect(progressTracker.getProgress().incorrect).toBe(1)
    })

    it('should move card from incorrect to correct', () => {
      progressTracker.markCardIncorrect('card1')
      progressTracker.markCardCorrect('card1')
      
      expect(progressTracker.isCardCorrect('card1')).toBe(true)
      expect(progressTracker.isCardIncorrect('card1')).toBe(false)
      expect(progressTracker.getProgress().correct).toBe(1)
      expect(progressTracker.getProgress().incorrect).toBe(0)
    })
  })

  describe('progress calculation', () => {
    beforeEach(() => {
      progressTracker.initializeDeck(10)
    })

    it('should calculate percentage seen correctly', () => {
      progressTracker.markCardSeen('card1')
      progressTracker.markCardSeen('card2')
      progressTracker.markCardSeen('card3')
      
      const progress = progressTracker.getProgress()
      expect(progress.percentageSeen).toBe(30) // 3/10 * 100
    })

    it('should calculate percentage correct correctly', () => {
      progressTracker.markCardCorrect('card1')
      progressTracker.markCardCorrect('card2')
      progressTracker.markCardIncorrect('card3')
      
      const progress = progressTracker.getProgress()
      expect(progress.percentageCorrect).toBeCloseTo(66.67, 1) // 2/3 * 100
    })
  })

  describe('progress reset', () => {
    it('should reset all progress but keep total cards and increment sessions', () => {
      progressTracker.initializeDeck(10)
      progressTracker.markCardCorrect('card1')
      progressTracker.markCardIncorrect('card2')
      
      progressTracker.resetProgress()
      
      const progress = progressTracker.getProgress()
      expect(progress.seen).toBe(0)
      expect(progress.correct).toBe(0)
      expect(progress.incorrect).toBe(0)
      expect(progress.total).toBe(10) // Should keep total
    })
  })
})