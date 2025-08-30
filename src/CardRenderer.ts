import type { FlashCard, RendererElements } from './types.js'

export class CardRenderer {
  private elements: RendererElements

  constructor() {
    this.elements = {
      focusGrammar: document.getElementById('focus-grammar'),
      japaneseText: document.getElementById('japanese-text'),
      meaning: document.getElementById('meaning'),
      description: document.getElementById('description'),
      rule: document.getElementById('rule'),
      nuance: document.getElementById('nuance'),
      translation: document.getElementById('translation'),
      flashcard: document.getElementById('flashcard'),
      cardFront: document.querySelector('.card-front'),
      cardBack: document.querySelector('.card-back')
    }
  }

  renderCard(card: FlashCard, isFlipped: boolean = false): void {
    this.renderFront(card)
    this.renderBack(card)
    this.setFlipped(isFlipped)
  }

  private renderFront(card: FlashCard): void {
    if (!card.front) return

    if (this.elements.focusGrammar) {
      this.elements.focusGrammar.textContent = card.front.focus || ''
    }
    
    if (this.elements.japaneseText) {
      const japaneseText = this.parseMarkdown(card.front.text || '')
      this.elements.japaneseText.innerHTML = japaneseText
    }
  }

  private renderBack(card: FlashCard): void {
    if (!card.back) return

    if (this.elements.meaning) {
      this.elements.meaning.textContent = card.back.meaning || ''
    }
    if (this.elements.description) {
      this.elements.description.textContent = card.back.description || ''
    }
    if (this.elements.rule) {
      this.elements.rule.textContent = card.back.rule || ''
    }
    if (this.elements.nuance) {
      this.elements.nuance.textContent = card.back.nuance || ''
    }
    if (this.elements.translation) {
      this.elements.translation.textContent = card.back.example_translation || ''
    }
  }

  private parseMarkdown(text: string): string {
    if (!text) return ''
    
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }

  setFlipped(flipped: boolean): void {
    if (flipped) {
      this.elements.flashcard.classList.add('flipped')
      this.elements.cardFront.classList.add('hidden')
      this.elements.cardBack.classList.remove('hidden')
    } else {
      this.elements.flashcard.classList.remove('flipped')
      this.elements.cardFront.classList.remove('hidden')
      this.elements.cardBack.classList.add('hidden')
    }
  }

  isFlipped(): boolean {
    return this.elements.flashcard.classList.contains('flipped')
  }

  flipCard(): boolean {
    const isCurrentlyFlipped = this.isFlipped()
    this.setFlipped(!isCurrentlyFlipped)
    return !isCurrentlyFlipped
  }

  clear(): void {
    Object.values(this.elements).forEach(element => {
      if (element && element.textContent !== undefined) {
        element.textContent = ''
      }
    })
    this.setFlipped(false)
  }
}