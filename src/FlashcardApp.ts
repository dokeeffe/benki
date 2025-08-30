import { CardLoader } from './CardLoader.js'
import { ProgressTracker } from './ProgressTracker.js'
import { CardRenderer } from './CardRenderer.js'
import type { FlashCard, AppElements } from './types.js'

export class FlashcardApp {
  private cardLoader: CardLoader
  private progressTracker: ProgressTracker | null = null
  private cardRenderer: CardRenderer
  
  private cards: FlashCard[] = []
  private currentCardIndex: number = 0
  private isLoaded: boolean = false
  private elements: AppElements

  constructor() {
    this.cardLoader = new CardLoader()
    this.cardRenderer = new CardRenderer()
    
    this.elements = {
      loading: document.getElementById('loading'),
      errorMessage: document.getElementById('error-message'),
      errorText: document.getElementById('error-text'),
      retryButton: document.getElementById('retry-button') as HTMLButtonElement | null,
      flashcardContainer: document.getElementById('flashcard-container'),
      deckName: document.getElementById('deck-name'),
      cardCounter: document.getElementById('card-counter'),
      progressFill: document.getElementById('progress-fill'),
      
      prevButton: document.getElementById('prev-button') as HTMLButtonElement | null,
      nextButton: document.getElementById('next-button') as HTMLButtonElement | null,
      shuffleButton: document.getElementById('shuffle-button') as HTMLButtonElement | null,
      resetProgressButton: document.getElementById('reset-progress') as HTMLButtonElement | null
    }
  }

  async initialize(): Promise<void> {
    this.bindEvents()
    await this.loadCards()
  }

  private bindEvents(): void {
    this.elements.retryButton?.addEventListener('click', () => this.loadCards())
    this.elements.prevButton?.addEventListener('click', () => this.previousCard())
    this.elements.nextButton?.addEventListener('click', () => this.nextCard())
    this.elements.shuffleButton?.addEventListener('click', () => this.shuffleDeck())
    this.elements.resetProgressButton?.addEventListener('click', () => this.resetProgress())

    // Add tap-to-flip functionality to the flashcard
    const flashcard = document.getElementById('flashcard')
    if (flashcard) {
      flashcard.addEventListener('click', () => this.flipCard())
      flashcard.style.cursor = 'pointer'
    }

    document.addEventListener('keydown', (e) => this.handleKeyPress(e))
  }

  private async loadCards(): Promise<void> {
    this.showLoading()

    try {
      const { cards, deckInfo } = await this.cardLoader.loadCards()
      
      this.cards = cards
      this.progressTracker = new ProgressTracker(deckInfo.name)
      this.progressTracker.initializeDeck(cards.length)
      
      if (this.elements.deckName) {
        this.elements.deckName.textContent = deckInfo.name
      }
      
      this.isLoaded = true
      this.currentCardIndex = 0
      
      this.showFlashcard()
      this.renderCurrentCard()
      this.updateUI()

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      this.showError(message)
    }
  }

  private showLoading(): void {
    this.elements.loading?.classList.remove('hidden')
    this.elements.errorMessage?.classList.add('hidden')
    this.elements.flashcardContainer?.classList.add('hidden')
  }

  private showError(message: string): void {
    this.elements.loading.classList.add('hidden')
    this.elements.flashcardContainer.classList.add('hidden')
    this.elements.errorMessage.classList.remove('hidden')
    this.elements.errorText.textContent = message
  }

  private showFlashcard(): void {
    this.elements.loading.classList.add('hidden')
    this.elements.errorMessage.classList.add('hidden')
    this.elements.flashcardContainer.classList.remove('hidden')
  }

  private renderCurrentCard(): void {
    if (!this.isLoaded || this.cards.length === 0) return

    const currentCard = this.cards[this.currentCardIndex]
    this.cardRenderer.renderCard(currentCard, false)
    
    this.progressTracker.markCardSeen(currentCard.id)
  }

  private flipCard(): void {
    if (!this.isLoaded) return

    this.cardRenderer.flipCard()
  }

  private nextCard(): void {
    if (!this.isLoaded) return

    this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length
    this.renderCurrentCard()
    this.updateUI()
    this.resetCardFlip()
  }

  private previousCard(): void {
    if (!this.isLoaded) return

    this.currentCardIndex = this.currentCardIndex === 0 
      ? this.cards.length - 1 
      : this.currentCardIndex - 1
    this.renderCurrentCard()
    this.updateUI()
    this.resetCardFlip()
  }

  private resetCardFlip(): void {
    this.cardRenderer.setFlipped(false)
  }

  private shuffleDeck(): void {
    if (!this.isLoaded) return

    this.cardLoader.shuffleCards()
    this.cards = this.cardLoader.getCards()
    this.currentCardIndex = 0
    this.renderCurrentCard()
    this.updateUI()
    this.resetCardFlip()
  }

  private resetProgress(): void {
    if (!this.isLoaded) return

    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      this.progressTracker.resetProgress()
      this.updateUI()
    }
  }

  private updateUI(): void {
    if (!this.isLoaded) return

    this.elements.cardCounter.textContent = `${this.currentCardIndex + 1}/${this.cards.length}`
    
    const progress = this.progressTracker.getProgress()
    const progressPercentage = Math.min(100, (this.currentCardIndex + 1) / this.cards.length * 100)
    this.elements.progressFill.style.width = `${progressPercentage}%`

    this.updateButtonStates()
  }

  private updateButtonStates(): void {
    if (!this.isLoaded) return

    this.elements.prevButton.disabled = this.cards.length <= 1
    this.elements.nextButton.disabled = this.cards.length <= 1
    this.elements.shuffleButton.disabled = this.cards.length <= 1
  }

  private handleKeyPress(event: KeyboardEvent): void {
    if (!this.isLoaded) return

    switch (event.code) {
      case 'Space':
        event.preventDefault()
        this.flipCard()
        break
      case 'ArrowLeft':
        event.preventDefault()
        this.previousCard()
        break
      case 'ArrowRight':
        event.preventDefault()
        this.nextCard()
        break
      case 'KeyS':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          this.shuffleDeck()
        }
        break
    }
  }
}