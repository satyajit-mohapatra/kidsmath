class AdditionGame extends BaseGame {
    constructor() {
        super('addition');
        this.currentColumn = 'ones';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateProblem();
    }

    setupEventListeners() {
        this.setupLevelButtons();
        this.setupAnswerHandlers();

        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('tutorialBtn').addEventListener('click', () => this.startTutorial());
        document.getElementById('stepsBtn').addEventListener('click', () => this.showSteps());
        document.getElementById('closeTutorial').addEventListener('click', () => this.closeTutorial());
        document.getElementById('nextStep').addEventListener('click', () => this.nextTutorialStep());
        document.getElementById('prevStep').addEventListener('click', () => this.prevTutorialStep());
        document.getElementById('mascot').addEventListener('click', () => this.mascotClick());
    }

    generateProblem() {
        this.usedHint = false;
        this.hintLevel = 0;
        this.currentColumn = 'ones';
        document.getElementById('hintContent').textContent = '';
        document.getElementById('feedbackArea').innerHTML = '';
        document.getElementById('answerInput').value = '';
        document.getElementById('answerInput').focus();
        document.getElementById('visual1').innerHTML = '';
        document.getElementById('visual2').innerHTML = '';
        document.getElementById('carryRow').style.display = 'none';
        document.getElementById('compactExplanation').style.display = 'none';
        document.getElementById('stepsBtn').style.display = 'none';
        this.hideCarry();

        let num1, num2;

        switch(this.currentLevel) {
            case 1:
                num1 = this.randomNumber(1, 5);
                num2 = this.randomNumber(1, 5);
                break;
            case 2:
                num1 = this.randomNumber(1, 9);
                num2 = this.randomNumber(1, 9);
                break;
            case 3:
                num1 = this.randomNumber(10, 50);
                num2 = this.randomNumber(10, 50);
                const ones1 = num1 % 10;
                const ones2 = num2 % 10;
                if (ones1 + ones2 >= 10) {
                    num1 = num1 - ones1 + (10 - ones2);
                    if (num1 > 50) {
                        num1 = 50 - (10 - ones1);
                    }
                }
                break;
            case 4:
                num1 = this.randomNumber(10, 99);
                num2 = this.randomNumber(10, 99);
                const l4ones1 = num1 % 10;
                const l4ones2 = num2 % 10;
                const l4tens1 = Math.floor(num1 / 10);
                const l4tens2 = Math.floor(num2 / 10);
                const sumTens = l4tens1 + l4tens2;
                if (l4ones1 + l4ones2 >= 10) {
                    if (sumTens + 1 > 9) {
                        num1 = num1 - l4ones1 + (10 - l4ones2);
                        if (num1 < 10) num1 = 10 + l4ones1;
                    }
                }
                const needsCarry = Math.random() > 0.5;
                if (needsCarry) {
                    const targetOnesSum = this.randomNumber(1, 9);
                    num1 = Math.floor(Math.random() * 90) + 10;
                    num2 = targetOnesSum - (num1 % 10) + (Math.floor(Math.random() * 5) + 1) * 10;
                    if (num2 < 10) num2 = 10 + (num2 % 10);
                    if (num2 > 99) num2 = 99;
                }
                break;
        }

        this.currentProblem = {
            num1,
            num2,
            answer: num1 + num2
        };

        this.displayProblem();
        this.updateExplanation();
    }

    displayProblem() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;
        const isMultiDigit = num1 >= 10 || num2 >= 10;

        if (isMultiDigit) {
            this.displayMultiDigitProblem(num1, num2);
        } else {
            this.displaySingleDigitProblem(num1, num2);
        }
    }

    displaySingleDigitProblem(num1, num2) {
        document.getElementById('carryRow').style.display = 'none';

        const num1Display = document.getElementById('number1');
        const num2Display = document.getElementById('number2');

        num1Display.textContent = num1;
        num2Display.textContent = num2;
        num1Display.className = 'number-display';
        num2Display.className = 'number-display';

        const visual1 = document.getElementById('visual1');
        const visual2 = document.getElementById('visual2');
        visual1.innerHTML = '';
        visual2.innerHTML = '';

        this.displayVisualObjects('visual1', num1, 1);
        this.displayVisualObjects('visual2', num2, 2);
    }

    displayMultiDigitProblem(num1, num2) {
        this.currentColumn = 'ones';

        document.getElementById('carryRow').style.display = 'flex';

        const digits1 = String(num1).padStart(2, '0').split('').map(Number);
        const digits2 = String(num2).padStart(2, '0').split('').map(Number);

        this.currentProblem.digits1 = digits1;
        this.currentProblem.digits2 = digits2;
        this.currentProblem.ones1 = digits1[digits1.length - 1];
        this.currentProblem.ones2 = digits2[digits2.length - 1];
        this.currentProblem.tens1 = digits1[digits1.length - 2];
        this.currentProblem.tens2 = digits2[digits2.length - 2];

        const num1Display = document.getElementById('number1');
        const num2Display = document.getElementById('number2');

        num1Display.innerHTML = digits1.map((d, i) => `<span class="digit" data-column="${digits1.length - 1 - i}">${d}</span>`).join('');
        num2Display.innerHTML = digits2.map((d, i) => `<span class="digit" data-column="${digits2.length - 1 - i}">${d}</span>`).join('');
        num1Display.className = 'number-display multi-digit';
        num2Display.className = 'number-display multi-digit';

        const visual1 = document.getElementById('visual1');
        const visual2 = document.getElementById('visual2');
        visual1.innerHTML = '';
        visual2.innerHTML = '';

        this.showOnesColumn();
        this.setupProgressiveCarry();
        this.setupProgressiveAnswer();
    }

    showOnesColumn() {
        this.highlightColumn('ones');

        const visual1 = document.getElementById('visual1');
        const visual2 = document.getElementById('visual2');

        const ones1Div = document.createElement('div');
        ones1Div.className = 'column-visual ones-column active';
        ones1Div.innerHTML = `
            <div class="column-label">🔢 First add ONES!</div>
            ${this.createDigitVisuals(this.currentProblem.ones1, 'ones', 1)}
        `;

        const ones2Div = document.createElement('div');
        ones2Div.className = 'column-visual ones-column active';
        ones2Div.innerHTML = `
            <div class="column-label">🔢 Ones to add</div>
            ${this.createDigitVisuals(this.currentProblem.ones2, 'ones', 2)}
        `;

        visual1.appendChild(ones1Div);
        visual2.appendChild(ones2Div);

        setTimeout(() => this.attachClickListeners(), 100);
    }

    showTensColumn() {
        this.currentColumn = 'tens';
        this.hintLevel = 0;
        document.getElementById('hintCounter').textContent = '0/4';
        this.highlightColumn('tens');

        const visual1 = document.getElementById('visual1');
        const visual2 = document.getElementById('visual2');
        visual1.innerHTML = '';
        visual2.innerHTML = '';

        const tens1Div = document.createElement('div');
        tens1Div.className = 'column-visual tens-column active';
        tens1Div.innerHTML = `
            <div class="column-label">🎯 Now add TENS!</div>
            ${this.createDigitVisuals(this.currentProblem.tens1, 'tens', 1)}
        `;

        const tens2Div = document.createElement('div');
        tens2Div.className = 'column-visual tens-column active';
        tens2Div.innerHTML = `
            <div class="column-label">🎯 Tens to add</div>
            ${this.createDigitVisuals(this.currentProblem.tens2, 'tens', 2)}
        `;

        visual1.appendChild(tens1Div);
        visual2.appendChild(tens2Div);

        const tensInput = document.querySelector('.column-answer-input.tens-input');
        if (tensInput) {
            tensInput.style.display = 'inline-block';
            tensInput.disabled = false;
            tensInput.value = '';
            setTimeout(() => tensInput.focus(), 100);
        }

        this.playTone(800, 0.2);

        setTimeout(() => this.attachClickListeners(), 100);
    }

    attachClickListeners() {
        document.querySelectorAll('.visual-object, .ten-group').forEach(obj => {
            obj.addEventListener('click', () => this.playClickSound());
        });
    }

    highlightColumn(column) {
        const digits1 = document.querySelectorAll('#number1 .digit');
        const digits2 = document.querySelectorAll('#number2 .digit');

        digits1.forEach(d => d.classList.remove('highlight'));
        digits2.forEach(d => d.classList.remove('highlight'));

        if (column === 'ones') {
            const lastDigit1 = digits1[digits1.length - 1];
            const lastDigit2 = digits2[digits2.length - 1];
            lastDigit1?.classList.add('highlight');
            lastDigit2?.classList.add('highlight');
        } else {
            const tens1 = digits1[digits1.length - 2];
            const tens2 = digits2[digits2.length - 2];
            tens1?.classList.add('highlight');
            tens2?.classList.add('highlight');
        }
    }

    createDigitVisuals(digit, type, numberIndex) {
        if (digit === 0) {
            return '<div class="no-visuals">🚫 No ' + type + ' here!</div>';
        }

        let html = '<div class="digit-objects">';

        if (type === 'ones') {
            for (let i = 0; i < digit; i++) {
                html += `<div class="visual-object">${this.emojis[(numberIndex * 10 + i) % this.emojis.length]}</div>`;
            }
        } else {
            for (let i = 0; i < digit; i++) {
                html += `
                    <div class="ten-group">
                        ${this.createTenBundle(this.colors[(numberIndex * 10 + i) % this.colors.length])}
                    </div>
                `;
            }
        }

        html += '</div>';
        html += `<div class="digit-count">${digit} ${type}</div>`;

        return html;
    }

    createTenBundle(color) {
        const emoji = this.emojis[0];
        return `
            <div class="ten-bundle" style="border-color: ${color}">
                <div class="ten-bundle-icon">📦</div>
                <div class="ten-bundle-number">10</div>
            </div>
        `;
    }

    setupProgressiveCarry() {
        const carryRow = document.getElementById('carryRow');
        const carrySection = carryRow.querySelector('.carry-section');
        carrySection.innerHTML = '';

        const carryContainer = document.createElement('div');
        carryContainer.className = 'borrow-input-container';
        carryContainer.innerHTML = `
            <span class="borrow-label">🔄 Carry</span>
            <input type="number" class="borrow-input" id="carryInput" min="0" max="1" placeholder="0">
        `;
        carrySection.appendChild(carryContainer);

        const arrow = document.createElement('div');
        arrow.className = 'borrow-arrow';
        arrow.innerHTML = '➡️';
        carrySection.appendChild(arrow);

        const spacer = document.createElement('div');
        spacer.style.minWidth = '60px';
        carrySection.appendChild(spacer);

        const ones1 = this.currentProblem.ones1;
        const ones2 = this.currentProblem.ones2;

        if (ones1 + ones2 < 10) {
            document.getElementById('carryRow').style.display = 'none';
        } else {
            const carryInput = carryContainer.querySelector('#carryInput');
            if (carryInput) {
                carryInput.addEventListener('input', (e) => {
                    const carryValue = e.target.value;
                    if (carryValue && carryValue.length >= 1) {
                        this.showCarryForward(carryValue);
                    } else {
                        this.hideCarry();
                    }

                    if (e.target.value.length === 1) {
                        setTimeout(() => this.showTensColumn(), 100);
                    }
                });

                carryInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && this.currentColumn === 'ones') {
                        this.showTensColumn();
                    }
                });
            }
        }
    }

    showCarryForward(carryValue) {
        const carryRow = document.getElementById('carryRow');
        let carryForward = carryRow.querySelector('.borrow-forward');

        if (!carryForward) {
            carryForward = document.createElement('div');
            carryForward.className = 'borrow-forward';
            carryRow.appendChild(carryForward);
        }

        carryForward.innerHTML = `
            <div class="borrow-forward-visual">
                <div class="borrow-forward-image">
                    <div class="borrow-visual-box">
                        <div class="borrow-visual-objects">
                            <div class="borrow-visual-object" style="background: #55efc4; animation-delay: 0s">+1</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        carryForward.style.display = 'flex';
        this.playTone(700, 0.1);
    }

    hideCarry() {
        const carryRow = document.getElementById('carryRow');
        const carryForward = carryRow.querySelector('.borrow-forward');
        if (carryForward) {
            carryForward.style.display = 'none';
        }
    }

    setupProgressiveAnswer() {
        const oldInput = document.getElementById('answerInput');
        const submitBtn = document.getElementById('submitBtn');
        const container = document.getElementById('columnAnswerContainer');
        container.innerHTML = '';

        oldInput.style.display = 'none';
        container.classList.add('active');

        const tensInput = document.createElement('input');
        tensInput.type = 'number';
        tensInput.className = 'column-answer-input tens-input';
        tensInput.dataset.column = 'tens';
        tensInput.min = '0';
        tensInput.max = '9';
        tensInput.placeholder = '?';
        tensInput.style.display = 'none';
        tensInput.disabled = true;
        container.appendChild(tensInput);

        const onesInput = document.createElement('input');
        onesInput.type = 'number';
        onesInput.className = 'column-answer-input';
        onesInput.dataset.column = 'ones';
        onesInput.min = '0';
        onesInput.max = '9';
        onesInput.placeholder = '?';
        container.appendChild(onesInput);

        onesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkMultiDigitAnswer();
            }
        });

        tensInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkMultiDigitAnswer();
            }
        });

        onesInput.addEventListener('input', (e) => {
            const ones1 = this.currentProblem.ones1;
            const ones2 = this.currentProblem.ones2;
            if (ones1 + ones2 >= 10 && e.target.value.length === 1) {
                document.getElementById('carryInput').focus();
            }
        });

        const newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
        newSubmitBtn.addEventListener('click', () => this.checkMultiDigitAnswer());

        this.attachClickListeners();

        onesInput.focus();
    }

    displayVisualObjects(containerId, count, numberIndex) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        if (count <= 10) {
            for (let i = 0; i < count; i++) {
                const obj = document.createElement('div');
                obj.className = 'visual-object';

                const emoji = this.emojis[i % this.emojis.length];
                const color = this.colors[i % this.colors.length];

                obj.textContent = emoji;
                obj.style.backgroundColor = color;
                obj.style.animationDelay = `${i * 0.05}s`;

                obj.addEventListener('click', () => this.playClickSound());
                container.appendChild(obj);
            }
        } else {
            const tens = Math.floor(count / 10);
            const ones = count % 10;

            for (let i = 0; i < tens; i++) {
                const tenGroup = document.createElement('div');
                tenGroup.className = 'ten-group';

                const groupLabel = document.createElement('div');
                groupLabel.className = 'ten-label';
                groupLabel.textContent = '10';

                const groupEmoji = this.emojis[i % this.emojis.length];
                const groupColor = this.colors[i % this.colors.length];

                for (let j = 0; j < 10; j++) {
                    const obj = document.createElement('div');
                    obj.className = 'mini-object';
                    obj.textContent = groupEmoji;
                    obj.style.backgroundColor = groupColor;
                    tenGroup.appendChild(obj);
                }

                tenGroup.appendChild(groupLabel);
                tenGroup.style.animationDelay = `${i * 0.1}s`;
                tenGroup.addEventListener('click', () => this.playClickSound());
                container.appendChild(tenGroup);
            }

            for (let i = 0; i < ones; i++) {
                const obj = document.createElement('div');
                obj.className = 'visual-object';

                const emoji = this.emojis[(tens + i) % this.emojis.length];
                const color = this.colors[(tens + i) % this.colors.length];

                obj.textContent = emoji;
                obj.style.backgroundColor = color;
                obj.style.animationDelay = `${(tens + i) * 0.05}s`;

                obj.addEventListener('click', () => this.playClickSound());
                container.appendChild(obj);
            }
        }
    }

    checkAnswer() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;
        const isMultiDigit = num1 >= 10 || num2 >= 10;

        if (isMultiDigit) {
            this.checkMultiDigitAnswer();
        } else {
            this.checkSingleDigitAnswer();
        }
    }

    checkSingleDigitAnswer() {
        const userAnswer = parseInt(document.getElementById('answerInput').value);

        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a number! 🤔', 'incorrect');
            return;
        }

        if (userAnswer === this.currentProblem.answer) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer(userAnswer);
        }
    }

    checkMultiDigitAnswer() {
        const container = document.getElementById('columnAnswerContainer');
        const inputs = container.querySelectorAll('.column-answer-input');

        if (this.currentColumn === 'ones') {
            const onesAnswer = inputs[1].value;
            if (onesAnswer === '') {
                this.showFeedback('Enter the ones answer first! 🔢', 'incorrect');
                this.playErrorSound();
                inputs[1].focus();
                return;
            }

            const ones1 = this.currentProblem.ones1;
            const ones2 = this.currentProblem.ones2;

            if (ones1 + ones2 >= 10) {
                const carryInput = document.getElementById('carryInput');
                if (carryInput.value === '') {
                    this.showFeedback('🤔 Need to carry 1! Add 1 to carry box!', 'incorrect');
                    this.playErrorSound();
                    carryInput.focus();
                    return;
                }

                if (parseInt(carryInput.value) !== 1) {
                    this.showFeedback('❌ Carry should be 1! Try again!', 'incorrect');
                    this.playErrorSound();
                    carryInput.focus();
                    carryInput.select();
                    return;
                }
            }

            this.showTensColumn();

            this.playTone(800, 0.2);

            setTimeout(() => this.attachClickListeners(), 100);

            return;
        }

        if (inputs.length < 2) {
            this.showFeedback('Need both ones and tens answers! 🔢', 'incorrect');
            this.playErrorSound();
            return;
        }

        const tensAnswer = inputs[0].value;
        const onesAnswer = inputs[1].value;

        if (onesAnswer === '' || tensAnswer === '') {
            this.showFeedback('Fill in all the boxes! 📝', 'incorrect');
            this.playErrorSound();
            if (onesAnswer === '') {
                inputs[1].focus();
            } else if (tensAnswer === '') {
                inputs[0].focus();
            }
            return;
        }

        const answer = parseInt(tensAnswer + onesAnswer);

        if (answer === this.currentProblem.answer) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer(answer);
        }
    }

    handleIncorrectAnswer(userAnswer) {
        super.handleIncorrectAnswer(userAnswer);
        document.getElementById('stepsBtn').style.display = 'inline-flex';
    }

    showHint() {
        this.hintLevel++;
        this.playTone(700, 0.15);

        const isMultiDigit = this.currentProblem.num1 >= 10 || this.currentProblem.num2 >= 10;
        const maxHints = isMultiDigit ? 4 : 6;

        if (this.hintLevel > maxHints) {
            this.hintLevel = maxHints;
        }

        document.getElementById('hintCounter').textContent = `${this.hintLevel}/${maxHints}`;

        const mascot = document.getElementById('mascot');
        mascot.classList.add('talking');
        setTimeout(() => mascot.classList.remove('talking'), 500);

        let hintMessage = '';

        if (isMultiDigit) {
            if (this.currentColumn === 'ones') {
                const ones1 = this.currentProblem.ones1;
                const ones2 = this.currentProblem.ones2;
                const needsCarry = ones1 + ones2 >= 10;
                const onesSum = ones1 + ones2;

                if (this.hintLevel === 1) {
                    hintMessage = `👀 First! Look at the ONES column!`;
                    this.highlightColumn('ones');
                } else if (this.hintLevel === 2) {
                    hintMessage = `🔢 Add ones: ${ones1} + ${ones2} = ?`;
                } else if (this.hintLevel === 3) {
                    if (needsCarry) {
                        hintMessage = `🤔 ${ones1} + ${ones2} = ${onesSum}! We need to carry 1!`;
                    } else {
                        hintMessage = `🤔 ${ones1} + ${ones2} = ${onesSum}! Easy, no carry!`;
                    }
                } else if (this.hintLevel >= 4) {
                    if (needsCarry) {
                        hintMessage = `💡 Type 1 in the carry box! Then ${ones1} + ${ones2} - 10 = ${onesSum - 10}!`;
                    } else {
                        hintMessage = `💡 The ones answer is ${onesSum}!`;
                    }
                }
            } else {
                if (this.hintLevel === 1) {
                    hintMessage = `🎯 Now! Look at the TENS column!`;
                    this.highlightColumn('tens');
                } else if (this.hintLevel === 2) {
                    const ones1 = this.currentProblem.ones1;
                    const ones2 = this.currentProblem.ones2;
                    const carry = ones1 + ones2 >= 10 ? 1 : 0;
                    hintMessage = `🔢 Add tens: ${this.currentProblem.tens1} + ${this.currentProblem.tens2}${carry ? ' + 1 (carry)' : ''} = ?`;
                } else if (this.hintLevel === 3) {
                    const ones1 = this.currentProblem.ones1;
                    const ones2 = this.currentProblem.ones2;
                    const carry = ones1 + ones2 >= 10 ? 1 : 0;
                    const tensSum = this.currentProblem.tens1 + this.currentProblem.tens2 + carry;
                    hintMessage = `🧮 Total tens: ${tensSum}! That's the tens answer!`;
                } else if (this.hintLevel >= 4) {
                    hintMessage = `💡 The answer is ${this.currentProblem.answer}!`;
                }
            }
        } else {
            const num1 = this.currentProblem.num1;
            const num2 = this.currentProblem.num2;
            const answer = this.currentProblem.answer;

            if (this.hintLevel === 1) {
                hintMessage = `👀 Look at pictures! Count ALL objects first!`;
            } else if (this.hintLevel === 2) {
                hintMessage = `🌟 Great! Now add ${num2} more objects!`;
            } else if (this.hintLevel === 3) {
                hintMessage = `🤔 Put them together: ${num1} + ${num2} = ?`;
            } else if (this.hintLevel === 4) {
                hintMessage = `👆 Use your fingers! Count to ${num1}, then add ${num2} more!`;
            } else if (this.hintLevel === 5) {
                hintMessage = `✨ You're so close! Try ${answer - 1} or ${answer + 1}!`;
            } else {
                hintMessage = `💡 The answer starts with ${Math.floor(answer / 10)}${answer > 9 ? '...' : ''}!`;
            }
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
            '🦊 Hi there! Ready to add?',
            '🦊 Addition is like collecting stickers!',
            '🦊 You\'re doing amazing!',
            '🦊 Fox loves math! 🦊',
            '🦊 Keep up the great work!',
            '🦊 Click me anytime! 🎉',
            '🦊 Believe in yourself!',
            '🦊 Every answer makes you smarter!'
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

    updateExplanation() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;
        const answer = this.currentProblem.answer;
        const isMultiDigit = num1 >= 10 || num2 >= 10;

        const stepsContainer = document.getElementById('compactSteps');

        if (isMultiDigit) {
            const ones1 = num1 % 10;
            const ones2 = num2 % 10;
            const tens1 = Math.floor(num1 / 10);
            const tens2 = Math.floor(num2 / 10);
            const needsCarry = ones1 + ones2 >= 10;
            const onesSum = ones1 + ones2;
            const finalOnes = needsCarry ? onesSum % 10 : onesSum;
            const carry = needsCarry ? 1 : 0;
            const tensSum = tens1 + tens2 + carry;

            stepsContainer.innerHTML = `
                <div class="compact-step">
                    <span class="compact-step-number">1</span>
                    <span>ONES: ${ones1} + ${ones2} = ${onesSum}</span>
                </div>
                ${needsCarry ? `
                <div class="compact-step">
                    <span class="compact-step-number">2</span>
                    <span>CARRY! → ${finalOnes}, carry 1</span>
                </div>
                ` : `
                <div class="compact-step">
                    <span class="compact-step-number">2</span>
                    <span>= ${finalOnes}</span>
                </div>
                `}
                <div class="compact-step">
                    <span class="compact-step-number">${needsCarry ? '3' : '3'}</span>
                    <span>TENS: ${tens1} + ${tens2}${carry ? ' + 1' : ''} = ${tensSum}</span>
                </div>
                <div class="compact-step" style="background: #c8e6c9;">
                    <span class="compact-step-number">✓</span>
                    <span><strong>Answer: ${answer}</strong></span>
                </div>
            `;
        } else {
            stepsContainer.innerHTML = `
                <div class="compact-step">
                    <span class="compact-step-number">1</span>
                    <span>Start: ${num1}</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">2</span>
                    <span>Add: + ${num2}</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">3</span>
                    <span>${num1} + ${num2} = <strong>${answer}</strong></span>
                </div>
                <div class="compact-step" style="background: #c8e6c9;">
                    <span class="compact-step-number">💡</span>
                    <span>Count to ${num1}, add ${num2} more</span>
                </div>
            `;
        }
    }

    startTutorial() {
        this.tutorialStep = 0;
        this.tutorialSteps = this.createTutorialSteps();
        this.renderTutorialSteps();
        document.getElementById('tutorialOverlay').classList.add('active');
        this.updateTutorialUI();
        this.playTone(600, 0.2);
    }

    closeTutorial() {
        document.getElementById('tutorialOverlay').classList.remove('active');
        this.playTone(400, 0.2);
    }

    createTutorialSteps() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;
        const ones1 = num1 % 10;
        const ones2 = num2 % 10;
        const tens1 = Math.floor(num1 / 10);
        const tens2 = Math.floor(num2 / 10);
        const needsCarry = ones1 + ones2 >= 10;
        const onesSum = ones1 + ones2;
        const finalOnes = needsCarry ? onesSum % 10 : onesSum;
        const carry = needsCarry ? 1 : 0;
        const tensSum = tens1 + tens2 + carry;

        return [
            {
                title: '📊 Step 1: Look at the Ones',
                explanation: `First, let's look at the ones (the right column)! We have ${ones1} and we add ${ones2}.`,
                highlight: 'ones'
            },
            {
                title: '🧮 Step 2: Add the Ones',
                explanation: `${ones1} + ${ones2} = ${onesSum} ${needsCarry ? `Oh! ${onesSum} is 10 or more! We need to CARRY!` : `Perfect! No carrying needed!`}`,
                highlight: 'ones'
            },
            {
                title: '✈️ Step 3: Carry if Needed' + (needsCarry ? '' : ' (Skip this time!)'),
                explanation: needsCarry
                    ? `Since ${onesSum} is 10 or more, we write ${finalOnes} and carry 1 to the tens place!`
                    : `Since ${onesSum} is less than 10, we don't need to carry.`,
                highlight: 'carry'
            },
            {
                title: '🔢 Step 4: Add the Tens',
                explanation: `Now add the tens! We have ${tens1} plus ${tens2}${carry ? ' plus 1 we carried' : ''}. So: ${tens1} + ${tens2}${carry ? ' + 1' : ''} = ${tensSum}`,
                highlight: 'tens'
            },
            {
                title: '🎯 Step 5: The Final Answer!',
                explanation: `Putting it together: ${tensSum} tens and ${finalOnes} ones = ${this.currentProblem.answer}. Great work!`,
                highlight: 'answer',
                showFinal: true
            }
        ];
    }

    renderTutorialSteps() {
        const container = document.getElementById('tutorialSteps');
        container.innerHTML = '';

        this.tutorialSteps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = `tutorial-step ${index === 0 ? 'active' : ''}`;
            stepDiv.id = `step-${index}`;

            stepDiv.innerHTML = `
                <div class="tutorial-step-title">${step.title}</div>
                <div class="tutorial-visual">
                    ${this.createTutorialVisual(step, index)}
                </div>
                <div class="tutorial-explanation">${step.explanation}</div>
            `;

            container.appendChild(stepDiv);
        });
    }

    createTutorialVisual(step, stepIndex) {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;
        const ones1 = num1 % 10;
        const ones2 = num2 % 10;
        const tens1 = Math.floor(num1 / 10);
        const tens2 = Math.floor(num2 / 10);
        const needsCarry = ones1 + ones2 >= 10;
        const onesSum = ones1 + ones2;
        const finalOnes = needsCarry ? onesSum % 10 : onesSum;
        const carry = needsCarry ? 1 : 0;
        const tensSum = tens1 + tens2 + carry;

        let carryDisplay = '';
        if (step.highlight === 'carry' && needsCarry) {
            carryDisplay = `<div class="tutorial-carry">+1</div>`;
        }

        let onesHighlight = '';
        if (step.highlight === 'ones' && stepIndex >= 1) {
            onesHighlight = 'highlight';
        }

        let tensHighlight = '';
        if (step.highlight === 'tens' && stepIndex >= 3) {
            tensHighlight = 'highlight';
        }

        let answerDisplay = '';
        if (step.showFinal) {
            answerDisplay = `
                <div class="tutorial-divider"></div>
                <div class="tutorial-number">
                    <span class="tutorial-digit tens">${tensSum}</span>
                    <span class="tutorial-digit ones ${onesHighlight}">${finalOnes}</span>
                </div>
            `;
        }

        return `
            <div class="tutorial-problem">
                ${carryDisplay}
                <div class="tutorial-number">
                    <span class="tutorial-digit tens ${tensHighlight}">${tens1}</span>
                    <span class="tutorial-digit ones ${onesHighlight}">${ones1}</span>
                </div>
                <div class="tutorial-number">
                    <span class="tutorial-digit tens ${tensHighlight}">${tens2}</span>
                    <span class="tutorial-digit ones ${onesHighlight}">${ones2}</span>
                </div>
                ${answerDisplay}
            </div>
        `;
    }

    nextTutorialStep() {
        if (this.tutorialStep < this.tutorialSteps.length - 1) {
            this.tutorialStep++;
            this.updateTutorialUI();
            this.playTone(600, 0.1);
        }
    }

    prevTutorialStep() {
        if (this.tutorialStep > 0) {
            this.tutorialStep--;
            this.updateTutorialUI();
            this.playTone(500, 0.1);
        }
    }

    updateTutorialUI() {
        document.querySelectorAll('.tutorial-step').forEach((step, index) => {
            step.classList.toggle('active', index === this.tutorialStep);
        });

        document.getElementById('stepIndicator').textContent =
            `Step ${this.tutorialStep + 1} of ${this.tutorialSteps.length}`;

        document.getElementById('prevStep').disabled = this.tutorialStep === 0;
        document.getElementById('nextStep').disabled = this.tutorialStep === this.tutorialSteps.length - 1;
    }

    showSteps() {
        const isMultiDigit = this.currentProblem.num1 >= 10 || this.currentProblem.num2 >= 10;
        this.updateExplanation();
        document.getElementById('compactExplanation').style.display = 'block';
        document.getElementById('stepsBtn').style.display = 'none';
        this.playTone(600, 0.1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdditionGame();
});
