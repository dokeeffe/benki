import { CardLoader } from './CardLoader.js'
import { ProgressTracker } from './ProgressTracker.js'
import { CardRenderer } from './CardRenderer.js'

export class FlashcardApp {
  constructor() {
    this.cardLoader = new CardLoader()
    this.progressTracker = null
    this.cardRenderer = new CardRenderer()
    
    this.cards = []
    this.currentCardIndex = 0
    this.isLoaded = false
    
    this.elements = {
      loading: document.getElementById('loading'),
      errorMessage: document.getElementById('error-message'),
      errorText: document.getElementById('error-text'),
      retryButton: document.getElementById('retry-button'),
      flashcardContainer: document.getElementById('flashcard-container'),
      deckName: document.getElementById('deck-name'),
      cardCounter: document.getElementById('card-counter'),
      progressFill: document.getElementById('progress-fill'),
      
      prevButton: document.getElementById('prev-button'),
      nextButton: document.getElementById('next-button'),
      shuffleButton: document.getElementById('shuffle-button'),
      resetProgressButton: document.getElementById('reset-progress')
    }
  }

  async initialize() {
    this.bindEvents()
    await this.loadCards()
  }

  bindEvents() {
    this.elements.retryButton.addEventListener('click', () => this.loadCards())
    this.elements.prevButton.addEventListener('click', () => this.previousCard())
    this.elements.nextButton.addEventListener('click', () => this.nextCard())
    this.elements.shuffleButton.addEventListener('click', () => this.shuffleDeck())
    this.elements.resetProgressButton.addEventListener('click', () => this.resetProgress())

    // Add tap-to-flip functionality to the flashcard
    const flashcard = document.getElementById('flashcard')
    if (flashcard) {
      flashcard.addEventListener('click', () => this.flipCard())
      flashcard.style.cursor = 'pointer'
    }

    document.addEventListener('keydown', (e) => this.handleKeyPress(e))
  }

  async loadCards() {
    this.showLoading()

    try {
      const { cards, deckInfo } = await this.cardLoader.loadCards()
      
      this.cards = cards
      this.progressTracker = new ProgressTracker(deckInfo.name)
      this.progressTracker.initializeDeck(cards.length)
      
      this.elements.deckName.textContent = deckInfo.name
      
      this.isLoaded = true
      this.currentCardIndex = 0
      
      this.showFlashcard()
      this.renderCurrentCard()
      this.updateUI()

    } catch (error) {
      this.showError(error.message)
    }
  }

  showLoading() {
    this.elements.loading.classList.remove('hidden')
    this.elements.errorMessage.classList.add('hidden')
    this.elements.flashcardContainer.classList.add('hidden')
  }

  showError(message) {
    this.elements.loading.classList.add('hidden')
    this.elements.flashcardContainer.classList.add('hidden')
    this.elements.errorMessage.classList.remove('hidden')
    this.elements.errorText.textContent = message
  }

  showFlashcard() {
    this.elements.loading.classList.add('hidden')
    this.elements.errorMessage.classList.add('hidden')
    this.elements.flashcardContainer.classList.remove('hidden')
  }

  renderCurrentCard() {
    if (!this.isLoaded || this.cards.length === 0) return

    const currentCard = this.cards[this.currentCardIndex]
    this.cardRenderer.renderCard(currentCard, false)
    
    this.progressTracker.markCardSeen(currentCard.id)
  }

  flipCard() {
    if (!this.isLoaded) return

    this.cardRenderer.flipCard()
  }

  nextCard() {
    if (!this.isLoaded) return

    this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length
    this.renderCurrentCard()
    this.updateUI()
    this.resetCardFlip()
  }

  previousCard() {
    if (!this.isLoaded) return

    this.currentCardIndex = this.currentCardIndex === 0 
      ? this.cards.length - 1 
      : this.currentCardIndex - 1
    this.renderCurrentCard()
    this.updateUI()
    this.resetCardFlip()
  }

  resetCardFlip() {
    this.cardRenderer.setFlipped(false)
  }

  shuffleDeck() {
    if (!this.isLoaded) return

    this.cardLoader.shuffleCards()
    this.cards = this.cardLoader.getCards()
    this.currentCardIndex = 0
    this.renderCurrentCard()
    this.updateUI()
    this.resetCardFlip()
  }

  resetProgress() {
    if (!this.isLoaded) return

    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      this.progressTracker.resetProgress()
      this.updateUI()
    }
  }

  updateUI() {
    if (!this.isLoaded) return

    this.elements.cardCounter.textContent = `${this.currentCardIndex + 1}/${this.cards.length}`
    
    const progress = this.progressTracker.getProgress()
    const progressPercentage = Math.min(100, (this.currentCardIndex + 1) / this.cards.length * 100)
    this.elements.progressFill.style.width = `${progressPercentage}%`

    this.updateButtonStates()
  }

  updateButtonStates() {
    if (!this.isLoaded) return

    this.elements.prevButton.disabled = this.cards.length <= 1
    this.elements.nextButton.disabled = this.cards.length <= 1
    this.elements.shuffleButton.disabled = this.cards.length <= 1
  }

  handleKeyPress(event) {
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