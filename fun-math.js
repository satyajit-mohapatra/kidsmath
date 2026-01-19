class FunMathGame extends BaseGame {
    constructor() {
        super('funMath');
        this.currentActivity = 'matching';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateActivity();
    }

    setupEventListeners() {
        document.querySelectorAll('.activity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentActivity = e.target.dataset.activity;
                this.generateActivity();
            });
        });

        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('mascot').addEventListener('click', () => this.mascotClick());
    }

    generateActivity() {
        this.usedHint = false;
        this.hintLevel = 0;
        document.getElementById('hintContent').textContent = '';
        document.getElementById('feedbackArea').innerHTML = '';

        switch(this.currentActivity) {
            case 'matching':
                this.generateMatching();
                break;
            case 'comparing':
                this.generateComparing();
                break;
            case 'patterns':
                this.generatePatterns();
                break;
            case 'skip-count':
                this.generateSkipCounting();
                break;
        }
    }

    generateMatching() {
        const targetNum = this.randomNumber(1, 8);
        const cards = [];
        
        cards.push({ type: 'number', value: targetNum });
        cards.push({ type: 'objects', value: targetNum });
        
        const distractors = new Set();
        while(distractors.size < 3) {
            const num = this.randomNumber(1, 8);
            if (num !== targetNum) distractors.add(num);
        }
        
        distractors.forEach(num => {
            cards.push({ type: 'number', value: num });
        });
        
        const shuffled = [...cards].sort(() => Math.random() - 0.5);

        this.currentProblem = {
            type: 'matching',
            target: targetNum,
            cards: shuffled,
            selected: [],
            matchedPairs: 0
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="matching-game">
                <h2 class="pattern-title">🔢 Match the number ${targetNum} with ${targetNum} objects!</h2>
                <div class="matching-numbers" id="matchingNumbers"></div>
            </div>
        `;

        const container = document.getElementById('matchingNumbers');

        shuffled.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'matching-card';
            cardEl.dataset.value = card.value;
            cardEl.dataset.type = card.type;
            cardEl.dataset.index = index;
            cardEl.innerHTML = `
                <div class="matching-number">${card.type === 'number' ? card.value : '?'}</div>
                <div class="matching-objects">${card.type === 'objects' ? this.createObjectDisplay(card.value, 25) : ''}</div>
            `;
            cardEl.addEventListener('click', () => this.selectMatchingCard(cardEl, card, index));
            container.appendChild(cardEl);
        });
    }

    selectMatchingCard(card, cardData, index) {
        if (card.classList.contains('matched')) return;
        if (this.currentProblem.selected.length >= 2) return;

        card.classList.add('selected');
        this.currentProblem.selected.push({ card, cardData, index });

        if (this.currentProblem.selected.length === 2) {
            setTimeout(() => this.checkMatchingAnswer(), 500);
        }
    }

    checkMatchingAnswer() {
        const selected = this.currentProblem.selected;
        const card1 = selected[0];
        const card2 = selected[1];

        card1.card.classList.remove('selected');
        card2.card.classList.remove('selected');

        if (card1.cardData.value === card2.cardData.value && 
            card1.cardData.type !== card2.cardData.type) {
            card1.card.classList.add('matched');
            card2.card.classList.add('matched');
            this.playClickSound();
            this.currentProblem.matchedPairs++;
            this.currentProblem.selected = [];

            if (this.currentProblem.matchedPairs >= 1) {
                this.handleCorrectAnswer();
                setTimeout(() => this.generateActivity(), 2000);
            }
        } else {
            card1.card.classList.add('wrong-match');
            card2.card.classList.add('wrong-match');
            this.handleIncorrectAnswer('wrong pair');
            
            setTimeout(() => {
                card1.card.classList.remove('wrong-match');
                card2.card.classList.remove('wrong-match');
                this.currentProblem.selected = [];
            }, 1000);
        }
    }

    generateComparing() {
        const num1 = this.randomNumber(1, 20);
        const num2 = this.randomNumber(1, 20);

        this.currentProblem = {
            type: 'comparing',
            num1,
            num2,
            answer: num1 > num2 ? '>' : (num1 < num2 ? '<' : '=')
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="comparing-game">
                <h2 class="pattern-title">🔍 Which symbol goes in the middle?</h2>
                <div class="comparing-hint">💡 Count the objects to see which number is bigger!</div>
                <div class="comparing-numbers">
                    <div class="comparing-number-card">
                        <div class="comparing-number">${num1}</div>
                        <div class="comparing-objects">${this.createObjectDisplay(num1, 30)}</div>
                    </div>
                    <div class="comparing-operator">?</div>
                    <div class="comparing-number-card">
                        <div class="comparing-number">${num2}</div>
                        <div class="comparing-objects">${this.createObjectDisplay(num2, 30)}</div>
                    </div>
                </div>
                <div class="comparing-buttons">
                    <button class="compare-btn" data-op="<"><</button>
                    <button class="compare-btn" data-op="=">=</button>
                    <button class="compare-btn" data-op=">">></button>
                </div>
            </div>
        `;

        document.querySelectorAll('.compare-btn').forEach(btn => {
            btn.addEventListener('click', () => this.checkComparingAnswer(btn.dataset.op));
        });
    }

    checkComparingAnswer(userAnswer) {
        const operator = document.querySelector('.comparing-operator');
        const buttons = document.querySelectorAll('.compare-btn');

        if (userAnswer === this.currentProblem.answer) {
            operator.textContent = userAnswer;
            operator.style.animation = 'none';
            operator.style.background = '#55efc4';
            operator.style.borderRadius = '50%';
            operator.style.width = '100px';
            operator.style.height = '100px';
            operator.style.display = 'flex';
            operator.style.justifyContent = 'center';
            operator.style.alignItems = 'center';
            setTimeout(() => {
                operator.style.animation = 'pulse 2s infinite';
            }, 10);

            this.handleCorrectAnswer();
            setTimeout(() => this.generateActivity(), 2000);
        } else {
            const wrongBtn = document.querySelector(`.compare-btn[data-op="${userAnswer}"]`);
            wrongBtn.style.background = '#ff7675';
            setTimeout(() => {
                wrongBtn.style.background = '';
            }, 1000);

            this.handleIncorrectAnswer(userAnswer);
        }
    }

    generatePatterns() {
        const patternType = this.randomNumber(1, 3);
        let sequence = [];
        let answer = 0;
        let patternDescription = '';

        switch(patternType) {
            case 1:
                const add = this.randomNumber(1, 3);
                const start = this.randomNumber(1, 5);
                for (let i = 0; i < 3; i++) {
                    sequence.push(start + i * add);
                }
                answer = start + 3 * add;
                patternDescription = `Add ${add} each time!`;
                break;
            case 2:
                const multiply = this.randomNumber(2, 3);
                const base = this.randomNumber(1, 3);
                for (let i = 0; i < 3; i++) {
                    sequence.push(base * Math.pow(multiply, i));
                }
                answer = base * Math.pow(multiply, 3);
                patternDescription = `Multiply by ${multiply} each time!`;
                break;
            case 3:
                const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣'];
                const shapeSequence = shapes.slice(0, 3);
                sequence = shapeSequence;
                answer = shapeSequence[0];
                patternDescription = `The pattern repeats!`;
                break;
        }

        const options = [answer, this.randomNumber(1, 10), this.randomNumber(1, 10), this.randomNumber(1, 10)];
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

        this.currentProblem = {
            type: 'patterns',
            sequence,
            answer,
            patternType,
            patternDescription
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="pattern-game">
                <h2 class="pattern-title">🔮 What comes next?</h2>
                <div class="pattern-hint">💡 ${patternDescription}</div>
                <div class="pattern-sequence">
                    ${sequence.map(item => `<div class="pattern-item">${item}</div>`).join('')}
                    <div class="pattern-item question">?</div>
                </div>
                <div class="pattern-options" id="patternOptions"></div>
            </div>
        `;

        const container = document.getElementById('patternOptions');
        shuffledOptions.forEach(opt => {
            const option = document.createElement('div');
            option.className = 'pattern-option';
            option.textContent = opt;
            option.addEventListener('click', () => this.checkPatternAnswer(opt, option));
            container.appendChild(option);
        });
    }

    checkPatternAnswer(userAnswer, optionElement) {
        if (userAnswer === this.currentProblem.answer) {
            document.querySelector('.pattern-item.question').textContent = userAnswer;
            document.querySelector('.pattern-item.question').style.background = '#55efc4';
            document.querySelector('.pattern-item.question').style.borderColor = '#00b894';
            document.querySelector('.pattern-item.question').style.borderStyle = 'solid';

            this.handleCorrectAnswer();
            setTimeout(() => this.generateActivity(), 2000);
        } else {
            optionElement.style.background = '#ff7675';
            optionElement.style.borderColor = '#d63031';
            setTimeout(() => {
                optionElement.style.background = 'white';
                optionElement.style.borderColor = '#0984e3';
            }, 1000);

            this.handleIncorrectAnswer(userAnswer);
        }
    }

    generateSkipCounting() {
        const skip = this.randomNumber(2, 5);
        const start = skip;
        const end = skip * 5;

        this.currentProblem = {
            type: 'skip-count',
            skip,
            start,
            end,
            currentIndex: 0,
            nextNumber: start,
            correctNumbers: []
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="skip-counting-game">
                <h2 class="skip-counting-info">🐰 Count by ${skip}s! Start at ${start} and click the numbers in order!</h2>
                <div class="skip-counting-progress" id="skipCountingProgress">Next: ${start}</div>
                <div class="skip-counting-path" id="skipCountingPath"></div>
            </div>
        `;

        const container = document.getElementById('skipCountingPath');
        const numbers = [];
        for (let i = start; i <= end; i += skip) {
            numbers.push(i);
        }

        const shuffled = [...numbers].sort(() => Math.random() - 0.5);

        shuffled.forEach(num => {
            const numElement = document.createElement('div');
            numElement.className = 'skip-counting-number';
            numElement.textContent = num;
            numElement.dataset.number = num;
            numElement.addEventListener('click', () => this.checkSkipCountingAnswer(num, numElement));
            container.appendChild(numElement);
        });
    }

    checkSkipCountingAnswer(userAnswer, element) {
        if (parseInt(element.dataset.number) === this.currentProblem.nextNumber) {
            element.classList.add('correct');
            element.style.pointerEvents = 'none';
            this.playClickSound();
            this.currentProblem.correctNumbers.push(userAnswer);
            this.currentProblem.nextNumber += this.currentProblem.skip;
            this.currentProblem.currentIndex++;

            const progressEl = document.getElementById('skipCountingProgress');
            if (progressEl) {
                progressEl.textContent = this.currentProblem.correctNumbers.join(' → ') + (this.currentProblem.nextNumber <= this.currentProblem.end ? ` → ${this.currentProblem.nextNumber}` : ' ✓');
            }

            const total = this.currentProblem.end / this.currentProblem.skip;

            if (this.currentProblem.currentIndex >= total) {
                this.handleCorrectAnswer();
                setTimeout(() => this.generateActivity(), 2000);
            }
        } else {
            element.classList.add('missed');
            this.handleIncorrectAnswer(userAnswer);
        }
    }

    createObjectDisplay(count, size) {
        let html = '';
        const emojis = ['🌟', '🎈', '🎯', '🎨', '🎭'];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];

        for (let i = 0; i < count; i++) {
            html += `<div class="matching-object" style="background: ${colors[i % colors.length]}; width: ${size}px; height: ${size}px; font-size: ${size * 0.4}px;">${emojis[i % emojis.length]}</div>`;
        }

        return html;
    }

    showHint() {
        this.hintLevel++;
        this.playTone(700, 0.15);

        const maxHints = 3;

        if (this.hintLevel > maxHints) {
            this.hintLevel = maxHints;
        }

        document.getElementById('hintCounter').textContent = `${this.hintLevel}/${maxHints}`;

        const mascot = document.getElementById('mascot');
        mascot.classList.add('talking');
        setTimeout(() => mascot.classList.remove('talking'), 500);

        let hintMessage = '';

        switch(this.currentProblem.type) {
            case 'matching':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Look at the objects! Count them!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🌟 ${this.currentProblem.target} objects should match number ${this.currentProblem.target}!`;
                } else {
                    hintMessage = `💡 Look for the number ${this.currentProblem.target}!`;
                }
                break;
            case 'comparing':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Count the objects on each side!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🌟 ${this.currentProblem.num1} vs ${this.currentProblem.num2} - which is bigger?`;
                } else {
                    hintMessage = `💡 ${this.currentProblem.num1} ${this.currentProblem.num1 > this.currentProblem.num2 ? '>' : '<'} ${this.currentProblem.num2}!`;
                }
                break;
            case 'patterns':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Look for the pattern! Is it adding, multiplying, or shapes?`;
                } else if (this.hintLevel === 2) {
                    if (this.currentProblem.patternType === 3) {
                        hintMessage = `🌟 The pattern repeats shapes!`;
                    } else {
                        hintMessage = `🌟 What changes between each number?`;
                    }
                } else {
                    hintMessage = `💡 The answer is ${this.currentProblem.answer}!`;
                }
                break;
            case 'skip-count':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Start at ${this.currentProblem.skip}! Then add ${this.currentProblem.skip} each time!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🌟 ${this.currentProblem.start}, ${this.currentProblem.start + this.currentProblem.skip}, ${this.currentProblem.start + this.currentProblem.skip * 2}... next?`;
                } else {
                    hintMessage = `💡 Next is ${this.currentProblem.nextNumber}!`;
                }
                break;
        }

        document.getElementById('hintContent').innerHTML = hintMessage;
        document.getElementById('hintContent').style.animation = 'none';
        setTimeout(() => {
            document.getElementById('hintContent').style.animation = 'fadeIn 0.5s ease-out';
        }, 10);

        if (this.hintLevel === 1) {
            this.stars += 1;
            this.updateStats();
            this.saveStats();
        }

        this.showFeedback(this.getRandomEncouragement(), 'correct');
    }

    mascotClick() {
        const mascot = document.getElementById('mascot');
        const messages = [
            '🦄 Hi there! Ready to play?',
            '🦄 Fun math is the best math!',
            '🦄 You\'re doing amazing!',
            '🦄 Unicorn loves patterns! 🦄',
            '🦄 Keep up great work!',
            '🦄 Click me anytime! 🎉',
            '🦄 Believe in yourself!',
            '🦄 Math is magical!'
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

    handleCorrectAnswer() {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus;

        this.updateStats();
        this.saveStats();
        this.showFeedback(`Great job! ${this.getCelebrationEmoji()}`, 'correct');
        this.playSuccessSound();

        if (this.streak % 5 === 0) {
            this.showCelebration();
        }
    }

    handleIncorrectAnswer(userAnswer) {
        this.streak = 0;
        this.updateStats();
        this.saveStats();

        let message = `Oops! Try again! 💪`;

        if (this.currentProblem.type === 'comparing') {
            const num1 = this.currentProblem.num1;
            const num2 = this.currentProblem.num2;
            const correct = num1 > num2 ? '>' : (num1 < num2 ? '<' : '=');
            message = `Oops! The answer is ${correct} (${num1} ${correct} ${num2})`;
        } else if (this.currentProblem.type === 'patterns') {
            message = `Oops! The pattern answer is ${this.currentProblem.answer}`;
        } else if (this.currentProblem.type === 'skip-count') {
            message = `Oops! The next number is ${this.currentProblem.nextNumber}`;
        } else if (this.currentProblem.type === 'matching') {
            message = `Oops! Try matching the number ${this.currentProblem.target} with ${this.currentProblem.target} objects!`;
        }

        this.showFeedback(message, 'incorrect');
        this.playErrorSound();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FunMathGame();
});
