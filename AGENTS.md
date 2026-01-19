# Kids Math - Agent Development Guide

## Development Commands

Vanilla JavaScript/HTML/CSS project with no build system. Manual testing required.

**Run application:**
```bash
open index.html              # Main menu
open addition.html           # Open specific game
```

**Run specific game (macOS):**
```bash
open -a "Google Chrome" addition.html
```

**Syntax validation:**
```bash
node -c filename.js
```

**Debug with DevTools:**
```bash
open -a "Google Chrome" --args --auto-open-devtools-for-tabs addition.html
```

## Task Management

Always create a todo list before making any changes to the codebase:
- Use `todowrite` tool to plan all required steps
- Break complex tasks into smaller, actionable items
- Update todo status in real-time as you work
- Mark tasks complete immediately after finishing
- Only have ONE task in_progress at a time

## Code Style Guidelines

### JavaScript Conventions

**Naming:**
- Classes: `PascalCase` (e.g., `MathGame`, `BaseGame`)
- Methods/Functions: `camelCase` (e.g., `generateProblem()`, `checkAnswer()`)
- Variables: `camelCase` (e.g., `currentLevel`, `usedHint`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_HINTS`, `COLORS`)
- Event handlers: `handleEventName()` (e.g., `handleCorrectAnswer()`)

**Class Structure:**
```javascript
class GameClass extends BaseGame {
    constructor() {
        super('operationName');
        this.currentLevel = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateProblem();
    }

    setupEventListeners() {
        // Set up all event listeners here
    }

    generateProblem() {
        // Reset state and generate new problem
        this.usedHint = false;
        this.hintLevel = 0;
        // ...
    }
}
```

**BaseGame Inheritance:**
- All game classes should extend `BaseGame`
- Call `super('operation')` where operation is one of: 'addition', 'subtraction', 'multiplication', 'division', 'funMath'
- Override methods: `generateProblem()`, `showHint()`, `handleCorrectAnswer()`, `handleIncorrectAnswer()`

### HTML Structure

**Document order:**
1. Meta tags and title
2. Stylesheets (shared-styles.css first, then page-specific)
3. Container structure
4. Navigation
5. Header with stats
6. Game controls (level/activity selector)
7. Game area
8. Script tags (base-game.js before page-specific JS)

**Required elements for game pages:**
- `#stars` and `#streak` for stats display
- `#feedbackArea` for answer feedback
- `#hintContent` for hint messages
- `#celebration` for confetti effects
- `.activity-btn` or `.level-btn` for level/activity selection

### CSS Conventions

**Naming:**
- Classes: `kebab-case` (e.g., `level-btn`, `activity-selector`)
- IDs: `camelCase` (e.g., `stars`, `hintContent`, `answerInput`)

**Style patterns:**
- Gradients for buttons/backgrounds: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
- Box shadows: `0 4px 15px rgba(color, opacity)`
- Border radius: 30px containers, 50px pills/buttons
- Transitions: `all 0.3s ease`

### Error Handling

**Try-catch only for browser APIs:**
```javascript
playTone(frequency, duration) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // ... audio code
    } catch (e) {
        // Silently fail if audio not supported
    }
}
```

**DOM manipulation:**
- Always check if element exists before accessing
- Use optional chaining: `document.querySelector('.selector')?.classList.add('class')`
- Clear event listeners when regenerating content

### Data Management

Use localStorage for stats persistence. Problem objects store num1, num2, answer, and operation-specific properties.

### Accessibility

- Large fonts (1.1rem minimum, 1.3rem for important elements)
- High contrast colors
- Keyboard navigation (Enter to submit, Tab to navigate)
- Touch-friendly hit areas (minimum 44x44px)

### Testing Checklist

Before committing changes, manually test all game mechanics, feedback, sounds, and responsiveness.

### Common Patterns

**Event listeners:**
```javascript
setupEventListeners() {
    this.setupLevelButtons();
    this.setupAnswerHandlers();
    document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
    document.getElementById('mascot').addEventListener('click', () => this.mascotClick());
}
```

**Random numbers:** `Math.floor(Math.random() * (max - min + 1)) + min`

**Feedback:** Use `showFeedback(message, type)` with 'correct' or 'incorrect' types.
