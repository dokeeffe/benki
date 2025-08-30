import type { ProgressData, ProgressStats } from './types.js'

export class ProgressTracker {
  private deckName: string
  private storageKey: string
  private progress: ProgressData

  constructor(deckName: string) {
    this.deckName = deckName
    this.storageKey = `benki_progress_${this.sanitizeDeckName(deckName)}`
    this.progress = this.loadProgress()
  }

  private sanitizeDeckName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_')
  }

  private loadProgress(): ProgressData {
    try {
      const stored: string | null = localStorage.getItem(this.storageKey)
      if (stored) {
        const parsed: any = JSON.parse(stored)
        // Convert arrays back to Sets
        return {
          cardsSeen: new Set(parsed.cardsSeen || []),
          cardsCorrect: new Set(parsed.cardsCorrect || []),
          cardsIncorrect: new Set(parsed.cardsIncorrect || []),
          totalCards: parsed.totalCards || 0,
          lastStudied: parsed.lastStudied || null,
          studySessions: parsed.studySessions || 0
        }
      }
    } catch (error) {
      console.warn('Failed to load progress from localStorage:', error)
    }

    return {
      cardsSeen: new Set(),
      cardsCorrect: new Set(),
      cardsIncorrect: new Set(),
      totalCards: 0,
      lastStudied: null,
      studySessions: 0
    }
  }

  private saveProgress(): void {
    try {
      const progressData = {
        ...this.progress,
        cardsSeen: Array.from(this.progress.cardsSeen),
        cardsCorrect: Array.from(this.progress.cardsCorrect),
        cardsIncorrect: Array.from(this.progress.cardsIncorrect)
      }
      localStorage.setItem(this.storageKey, JSON.stringify(progressData))
    } catch (error) {
      console.warn('Failed to save progress to localStorage:', error)
    }
  }

  initializeDeck(totalCards: number): void {
    this.progress.totalCards = totalCards
    if (this.progress.cardsSeen.size === 0) {
      this.progress.studySessions = 1
    }
    this.saveProgress()
  }

  markCardSeen(cardId: string): void {
    this.progress.cardsSeen.add(cardId)
    this.progress.lastStudied = Date.now()
    this.saveProgress()
  }

  markCardCorrect(cardId: string): void {
    this.progress.cardsCorrect.add(cardId)
    this.progress.cardsIncorrect.delete(cardId)
    this.markCardSeen(cardId)
  }

  markCardIncorrect(cardId: string): void {
    this.progress.cardsIncorrect.add(cardId)
    this.progress.cardsCorrect.delete(cardId)
    this.markCardSeen(cardId)
  }

  getProgress(): ProgressStats {
    return {
      seen: this.progress.cardsSeen.size,
      correct: this.progress.cardsCorrect.size,
      incorrect: this.progress.cardsIncorrect.size,
      total: this.progress.totalCards,
      percentageSeen: this.progress.totalCards > 0 ? 
        (this.progress.cardsSeen.size / this.progress.totalCards) * 100 : 0,
      percentageCorrect: this.progress.cardsSeen.size > 0 ? 
        (this.progress.cardsCorrect.size / this.progress.cardsSeen.size) * 100 : 0
    }
  }

  isCardSeen(cardId: string): boolean {
    return this.progress.cardsSeen.has(cardId)
  }

  isCardCorrect(cardId: string): boolean {
    return this.progress.cardsCorrect.has(cardId)
  }

  isCardIncorrect(cardId: string): boolean {
    return this.progress.cardsIncorrect.has(cardId)
  }

  resetProgress(): void {
    this.progress = {
      cardsSeen: new Set(),
      cardsCorrect: new Set(),
      cardsIncorrect: new Set(),
      totalCards: this.progress.totalCards,
      lastStudied: null,
      studySessions: this.progress.studySessions + 1
    }
    this.saveProgress()
  }
}