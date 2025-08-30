// Flashcard data types
export interface CardFront {
  text: string
  focus: string
}

export interface CardBack {
  meaning: string
  description: string
  rule: string
  nuance: string
  example_translation: string
}

export interface FlashCard {
  id: string
  front: CardFront
  back: CardBack
  tags: string[]
}

export interface DeckInfo {
  name: string
  description: string
  version: string
}

export interface CardData {
  name: string
  description: string
  version: string
  cards: FlashCard[]
}

// Progress tracking types
export interface ProgressData {
  cardsSeen: Set<string>
  cardsCorrect: Set<string>
  cardsIncorrect: Set<string>
  totalCards: number
  lastStudied: number | null
  studySessions: number
}

export interface ProgressStats {
  seen: number
  correct: number
  incorrect: number
  total: number
  percentageSeen: number
  percentageCorrect: number
}

// DOM element types
export interface AppElements {
  loading: HTMLElement | null
  errorMessage: HTMLElement | null
  errorText: HTMLElement | null
  retryButton: HTMLButtonElement | null
  flashcardContainer: HTMLElement | null
  deckName: HTMLElement | null
  cardCounter: HTMLElement | null
  progressFill: HTMLElement | null
  prevButton: HTMLButtonElement | null
  nextButton: HTMLButtonElement | null
  shuffleButton: HTMLButtonElement | null
  resetProgressButton: HTMLButtonElement | null
}

export interface RendererElements {
  focusGrammar: HTMLElement | null
  japaneseText: HTMLElement | null
  meaning: HTMLElement | null
  description: HTMLElement | null
  rule: HTMLElement | null
  nuance: HTMLElement | null
  translation: HTMLElement | null
  flashcard: HTMLElement | null
  cardFront: HTMLElement | null
  cardBack: HTMLElement | null
}