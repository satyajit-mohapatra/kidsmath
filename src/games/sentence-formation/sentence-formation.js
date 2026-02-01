class SentenceFormationGame extends BaseGame {
    constructor() {
        super('sentenceFormation');
        this.currentQuarter = 1;
        this.currentGroup = 1;
        this.selectedWords = [];
        this.currentSentence = null;
        this.init();
    }

    init() {
        console.log('SentenceFormationGame initializing...');
        this.setupEventListeners();
        this.generateProblem();
        console.log('SentenceFormationGame initialized successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        this.setupQuarterButtons();
        this.setupGroupButtons();
        
        const clearBtn = document.getElementById('clearBtn');
        const submitBtn = document.getElementById('submitBtn');
        const hintBtn = document.getElementById('hintBtn');
        const readBtn = document.getElementById('readBtn');
        const mascot = document.getElementById('mascot');
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSentence());
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.checkAnswer());
        }
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
        
        if (readBtn) {
            readBtn.addEventListener('click', () => this.readSentence());
        }
        
        if (mascot) {
            mascot.addEventListener('click', () => this.mascotClick());
        }
        
        console.log('Event listeners setup complete');
    }

    setupQuarterButtons() {
        const quarterButtons = document.querySelectorAll('.quarter-btn');
        quarterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.quarter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentQuarter = parseInt(e.target.dataset.quarter);
                this.currentGroup = 1;
                document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.group-btn[data-group="1"]').classList.add('active');
                this.generateProblem();
            });
        });
    }

    setupGroupButtons() {
        const groupButtons = document.querySelectorAll('.group-btn');
        groupButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentGroup = parseInt(e.target.dataset.group);
                this.generateProblem();
            });
        });
    }

    getGroups() {
        return {
            1: {
                1: {
                    words: ['I', 'see', 'the', 'dog', 'cat'],
                    sentences: [
                        { words: ['I', 'see', 'the', 'dog'], display: 'I see the dog.' },
                        { words: ['I', 'see', 'the', 'cat'], display: 'I see the cat.' },
                        { words: ['the', 'dog', 'and', 'cat'], display: 'The dog and cat.' }
                    ]
                },
                2: {
                    words: ['I', 'like', 'to', 'play', 'run', 'eat'],
                    sentences: [
                        { words: ['I', 'like', 'to', 'play'], display: 'I like to play.' },
                        { words: ['I', 'like', 'to', 'run'], display: 'I like to run.' },
                        { words: ['I', 'like', 'to', 'eat'], display: 'I like to eat.' }
                    ]
                },
                3: {
                    words: ['we', 'run', 'fast', 'go', 'play'],
                    sentences: [
                        { words: ['we', 'run', 'fast'], display: 'We run fast.' },
                        { words: ['we', 'go', 'play'], display: 'We go play.' },
                        { words: ['we', 'play', 'fast'], display: 'We play fast.' }
                    ]
                }
            },
            2: {
                1: {
                    words: ['he', 'plays', 'with', 'the', 'ball', 'toy'],
                    sentences: [
                        { words: ['he', 'plays', 'with', 'the', 'ball'], display: 'He plays with the ball.' },
                        { words: ['he', 'plays', 'with', 'the', 'toy'], display: 'He plays with the toy.' },
                        { words: ['he', 'plays'], display: 'He plays.' }
                    ]
                },
                2: {
                    words: ['my', 'family', 'is', 'happy', 'big', 'good'],
                    sentences: [
                        { words: ['my', 'family', 'is', 'happy'], display: 'My family is happy.' },
                        { words: ['my', 'family', 'is', 'big'], display: 'My family is big.' },
                        { words: ['my', 'family', 'is', 'good'], display: 'My family is good.' }
                    ]
                },
                3: {
                    words: ['you', 'are', 'very', 'good', 'big', 'my'],
                    sentences: [
                        { words: ['you', 'are', 'very', 'good'], display: 'You are very good.' },
                        { words: ['you', 'are', 'my', 'friend'], display: 'You are my friend.' },
                        { words: ['you', 'are', 'very', 'big'], display: 'You are very big.' }
                    ]
                }
            },
            3: {
                1: {
                    words: ['the', 'girl', 'jumps', 'high', 'runs', 'fast'],
                    sentences: [
                        { words: ['the', 'girl', 'jumps', 'high'], display: 'The girl jumps high.' },
                        { words: ['the', 'girl', 'runs', 'fast'], display: 'The girl runs fast.' },
                        { words: ['she', 'jumps', 'high'], display: 'She jumps high.' }
                    ]
                },
                2: {
                    words: ['look', 'at', 'me', 'the', 'sun', 'dog'],
                    sentences: [
                        { words: ['look', 'at', 'me'], display: 'Look at me.' },
                        { words: ['look', 'at', 'the', 'sun'], display: 'Look at the sun.' },
                        { words: ['look', 'at', 'the', 'dog'], display: 'Look at the dog.' }
                    ]
                },
                3: {
                    words: ['we', 'have', 'two', 'dogs', 'cats', 'toys'],
                    sentences: [
                        { words: ['we', 'have', 'two', 'dogs'], display: 'We have two dogs.' },
                        { words: ['we', 'have', 'two', 'cats'], display: 'We have two cats.' },
                        { words: ['we', 'have', 'toys'], display: 'We have toys.' }
                    ]
                }
            },
            4: {
                1: {
                    words: ['my', 'dog', 'and', 'cat', 'play', 'together', 'run'],
                    sentences: [
                        { words: ['my', 'dog', 'and', 'cat', 'play'], display: 'My dog and cat play.' },
                        { words: ['my', 'dog', 'and', 'cat', 'run'], display: 'My dog and cat run.' },
                        { words: ['they', 'play', 'together'], display: 'They play together.' }
                    ]
                },
                2: {
                    words: ['what', 'does', 'the', 'dog', 'want', 'cat', 'eat'],
                    sentences: [
                        { words: ['what', 'does', 'the', 'dog', 'want'], display: 'What does the dog want?' },
                        { words: ['what', 'does', 'the', 'cat', 'want'], display: 'What does the cat want?' },
                        { words: ['what', 'does', 'the', 'dog', 'eat'], display: 'What does the dog eat?' }
                    ]
                },
                3: {
                    words: ['put', 'the', 'ball', 'over', 'there', 'toy'],
                    sentences: [
                        { words: ['put', 'the', 'ball', 'over', 'there'], display: 'Put the ball over there.' },
                        { words: ['put', 'the', 'toy', 'over', 'there'], display: 'Put the toy over there.' },
                        { words: ['put', 'the', 'ball', 'there'], display: 'Put the ball there.' }
                    ]
                }
            }
        };
    }

    generateProblem() {
        console.log(`Generating problem for quarter ${this.currentQuarter}, group ${this.currentGroup}`);
        
        this.usedHint = false;
        this.hintLevel = 0;
        this.selectedWords = [];
        
        const hintContent = document.getElementById('hintContent');
        const feedbackArea = document.getElementById('feedbackArea');
        const builtSentence = document.getElementById('builtSentence');
        const hintCounter = document.getElementById('hintCounter');
        const sentenceBlanks = document.getElementById('sentenceBlanks');
        
        if (hintContent) {
            hintContent.textContent = '';
            hintContent.classList.remove('show-sentence');
        }
        if (feedbackArea) feedbackArea.innerHTML = '';
        if (builtSentence) {
            builtSentence.innerHTML = '';
            builtSentence.classList.add('hidden');
        }
        if (sentenceBlanks) sentenceBlanks.innerHTML = '';
        if (hintCounter) hintCounter.textContent = '0/3';
        
        const group = this.getGroups()[this.currentQuarter][this.currentGroup];
        const sentences = group.sentences;
        this.currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
        
        console.log(`Selected sentence: ${this.currentSentence.display}`);
        
        this.displayProblem();
    }

    displayProblem() {
        this.renderSentenceBlanks();
        this.renderWordBank();
    }

    renderSentenceBlanks() {
        const blanksContainer = document.getElementById('sentenceBlanks');
        if (!blanksContainer) {
            console.error('Sentence blanks container not found');
            return;
        }
        
        blanksContainer.innerHTML = '';
        
        // Find the maximum word count among all sentences in this group
        const group = this.getGroups()[this.currentQuarter][this.currentGroup];
        const maxWordCount = Math.max(...group.sentences.map(s => s.words.length));
        
        console.log(`Rendering ${maxWordCount} blanks (max for this group)`);
        
        for (let i = 0; i < maxWordCount; i++) {
            const blank = document.createElement('div');
            blank.className = 'word-blank';
            blanksContainer.appendChild(blank);
        }
    }

    renderWordBank() {
        const wordBank = document.getElementById('wordBank');
        if (!wordBank) {
            console.error('Word bank element not found');
            return;
        }
        
        wordBank.innerHTML = '';
        
        const group = this.getGroups()[this.currentQuarter][this.currentGroup];
        const words = group.words;
        console.log(`Rendering word bank with ${words.length} words`);
        
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);
        
        shuffledWords.forEach(word => {
            const btn = document.createElement('button');
            btn.className = 'simple-word-btn';
            btn.textContent = word;
            btn.dataset.word = word;
            
            if (this.selectedWords.includes(word)) {
                btn.classList.add('selected');
            }
            
            btn.addEventListener('click', () => {
                this.toggleWord(word, btn);
            });
            
            wordBank.appendChild(btn);
        });
    }

    toggleWord(word, btn) {
        console.log(`Toggling word: ${word}`);
        
        if (this.selectedWords.includes(word)) {
            // Remove word
            const index = this.selectedWords.indexOf(word);
            this.selectedWords.splice(index, 1);
            btn.classList.remove('selected');
        } else {
            // Add word
            this.playClickSound();
            this.selectedWords.push(word);
            btn.classList.add('selected');
        }
        
        this.updateBlanks();
        console.log(`Selected words: ${this.selectedWords.join(' ')}`);
    }

    updateBlanks() {
        const blanksContainer = document.getElementById('sentenceBlanks');
        if (!blanksContainer) {
            console.error('Sentence blanks container not found');
            return;
        }
        
        const blanks = blanksContainer.querySelectorAll('.word-blank');
        
        blanks.forEach((blank, index) => {
            if (index < this.selectedWords.length) {
                blank.textContent = this.selectedWords[index];
                blank.style.border = '3px solid #4caf50';
                blank.style.background = '#e8f5e9';
                blank.style.fontWeight = 'bold';
                blank.style.fontSize = '1.4rem';
                blank.style.color = '#2d3436';
                blank.style.display = 'flex';
                blank.style.alignItems = 'center';
                blank.style.justifyContent = 'center';
            } else {
                blank.textContent = '';
                blank.style.border = '3px dashed #bdbdbd';
                blank.style.background = 'white';
                blank.style.fontWeight = 'normal';
                blank.style.fontSize = '1rem';
                blank.style.color = 'inherit';
            }
        });
    }

    clearSentence() {
        console.log('Clearing sentence');
        this.playClickSound();
        this.selectedWords = [];
        
        const builtSentence = document.getElementById('builtSentence');
        const sentenceBlanks = document.getElementById('sentenceBlanks');
        
        if (builtSentence) {
            builtSentence.innerHTML = '';
            builtSentence.classList.add('hidden');
        }
        
        if (sentenceBlanks) {
            sentenceBlanks.innerHTML = '';
        }
        
        const hintContent = document.getElementById('hintContent');
        if (hintContent) {
            hintContent.innerHTML = '';
            hintContent.classList.remove('show-sentence');
        }
        
        document.querySelectorAll('.simple-word-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.renderSentenceBlanks();
        
        console.log('Sentence cleared');
    }

    checkAnswer() {
        console.log('checkAnswer called');
        console.log(`Selected words: ${this.selectedWords.join(' ')}`);
        
        if (this.selectedWords.length === 0) {
            this.showFeedback('Pick some words first! 📝', 'incorrect');
            return;
        }
        
        const userSentence = this.selectedWords.join(' ').toLowerCase();
        
        // Get all valid sentences for this group
        const group = this.getGroups()[this.currentQuarter][this.currentGroup];
        const validSentences = group.sentences.map(s => s.words.join(' ').toLowerCase());
        
        console.log('Valid sentences:', validSentences);
        console.log('User sentence:', userSentence);
        
        this.displayBuiltSentence();
        
        // Check if user's sentence matches any valid sentence
        if (validSentences.includes(userSentence)) {
            console.log('Answer correct!');
            // Find the matching sentence to display
            const matchingSentence = group.sentences.find(s => 
                s.words.join(' ').toLowerCase() === userSentence
            );
            this.currentSentence = matchingSentence;
            this.handleCorrectAnswer();
        } else {
            console.log('Answer incorrect');
            this.handleIncorrectAnswer();
        }
    }

    displayBuiltSentence() {
        const builtSentence = document.getElementById('builtSentence');
        if (!builtSentence) {
            console.error('Built sentence element not found');
            return;
        }
        
        builtSentence.classList.remove('hidden');
        builtSentence.innerHTML = '';
        
        this.selectedWords.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'selected-word';
            wordElement.textContent = word;
            wordElement.dataset.word = word;
            wordElement.addEventListener('click', () => {
                this.removeWord(word, wordElement);
            });
            builtSentence.appendChild(wordElement);
        });
        
        console.log('Displayed built sentence');
    }

    removeWord(word, element) {
        this.playClickSound();
        this.selectedWords = this.selectedWords.filter(w => w !== word);
        element.remove();
        
        const btn = document.querySelector(`.simple-word-btn[data-word="${word}"]`);
        if (btn) {
            btn.classList.remove('selected');
        }
    }

    handleCorrectAnswer() {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus;
        
        this.updateDailyStats(bonus);
        this.updateStats();
        this.saveStats();
        this.checkAchievements();
        this.checkDailyChallenges();
        
        this.showFeedback(`🎉 Great job! "${this.currentSentence.display}" 🎉`, 'correct');
        this.playSuccessSound();
        
        if (this.streak % 5 === 0) {
            this.showCelebration();
        }
        
        setTimeout(() => {
            this.generateProblem();
        }, 2500);
    }

    handleIncorrectAnswer() {
        this.streak = 0;
        this.trackIncorrectAnswer();
        this.updateStats();
        this.saveStats();
        
        this.showFeedback('Not quite right! Try again! 💪', 'incorrect');
        this.playErrorSound();
        
        setTimeout(() => {
            const builtSentence = document.getElementById('builtSentence');
            if (builtSentence) {
                builtSentence.classList.add('hidden');
            }
        }, 2000);
    }

    showHint() {
        this.hintLevel++;
        this.playTone(700, 0.15);
        
        if (this.hintLevel > 3) {
            this.hintLevel = 3;
        }
        
        document.getElementById('hintCounter').textContent = `${this.hintLevel}/3`;
        
        const mascot = document.getElementById('mascot');
        mascot.classList.add('talking');
        setTimeout(() => mascot.classList.remove('talking'), 500);
        
        const hintContent = document.getElementById('hintContent');
        hintContent.classList.remove('show-sentence');
        
        const words = this.currentSentence.words;
        let hintHTML = '';
        
        if (this.hintLevel === 1) {
            hintHTML = `<strong>👀 Look at the sentence:</strong><br>"${this.currentSentence.display}"`;
        } else if (this.hintLevel === 2) {
            hintHTML = `<strong>📝 Count the words:</strong> ${words.length} words<br>First word: <strong>"${words[0]}"</strong>`;
        } else {
            hintContent.classList.add('show-sentence');
            const wordListHTML = words.map(w => `<span class="word-item">${w}</span>`).join('');
            hintHTML = `<strong>💡 Here are the words:</strong><div class="word-list">${wordListHTML}</div>`;
        }
        
        hintContent.innerHTML = hintHTML;
        
        if (this.hintLevel === 1) {
            this.usedHint = true;
        }
        
        this.showFeedback(this.getRandomEncouragement(), 'correct');
    }

    readSentence() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentSentence.display);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            window.speechSynthesis.speak(utterance);
        } else {
            this.showFeedback('Sorry, your browser doesn\'t support text-to-speech! 🔊', 'incorrect');
        }
    }

    mascotClick() {
        const mascot = document.getElementById('mascot');
        const messages = [
            '🦊 Hi there! Ready to build sentences?',
            '🦊 You can do it!',
            '🦊 Great job!',
            '🦊 Keep trying!',
            '🦊 I believe in you!'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('hintContent').textContent = message;
        
        mascot.style.transform = 'scale(1.3) rotate(360deg)';
        mascot.style.transition = 'transform 0.5s ease';
        this.playTone(900, 0.1);
        this.playTone(1100, 0.1);
        
        setTimeout(() => {
            mascot.style.transform = 'scale(1) rotate(0deg)';
        }, 500);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('simple-word-btn')) {
                return;
            }
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    const hintBtn = document.getElementById('hintBtn');
                    if (hintBtn && !hintBtn.disabled) {
                        hintBtn.click();
                    }
                    break;
                case 'Enter':
                    this.checkAnswer();
                    break;
                case 'Escape':
                    this.clearSentence();
                    break;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SentenceFormationGame();
});
