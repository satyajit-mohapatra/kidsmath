class WordScrambleGame extends BaseGame {
    constructor() {
        super('wordScramble');
        this.currentLevel = 'easy';
        this.targetCount = 5;
        this.correctCount = 0;
        this.currentWord = null;
        this.scrambledLetters = [];
        this.userAnswer = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateChallenge();
    }

    setupEventListeners() {
        // Level buttons
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLevel = e.target.dataset.level;
                this.generateChallenge();
            });
        });

        // Action buttons
        document.getElementById('checkBtn').addEventListener('click', () => this.checkAnswer());
        document.getElementById('shuffleBtn').addEventListener('click', () => this.shuffleLetters());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipChallenge());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextChallenge());
        document.getElementById('mascot').addEventListener('click', () => this.mascotClick());

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.checkAnswer();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.shuffleLetters();
            } else if (e.key.toLowerCase() === 'h') {
                this.showHint();
            } else if (e.key.toLowerCase() === 's') {
                this.skipChallenge();
            } else if (e.key === 'Backspace') {
                this.removeLastLetter();
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                this.handleKeyPress(e.key.toUpperCase());
            }
        });
    }

    getWordLists() {
        return {
            easy: [
                { word: 'CAT', emoji: '🐱', category: 'Animal' },
                { word: 'DOG', emoji: '🐕', category: 'Animal' },
                { word: 'SUN', emoji: '☀️', category: 'Nature' },
                { word: 'HAT', emoji: '🎩', category: 'Clothing' },
                { word: 'BED', emoji: '🛏️', category: 'Furniture' },
                { word: 'BALL', emoji: '⚽', category: 'Toy' },
                { word: 'TREE', emoji: '🌳', category: 'Nature' },
                { word: 'FISH', emoji: '🐟', category: 'Animal' },
                { word: 'STAR', emoji: '⭐', category: 'Space' },
                { word: 'BEE', emoji: '🐝', category: 'Insect' },
                { word: 'EGG', emoji: '🥚', category: 'Food' },
                { word: 'PEN', emoji: '🖊️', category: 'School' },
                { word: 'CUP', emoji: '☕', category: 'Kitchen' },
                { word: 'BUS', emoji: '🚌', category: 'Vehicle' },
                { word: 'CAR', emoji: '🚗', category: 'Vehicle' },
                { word: 'KEY', emoji: '🔑', category: 'Object' },
                { word: 'BAG', emoji: '👜', category: 'Accessory' },
                { word: 'TOY', emoji: '🧸', category: 'Toy' },
                { word: 'BOX', emoji: '📦', category: 'Object' },
                { word: 'COW', emoji: '🐄', category: 'Animal' }
            ],
            medium: [
                { word: 'HOUSE', emoji: '🏠', category: 'Place' },
                { word: 'WATER', emoji: '💧', category: 'Nature' },
                { word: 'PIZZA', emoji: '🍕', category: 'Food' },
                { word: 'MOUSE', emoji: '🐁', category: 'Animal' },
                { word: 'TRAIN', emoji: '🚂', category: 'Vehicle' },
                { word: 'PHONE', emoji: '📞', category: 'Technology' },
                { word: 'APPLE', emoji: '🍎', category: 'Fruit' },
                { word: 'BREAD', emoji: '🍞', category: 'Food' },
                { word: 'CHAIR', emoji: '🪑', category: 'Furniture' },
                { word: 'TABLE', emoji: '🪑', category: 'Furniture' },
                { word: 'CLOUD', emoji: '☁️', category: 'Nature' },
                { word: 'SMILE', emoji: '😊', category: 'Emotion' },
                { word: 'HEART', emoji: '❤️', category: 'Body' },
                { word: 'TIGER', emoji: '🐅', category: 'Animal' },
                { word: 'SNAKE', emoji: '🐍', category: 'Animal' },
                { word: 'GRAPE', emoji: '🍇', category: 'Fruit' },
                { word: 'LEMON', emoji: '🍋', category: 'Fruit' },
                { word: 'PEACH', emoji: '🍑', category: 'Fruit' },
                { word: 'MELON', emoji: '🍈', category: 'Fruit' },
                { word: 'ONION', emoji: '🧅', category: 'Vegetable' }
            ],
            hard: [
                { word: 'ELEPHANT', emoji: '🐘', category: 'Animal' },
                { word: 'BUTTERFLY', emoji: '🦋', category: 'Insect' },
                { word: 'UMBRELLA', emoji: '☂️', category: 'Object' },
                { word: 'COMPUTER', emoji: '💻', category: 'Technology' },
                { word: 'DINOSAUR', emoji: '🦖', category: 'Animal' },
                { word: 'BALLOON', emoji: '🎈', category: 'Toy' },
                { word: 'RAINBOW', emoji: '🌈', category: 'Nature' },
                { word: 'CHOCOLATE', emoji: '🍫', category: 'Food' },
                { word: 'GIRAFFE', emoji: '🦒', category: 'Animal' },
                { word: 'DOLPHIN', emoji: '🐬', category: 'Animal' },
                { word: 'OCTOPUS', emoji: '🐙', category: 'Animal' },
                { word: 'PENGUIN', emoji: '🐧', category: 'Animal' },
                { word: 'AIRPLANE', emoji: '✈️', category: 'Vehicle' },
                { word: 'TELEPHONE', emoji: '☎️', category: 'Technology' },
                { word: 'SANDWICH', emoji: '🥪', category: 'Food' },
                { word: 'PANCAKE', emoji: '🥞', category: 'Food' },
                { word: 'BROCCOLI', emoji: '🥦', category: 'Vegetable' },
                { word: 'STRAWBERRY', emoji: '🍓', category: 'Fruit' },
                { word: 'WATERMELON', emoji: '🍉', category: 'Fruit' },
                { word: 'PINEAPPLE', emoji: '🍍', category: 'Fruit' }
            ]
        };
    }

    generateChallenge() {
        this.usedHint = false;
        this.userAnswer = [];
        
        document.getElementById('feedbackArea').innerHTML = '';
        document.getElementById('hintContent').textContent = '';
        document.getElementById('resultsDisplay').style.display = 'none';
        document.getElementById('challengeDisplay').style.display = 'block';
        
        // Get word list based on level
        const wordLists = this.getWordLists();
        let availableWords = [];
        
        if (this.currentLevel === 'mixed') {
            availableWords = [...wordLists.easy, ...wordLists.medium, ...wordLists.hard];
        } else {
            availableWords = wordLists[this.currentLevel];
        }
        
        this.currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
        // Display hint image and category
        document.getElementById('hintImage').textContent = this.currentWord.emoji;
        document.getElementById('hintCategory').textContent = this.currentWord.category;
        
        // Scramble letters
        this.scrambleLettersArray();
        
        // Render the game
        this.renderLetters();
        this.renderAnswerSlots();
    }

    scrambleLettersArray() {
        const letters = this.currentWord.word.split('');
        // Shuffle until different from original
        do {
            this.scrambledLetters = [...letters].sort(() => Math.random() - 0.5);
        } while (this.scrambledLetters.join('') === this.currentWord.word);
    }

    shuffleLetters() {
        this.scrambleLettersArray();
        this.renderLetters();
        this.playTone(440, 100);
    }

    renderLetters() {
        const container = document.getElementById('bankLetters');
        container.innerHTML = '';
        
        this.scrambledLetters.forEach((letter, index) => {
            // Only show letters not in user answer
            const usedCount = this.userAnswer.filter(l => l === letter).length;
            const availableCount = this.scrambledLetters.filter(l => l === letter).length;
            
            if (usedCount < availableCount) {
                const letterTile = document.createElement('button');
                letterTile.className = 'letter-tile';
                letterTile.textContent = letter;
                letterTile.dataset.index = index;
                letterTile.addEventListener('click', () => this.addLetter(letter, index));
                container.appendChild(letterTile);
            }
        });
        
        // Update word display
        this.updateWordDisplay();
    }

    renderAnswerSlots() {
        const container = document.getElementById('answerSlots');
        container.innerHTML = '';
        
        for (let i = 0; i < this.currentWord.word.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'answer-slot';
            slot.dataset.index = i;
            
            if (this.userAnswer[i]) {
                slot.textContent = this.userAnswer[i];
                slot.classList.add('filled');
            }
            
            slot.addEventListener('click', () => this.removeLetterAtIndex(i));
            container.appendChild(slot);
        }
    }

    addLetter(letter, index) {
        if (this.userAnswer.length < this.currentWord.word.length) {
            this.userAnswer.push(letter);
            this.renderLetters();
            this.renderAnswerSlots();
            this.playTone(523, 100); // C5
        }
    }

    handleKeyPress(key) {
        // Check if key exists in scrambled letters and hasn't been used
        const availableLetters = this.scrambledLetters.filter(letter => {
            const usedCount = this.userAnswer.filter(l => l === letter).length;
            const totalCount = this.scrambledLetters.filter(l => l === letter).length;
            return usedCount < totalCount;
        });
        
        if (availableLetters.includes(key)) {
            this.addLetter(key, -1);
        }
    }

    removeLastLetter() {
        if (this.userAnswer.length > 0) {
            this.userAnswer.pop();
            this.renderLetters();
            this.renderAnswerSlots();
            this.playTone(262, 100); // C4
        }
    }

    removeLetterAtIndex(index) {
        if (this.userAnswer[index]) {
            this.userAnswer.splice(index, 1);
            this.renderLetters();
            this.renderAnswerSlots();
            this.playTone(262, 100); // C4
        }
    }

    updateWordDisplay() {
        const display = document.getElementById('wordDisplay');
        display.textContent = this.userAnswer.join('') || '_';
    }

    checkAnswer() {
        const userWord = this.userAnswer.join('');
        
        if (userWord.length !== this.currentWord.word.length) {
            this.showFeedback('Please fill in all letters! 📝', 'incorrect');
            this.playErrorSound();
            return;
        }
        
        if (userWord === this.currentWord.word) {
            this.correctCount++;
            this.updateProgress(this.correctCount);
            
            // Highlight correct
            document.querySelectorAll('.answer-slot').forEach(slot => {
                slot.classList.add('correct');
            });
            
            if (this.correctCount >= this.targetCount) {
                this.handleCorrectRound();
            } else {
                this.showFeedback(`🎉 Correct! It's ${this.currentWord.word}!`, 'correct');
                this.playSuccessSound();
                
                setTimeout(() => {
                    this.generateChallenge();
                }, 2000);
            }
        } else {
            this.streak = 0;
            this.updateStats();
            
            // Highlight incorrect
            document.querySelectorAll('.answer-slot').forEach(slot => {
                slot.classList.add('incorrect');
            });
            
            this.showFeedback(`❌ Try again! That's not quite right.`, 'incorrect');
            this.playErrorSound();
            
            setTimeout(() => {
                document.querySelectorAll('.answer-slot').forEach(slot => {
                    slot.classList.remove('incorrect');
                });
            }, 1500);
        }
    }

    updateProgress(correctCount) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const percentage = (correctCount / this.targetCount) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${correctCount} / ${this.targetCount} correct`;
    }

    handleCorrectRound() {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus + this.correctCount;
        
        this.updateStats();
        this.saveStats();
        
        this.showFeedback(`🎉 Amazing! You unscrambled ${this.targetCount} words!`, 'correct');
        this.playSuccessSound();
        
        if (this.streak % 5 === 0) {
            this.showCelebration();
        }
        
        // Show results
        setTimeout(() => {
            this.showResults();
        }, 1500);
    }

    showResults() {
        document.getElementById('challengeDisplay').style.display = 'none';
        const resultsDisplay = document.getElementById('resultsDisplay');
        resultsDisplay.style.display = 'block';
        
        // Update word reveal
        document.getElementById('revealEmoji').textContent = this.currentWord.emoji;
        document.getElementById('revealWord').textContent = this.currentWord.word;
        
        // Update stats
        document.getElementById('resultsStats').innerHTML = `
            <div class="result-stat">✅ Solved: ${this.correctCount}</div>
            <div class="result-stat">⭐ Stars Earned: ${this.usedHint ? 1 + this.correctCount : 2 + this.correctCount}</div>
            <div class="result-stat">🔥 Streak: ${this.streak}</div>
        `;
    }

    nextChallenge() {
        this.correctCount = 0;
        this.updateProgress(0);
        this.generateChallenge();
    }

    skipChallenge() {
        this.streak = 0;
        this.updateStats();
        this.showFeedback(`Skipped! The word was ${this.currentWord.word} 🎯`, 'incorrect');
        setTimeout(() => {
            this.generateChallenge();
        }, 2000);
    }

    showHint() {
        this.usedHint = true;
        const hintIndex = Math.floor(Math.random() * this.currentWord.word.length);
        const hintLetter = this.currentWord.word[hintIndex];
        
        // Add hint letter to answer
        if (!this.userAnswer[hintIndex]) {
            this.userAnswer[hintIndex] = hintLetter;
            this.renderLetters();
            this.renderAnswerSlots();
        }
        
        document.getElementById('hintContent').innerHTML = 
            `💡 Letter ${hintIndex + 1} is "${hintLetter}"`;
        this.mascotTalk();
    }

    mascotClick() {
        const messages = [
            'Unscramble the letters to make a word! 🧩',
            'Look at the picture for a clue! 🖼️',
            'You can do it! 🌟',
            'Try different combinations! 🔄',
            'Spelling is fun! 📚'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('hintContent').textContent = message;
        this.mascotTalk();
    }

    mascotTalk() {
        const mascot = document.getElementById('mascot');
        mascot.classList.add('talking');
        setTimeout(() => mascot.classList.remove('talking'), 500);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new WordScrambleGame();
});