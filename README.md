# 勉気 Benki - Japanese Flashcard Study App

A clean, mobile-friendly Japanese flashcard study application built with Vite and vanilla JavaScript.

## Features

- **Clean Study Interface**: Distraction-free flashcard experience optimized for mobile and desktop
- **Japanese Text Support**: Proper fonts and rendering for kanji, hiragana, and katakana
- **Markdown Parsing**: Renders **bold** grammar points from your JSON data
- **Progress Tracking**: Tracks your study progress using localStorage
- **Card Navigation**: Previous/Next navigation with keyboard shortcuts
- **Shuffle Mode**: Randomize your deck order for better learning
- **Responsive Design**: Works great on phones, tablets, and computers

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Usage

### Adding New Card Decks

Place your JSON files in the `/cards/` directory. The app currently loads `/cards/N2-grammar.json` by default.

### JSON Format

```json
{
  "name": "Deck Name",
  "description": "Deck description",
  "version": "1.0",
  "cards": [
    {
      "id": "unique-id",
      "front": {
        "text": "Japanese text with **bold** grammar points",
        "focus": "Grammar point being tested"
      },
      "back": {
        "meaning": "English meaning",
        "description": "Detailed explanation",
        "rule": "Grammar rule pattern",
        "nuance": "Usage nuance",
        "example_translation": "Full sentence translation"
      },
      "tags": ["grammar", "n2", "etc"]
    }
  ]
}
```

### Keyboard Shortcuts

- **Space**: Flip card
- **Arrow Left**: Previous card  
- **Arrow Right**: Next card
- **Ctrl/Cmd + S**: Shuffle deck

## Deployment

### GitHub Pages

1. Build the app:
   ```bash
   npm run build
   ```

2. The build files will be in the `dist` folder

3. Deploy the `dist` folder to GitHub Pages

### Custom Domain

Update the `base` path in `vite.config.js` if deploying to a custom domain:

```js
export default defineConfig({
  base: '/', // Change this for your deployment path
})
```

## Technical Details

- **Framework**: Vite + Vanilla JavaScript (ES6 modules)
- **Fonts**: Noto Sans JP for Japanese text, Inter for UI
- **Storage**: LocalStorage for progress tracking
- **Build**: Optimized for modern browsers
- **Mobile**: Responsive design with touch-friendly controls

## Project Structure

```
benki/
├── cards/                 # JSON flashcard data
│   └── N2-grammar.json
├── src/                    # JavaScript modules
│   ├── FlashcardApp.ts   # Main application logic
│   ├── CardLoader.ts     # JSON loading and parsing
│   ├── CardRenderer.ts   # Card display and markdown
│   └── ProgressTracker.ts # LocalStorage progress
├── index.html            # Main HTML file
├── main.js              # Application entry point
├── style.css            # All CSS styles
└── vite.config.js       # Vite configuration
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License