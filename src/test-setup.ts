// Test setup file for Vitest
import { vi } from 'vitest'

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock fetch for API calls
global.fetch = vi.fn()

// Setup DOM environment
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
    <div class="card-back"></div>
  </div>
`