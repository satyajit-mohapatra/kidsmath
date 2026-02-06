class RhymingWordsGame extends BaseGame {
    constructor() {
        super('rhymingWords');
        this.currentLevel = 'easy';
        this.targetCount = 5;
        this.correctCount = 0;
        this.currentRhymeSet = null;
        this.selectedOption = null;
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
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipChallenge());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextChallenge());
        document.getElementById('mascot').addEventListener('click', () => this.mascotClick());
        document.getElementById('audioBtn').addEventListener('click', () => this.speakTargetWord());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '4') {
                const index = parseInt(e.key) - 1;
                const options = document.querySelectorAll('.option-btn');
                if (options[index]) {
                    options[index].click();
                }
            } else if (e.key === ' ') {
                e.preventDefault();
                this.showHint();
            } else if (e.key.toLowerCase() === 's') {
                this.skipChallenge();
            }
        });
    }

    getRhymingWords() {
        return {
            easy: [
                { target: { word: 'CAT', emoji: '🐱' }, rhymes: [
                    { word: 'BAT', emoji: '🦇', correct: true },
                    { word: 'DOG', emoji: '🐕', correct: false },
                    { word: 'HAT', emoji: '🎩', correct: true },
                    { word: 'RAT', emoji: '🐀', correct: true },
                    { word: 'MAT', emoji: '🧘', correct: true }
                ]},
                { target: { word: 'DOG', emoji: '🐕' }, rhymes: [
                    { word: 'LOG', emoji: '🪵', correct: true },
                    { word: 'FROG', emoji: '🐸', correct: true },
                    { word: 'CAT', emoji: '🐱', correct: false },
                    { word: 'HOG', emoji: '🐷', correct: true },
                    { word: 'FOG', emoji: '🌫️', correct: true }
                ]},
                { target: { word: 'SUN', emoji: '☀️' }, rhymes: [
                    { word: 'FUN', emoji: '🎉', correct: true },
                    { word: 'RUN', emoji: '🏃', correct: true },
                    { word: 'BUN', emoji: '🥯', correct: true },
                    { word: 'MOON', emoji: '🌙', correct: false },
                    { word: 'GUN', emoji: '🔫', correct: true }
                ]},
                { target: { word: 'HAT', emoji: '🎩' }, rhymes: [
                    { word: 'CAT', emoji: '🐱', correct: true },
                    { word: 'BAT', emoji: '🦇', correct: true },
                    { word: 'MAT', emoji: '🧘', correct: true },
                    { word: 'RAT', emoji: '🐀', correct: true },
                    { word: 'SHOE', emoji: '👟', correct: false }
                ]},
                { target: { word: 'BED', emoji: '🛏️' }, rhymes: [
                    { word: 'RED', emoji: '🔴', correct: true },
                    { word: 'HEAD', emoji: '👤', correct: true },
                    { word: 'SAID', emoji: '💬', correct: true },
                    { word: 'CHAIR', emoji: '🪑', correct: false },
                    { word: 'FED', emoji: '🍼', correct: true }
                ]},
                { target: { word: 'BALL', emoji: '⚽' }, rhymes: [
                    { word: 'CALL', emoji: '📞', correct: true },
                    { word: 'FALL', emoji: '🍂', correct: true },
                    { word: 'WALL', emoji: '🧱', correct: true },
                    { word: 'TALL', emoji: '📏', correct: true },
                    { word: 'DOLL', emoji: '🎎', correct: false }
                ]},
                { target: { word: 'TREE', emoji: '🌳' }, rhymes: [
                    { word: 'BEE', emoji: '🐝', correct: true },
                    { word: 'SEA', emoji: '🌊', correct: true },
                    { word: 'KEY', emoji: '🔑', correct: true },
                    { word: 'FLY', emoji: '🦋', correct: false },
                    { word: 'KNEE', emoji: '🦵', correct: true }
                ]},
                { target: { word: 'FISH', emoji: '🐟' }, rhymes: [
                    { word: 'DISH', emoji: '🍽️', correct: true },
                    { word: 'WISH', emoji: '⭐', correct: true },
                    { word: 'BIRD', emoji: '🐦', correct: false },
                    { word: 'SWISH', emoji: '👗', correct: true }
                ]},
                { target: { word: 'STAR', emoji: '⭐' }, rhymes: [
                    { word: 'CAR', emoji: '🚗', correct: true },
                    { word: 'FAR', emoji: '📍', correct: true },
                    { word: 'JAR', emoji: '🫙', correct: true },
                    { word: 'MOON', emoji: '🌙', correct: false },
                    { word: 'BAR', emoji: '🍫', correct: true }
                ]},
                { target: { word: 'BEE', emoji: '🐝' }, rhymes: [
                    { word: 'TREE', emoji: '🌳', correct: true },
                    { word: 'SEA', emoji: '🌊', correct: true },
                    { word: 'KEY', emoji: '🔑', correct: true },
                    { word: 'KNEE', emoji: '🦵', correct: true },
                    { word: 'FLY', emoji: '🦋', correct: false }
                ]}
            ],
            medium: [
                { target: { word: 'HOUSE', emoji: '🏠' }, rhymes: [
                    { word: 'MOUSE', emoji: '🐁', correct: true },
                    { word: 'CAR', emoji: '🚗', correct: false },
                    { word: 'BLOUSE', emoji: '👚', correct: true },
                    { word: 'GROUSE', emoji: '🐦', correct: true }
                ]},
                { target: { word: 'CHAIR', emoji: '🪑' }, rhymes: [
                    { word: 'HAIR', emoji: '💇', correct: true },
                    { word: 'BEAR', emoji: '🐻', correct: true },
                    { word: 'TABLE', emoji: '🪑', correct: false },
                    { word: 'STARE', emoji: '👀', correct: true },
                    { word: 'FLAIR', emoji: '✨', correct: true }
                ]},
                { target: { word: 'TRAIN', emoji: '🚂' }, rhymes: [
                    { word: 'RAIN', emoji: '🌧️', correct: true },
                    { word: 'PLAIN', emoji: '🌾', correct: true },
                    { word: 'CHAIN', emoji: '⛓️', correct: true },
                    { word: 'PAIN', emoji: '😣', correct: true },
                    { word: 'BUS', emoji: '🚌', correct: false }
                ]},
                { target: { word: 'PHONE', emoji: '📞' }, rhymes: [
                    { word: 'BONE', emoji: '🦴', correct: true },
                    { word: 'STONE', emoji: '🪨', correct: true },
                    { word: 'CONE', emoji: '🍦', correct: true },
                    { word: 'THRONE', emoji: '👑', correct: true },
                    { word: 'TABLET', emoji: '📱', correct: false }
                ]},
                { target: { word: 'NIGHT', emoji: '🌙' }, rhymes: [
                    { word: 'LIGHT', emoji: '💡', correct: true },
                    { word: 'FIGHT', emoji: '🥊', correct: true },
                    { word: 'SIGHT', emoji: '👁️', correct: true },
                    { word: 'KITE', emoji: '🪁', correct: false },
                    { word: 'RIGHT', emoji: '✅', correct: true }
                ]},
                { target: { word: 'SHIRT', emoji: '👕' }, rhymes: [
                    { word: 'DIRT', emoji: '🌱', correct: true },
                    { word: 'HURT', emoji: '🤕', correct: true },
                    { word: 'SKIRT', emoji: '👗', correct: true },
                    { word: 'PANTS', emoji: '👖', correct: false }
                ]},
                { target: { word: 'GREEN', emoji: '🟢' }, rhymes: [
                    { word: 'CLEAN', emoji: '🧼', correct: true },
                    { word: 'MEAN', emoji: '😠', correct: true },
                    { word: 'SEEN', emoji: '👀', correct: true },
                    { word: 'QUEEN', emoji: '👸', correct: true },
                    { word: 'BLUE', emoji: '🔵', correct: false }
                ]},
                { target: { word: 'SMILE', emoji: '😊' }, rhymes: [
                    { word: 'MILE', emoji: '🛣️', correct: true },
                    { word: 'PILE', emoji: '📚', correct: true },
                    { word: 'TILE', emoji: '🏠', correct: true },
                    { word: 'FROWN', emoji: '😞', correct: false },
                    { word: 'NILE', emoji: '🏛️', correct: true }
                ]},
                { target: { word: 'BRUSH', emoji: '🖌️' }, rhymes: [
                    { word: 'RUSH', emoji: '⚡', correct: true },
                    { word: 'HUSH', emoji: '🤫', correct: true },
                    { word: 'BLUSH', emoji: '😳', correct: true },
                    { word: 'CRUSH', emoji: '💔', correct: true },
                    { word: 'COMB', emoji: '🪮', correct: false }
                ]},
                { target: { word: 'SNAKE', emoji: '🐍' }, rhymes: [
                    { word: 'CAKE', emoji: '🎂', correct: true },
                    { word: 'LAKE', emoji: '🏞️', correct: true },
                    { word: 'FAKE', emoji: '🎭', correct: true },
                    { word: 'BAKE', emoji: '🥖', correct: true },
                    { word: 'WORM', emoji: '🪱', correct: false }
                ]}
            ],
            hard: [
                { target: { word: 'BUTTERFLY', emoji: '🦋' }, rhymes: [
                    { word: 'DRAGONFLY', emoji: '🦟', correct: true },
                    { word: 'FIREFLY', emoji: '✨', correct: true },
                    { word: 'BEE', emoji: '🐝', correct: false },
                    { word: 'BUTTERCUP', emoji: '🌼', correct: false }
                ]},
                { target: { word: 'ELEPHANT', emoji: '🐘' }, rhymes: [
                    { word: 'ANT', emoji: '🐜', correct: true },
                    { word: 'PLANT', emoji: '🌱', correct: true },
                    { word: 'CANT', emoji: '🚫', correct: true },
                    { word: 'TIGER', emoji: '🐅', correct: false },
                    { word: 'CHANT', emoji: '🎵', correct: true }
                ]},
                { target: { word: 'UMBRELLA', emoji: '☂️' }, rhymes: [
                    { word: 'CINDERELLA', emoji: '👸', correct: true },
                    { word: 'STELLA', emoji: '⭐', correct: true },
                    { word: 'FELLA', emoji: '👨', correct: true },
                    { word: 'RAINCOAT', emoji: '🧥', correct: false }
                ]},
                { target: { word: 'PIZZA', emoji: '🍕' }, rhymes: [
                    { word: 'EZRA', emoji: '👤', correct: true },
                    { word: 'PASTA', emoji: '🍝', correct: false },
                    { word: 'BREAD', emoji: '🍞', correct: false }
                ]},
                { target: { word: 'COMPUTER', emoji: '💻' }, rhymes: [
                    { word: 'COMMUTER', emoji: '🚌', correct: true },
                    { word: 'TUTOR', emoji: '👨‍🏫', correct: true },
                    { word: 'SUITOR', emoji: '💍', correct: true },
                    { word: 'PHONE', emoji: '📱', correct: false },
                    { word: 'SHOOTER', emoji: '🎯', correct: true }
                ]},
                { target: { word: 'DINOSAUR', emoji: '🦖' }, rhymes: [
                    { word: 'DRAW', emoji: '✏️', correct: true },
                    { word: 'PAW', emoji: '🐾', correct: true },
                    { word: 'CLAW', emoji: '🦅', correct: true },
                    { word: 'DRAGON', emoji: '🐉', correct: false },
                    { word: 'LAW', emoji: '⚖️', correct: true }
                ]},
                { target: { word: 'BALLOON', emoji: '🎈' }, rhymes: [
                    { word: 'MOON', emoji: '🌙', correct: true },
                    { word: 'SOON', emoji: '⏰', correct: true },
                    { word: 'SPOON', emoji: '🥄', correct: true },
                    { word: 'NOON', emoji: '☀️', correct: true },
                    { word: 'FLAG', emoji: '🚩', correct: false }
                ]},
                { target: { word: 'RAINBOW', emoji: '🌈' }, rhymes: [
                    { word: 'HELLO', emoji: '👋', correct: true },
                    { word: 'BELOW', emoji: '⬇️', correct: true },
                    { word: 'GLOW', emoji: '✨', correct: true },
                    { word: 'FLOW', emoji: '🌊', correct: true },
                    { word: 'CLOUD', emoji: '☁️', correct: false }
                ]},
                { target: { word: 'TOMATO', emoji: '🍅' }, rhymes: [
                    { word: 'POTATO', emoji: '🥔', correct: true },
                    { word: 'RATATOUILLE', emoji: '🍲', correct: true },
                    { word: 'CARROT', emoji: '🥕', correct: false },
                    { word: 'LEGATO', emoji: '🎵', correct: true }
                ]},
                { target: { word: 'CHOCOLATE', emoji: '🍫' }, rhymes: [
                    { word: 'LATE', emoji: '⏰', correct: true },
                    { word: 'GATE', emoji: '🚪', correct: true },
                    { word: 'WAIT', emoji: '⏳', correct: true },
                    { word: 'CANDY', emoji: '🍬', correct: false },
                    { word: 'FATE', emoji: '🔮', correct: true }
                ]}
            ]
        };
    }

    generateChallenge() {
        this.usedHint = false;
        this.correctCount = 0;
        this.selectedOption = null;
        
        document.getElementById('feedbackArea').innerHTML = '';
        document.getElementById('hintContent').textContent = '';
        document.getElementById('resultsDisplay').style.display = 'none';
        document.getElementById('challengeDisplay').style.display = 'block';
        
        // Reset progress
        this.updateProgress(0);
        
        // Get rhyme set based on level
        const rhymeSets = this.getRhymingWords();
        let availableSets = [];
        
        if (this.currentLevel === 'mixed') {
            availableSets = [...rhymeSets.easy, ...rhymeSets.medium, ...rhymeSets.hard];
        } else {
            availableSets = rhymeSets[this.currentLevel];
        }
        
        this.currentRhymeSet = availableSets[Math.floor(Math.random() * availableSets.length)];
        
        // Display target word
        document.getElementById('targetEmoji').textContent = this.currentRhymeSet.target.emoji;
        document.getElementById('targetText').textContent = this.currentRhymeSet.target.word;
        
        // Generate options
        this.generateOptions();
    }

    generateOptions() {
        const container = document.getElementById('optionsGrid');
        container.innerHTML = '';
        
        // Get 1 correct rhyme and 3 non-rhyming words
        const correctRhymes = this.currentRhymeSet.rhymes.filter(r => r.correct);
        const incorrectWords = this.currentRhymeSet.rhymes.filter(r => !r.correct);
        
        const correctWord = correctRhymes[Math.floor(Math.random() * correctRhymes.length)];
        
        // Get 3 incorrect options from the set or generate distractors
        let incorrectOptions = [];
        if (incorrectWords.length >= 3) {
            // Shuffle and take 3
            const shuffled = [...incorrectWords].sort(() => Math.random() - 0.5);
            incorrectOptions = shuffled.slice(0, 3);
        } else {
            // Use available incorrect words and add some distractors from other rhyme sets
            incorrectOptions = [...incorrectWords];
            const allRhymeSets = this.getRhymingWords();
            const allWords = [...allRhymeSets.easy, ...allRhymeSets.medium, ...allRhymeSets.hard];
            
            while (incorrectOptions.length < 3) {
                const randomSet = allWords[Math.floor(Math.random() * allWords.length)];
                const randomWord = randomSet.rhymes[Math.floor(Math.random() * randomSet.rhymes.length)];
                if (!randomWord.correct && !incorrectOptions.find(o => o.word === randomWord.word)) {
                    incorrectOptions.push(randomWord);
                }
            }
        }
        
        // Combine and shuffle options
        const options = [correctWord, ...incorrectOptions].sort(() => Math.random() - 0.5);
        this.correctAnswer = correctWord;
        
        // Create option buttons
        options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `
                <span class="option-number">${index + 1}</span>
                <span class="option-emoji">${option.emoji}</span>
                <span class="option-word">${option.word}</span>
            `;
            btn.addEventListener('click', () => this.checkAnswer(option, btn));
            container.appendChild(btn);
        });
    }

    checkAnswer(selectedOption, btnElement) {
        // Disable all buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        const isCorrect = selectedOption.word === this.correctAnswer.word;
        
        if (isCorrect) {
            btnElement.classList.add('correct');
            this.correctCount++;
            this.updateProgress(this.correctCount);
            
            if (this.correctCount >= this.targetCount) {
                this.handleCorrectRound();
            } else {
                this.showFeedback('🎉 Correct! That rhymes!', 'correct');
                this.playSuccessSound();
                
                // Show celebration of rhyme pair
                this.showRhymeCelebration();
                
                setTimeout(() => {
                    this.generateChallenge();
                }, 2000);
            }
        } else {
            btnElement.classList.add('incorrect');
            this.streak = 0;
            this.updateStats();
            
            // Highlight correct answer
            document.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.querySelector('.option-word').textContent === this.correctAnswer.word) {
                    btn.classList.add('correct');
                }
            });
            
            this.showFeedback(`❌ Not quite! The answer was ${this.correctAnswer.word}`, 'incorrect');
            this.playErrorSound();
            
            setTimeout(() => {
                this.generateChallenge();
            }, 2500);
        }
    }

    showRhymeCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'rhyme-mini-celebration';
        celebration.innerHTML = `
            <div class="rhyme-pair">
                <span>${this.currentRhymeSet.target.emoji} ${this.currentRhymeSet.target.word}</span>
                <span class="rhyme-arrow">🎵</span>
                <span>${this.correctAnswer.emoji} ${this.correctAnswer.word}</span>
            </div>
            <div class="rhyme-text">They rhyme! 🎵</div>
        `;
        
        document.getElementById('feedbackArea').appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 2000);
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
        
        this.showFeedback(`🎉 Amazing! You found ${this.targetCount} rhymes!`, 'correct');
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
        
        // Update celebration rhyme pair
        document.getElementById('celebrationWord1').textContent = 
            `${this.currentRhymeSet.target.emoji} ${this.currentRhymeSet.target.word}`;
        document.getElementById('celebrationWord2').textContent = 
            `${this.correctAnswer.emoji} ${this.correctAnswer.word}`;
        
        // Update stats
        document.getElementById('resultsStats').innerHTML = `
            <div class="result-stat">✅ Correct: ${this.correctCount}</div>
            <div class="result-stat">⭐ Stars Earned: ${this.usedHint ? 1 + this.correctCount : 2 + this.correctCount}</div>
            <div class="result-stat">🔥 Streak: ${this.streak}</div>
        `;
    }

    nextChallenge() {
        this.generateChallenge();
    }

    skipChallenge() {
        this.streak = 0;
        this.updateStats();
        this.showFeedback(`Skipped! The answer was ${this.correctAnswer.word} 🎯`, 'incorrect');
        setTimeout(() => {
            this.generateChallenge();
        }, 2000);
    }

    showHint() {
        this.usedHint = true;
        const hintMessages = [
            `💡 Listen to the ending sound of "${this.currentRhymeSet.target.word}"`,
            `💡 Words that rhyme with "${this.currentRhymeSet.target.word}" end with "${this.getEndingSound(this.currentRhymeSet.target.word)}"`,
            `💡 Say "${this.currentRhymeSet.target.word}" out loud and listen carefully!`,
            `💡 Look for words that sound similar at the end`
        ];
        
        const hint = hintMessages[Math.floor(Math.random() * hintMessages.length)];
        document.getElementById('hintContent').innerHTML = hint;
        this.mascotTalk();
    }

    getEndingSound(word) {
        // Simple heuristic to get ending sound
        if (word.length <= 3) return word.toLowerCase();
        return word.slice(-3).toLowerCase();
    }

    speakTargetWord() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentRhymeSet.target.word);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }
    }

    mascotClick() {
        const messages = [
            'Words that rhyme sound the same at the end! 🎵',
            'Listen carefully to the sounds! 👂',
            'You can do it! 🌟',
            'Rhyming is fun! 🎉',
            'Keep practicing! 📚'
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
    window.game = new RhymingWordsGame();
});