export class CardRenderer {
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

  renderCard(card, isFlipped = false) {
    this.renderFront(card)
    this.renderBack(card)
    this.setFlipped(isFlipped)
  }

  renderFront(card) {
    if (!card.front) return

    this.elements.focusGrammar.textContent = card.front.focus || ''
    
    const japaneseText = this.parseMarkdown(card.front.text || '')
    this.elements.japaneseText.innerHTML = japaneseText
  }

  renderBack(card) {
    if (!card.back) return

    this.elements.meaning.textContent = card.back.meaning || ''
    this.elements.description.textContent = card.back.description || ''
    this.elements.rule.textContent = card.back.rule || ''
    this.elements.nuance.textContent = card.back.nuance || ''
    this.elements.translation.textContent = card.back.example_translation || ''
  }

  parseMarkdown(text) {
    if (!text) return ''
    
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }

  setFlipped(flipped) {
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

  isFlipped() {
    return this.elements.flashcard.classList.contains('flipped')
  }

  flipCard() {
    const isCurrentlyFlipped = this.isFlipped()
    this.setFlipped(!isCurrentlyFlipped)
    return !isCurrentlyFlipped
  }

  clear() {
    Object.values(this.elements).forEach(element => {
      if (element && element.textContent !== undefined) {
        element.textContent = ''
      }
    })
    this.setFlipped(false)
  }
}