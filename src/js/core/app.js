class MathGame {
    constructor() {
        this.currentLevel = 1;
        this.stars = 0;
        this.streak = 0;
        this.currentProblem = null;
        this.usedHint = false;
        this.hintLevel = 0;
        this.currentColumn = 'ones';
        
        this.emojis = ['🌟', '🎈', '🎪', '🎯', '🎨', '🎭', '🎪', '🎪'];
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateProblem();
    }
    
    setupEventListeners() {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLevel = parseInt(e.target.dataset.level);
                this.generateProblem();
            });
        });
        
        document.getElementById('submitBtn').addEventListener('click', () => this.checkAnswer());
        
        document.getElementById('answerInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
        
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        
        document.getElementById('tutorialBtn').addEventListener('click', () => this.startTutorial());
        
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
        this.hideCarryForward();
        
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
                num1 = this.randomNumber(10, 99);
                num2 = this.randomNumber(1, 9);
                break;
            case 4:
                num1 = this.randomNumber(10, 99);
                num2 = this.randomNumber(10, 99);
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
    
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
            const onesSum = ones1 + ones2;
            const needsCarry = onesSum >= 10;
            const finalOnes = onesSum % 10;
            const finalTens = tens1 + tens2 + (needsCarry ? 1 : 0);

            stepsContainer.innerHTML = `
                <div class="compact-step">
                    <span class="compact-step-number">1</span>
                    <span>ONES: ${ones1} + ${ones2}</span>
                </div>
                ${needsCarry ? `
                <div class="compact-step">
                    <span class="compact-step-number">2</span>
                    <span>CARRY! → ${ones1} + ${ones2} = ${onesSum}</span>
                </div>
                ` : `
                <div class="compact-step">
                    <span class="compact-step-number">2</span>
                    <span>= ${finalOnes}</span>
                </div>
                `}
                <div class="compact-step">
                    <span class="compact-step-number">${needsCarry ? '3' : '3'}</span>
                    <span>TENS: ${tens1} + ${tens2}${needsCarry ? ' + 1 carry' : ''} = ${finalTens}</span>
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
                    <span>Add: ${num2}</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">3</span>
                    <span>${num1} + ${num2} = <strong>${answer}</strong></span>
                </div>
                <div class="compact-step" style="background: #c8e6c9;">
                    <span class="compact-step-number">💡</span>
                    <span>Count from ${num1}, go up ${num2}</span>
                </div>
            `;
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
        
        this.displayVisualObjects('visual1', num1);
        this.displayVisualObjects('visual2', num2);
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
            <div class="column-label">🔢 Ones</div>
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
            <div class="column-label">🎯 Tens</div>
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
        carryContainer.className = 'carry-input-container';
        carryContainer.innerHTML = `
            <span class="carry-label">💡 Carry</span>
            <input type="number" class="carry-input" id="carryInput" min="0" max="1" placeholder="0">
        `;
        carrySection.appendChild(carryContainer);
        
        const arrow = document.createElement('div');
        arrow.className = 'carry-arrow';
        arrow.innerHTML = '⬅️';
        carrySection.appendChild(arrow);
        
        const spacer = document.createElement('div');
        spacer.style.minWidth = '60px';
        carrySection.appendChild(spacer);
        
        const carryInput = carryContainer.querySelector('#carryInput');
        if (carryInput) {
            carryInput.addEventListener('input', (e) => {
                const carryValue = e.target.value;
                if (carryValue && carryValue.length >= 1) {
                    this.showCarryForward(carryValue);
                } else {
                    this.hideCarryForward();
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
    
    showCarryForward(carryValue) {
        const carryRow = document.getElementById('carryRow');
        let carryForward = carryRow.querySelector('.carry-forward');
        
        if (!carryForward) {
            carryForward = document.createElement('div');
            carryForward.className = 'carry-forward';
            carryRow.appendChild(carryForward);
        }
        
        const emoji = this.emojis[carryValue % this.emojis.length];
        const color = this.colors[carryValue % this.colors.length];
        
        carryForward.innerHTML = `
            <div class="carry-forward-visual">
                <div class="carry-forward-image">
                    <div class="carry-visual-box">
                        <div class="carry-visual-objects">
                            ${Array(parseInt(carryValue)).fill('').map((_, i) => 
                                `<div class="carry-visual-object" style="background: ${color}; animation-delay: ${i * 0.1}s">${emoji}</div>`
                            ).join('')}
                        </div>
                        <div class="carry-visual-number">${carryValue}</div>
                    </div>
                </div>
                <div class="carry-forward-arrow">⬅️</div>
            </div>
        `;
        carryForward.style.display = 'flex';
        this.playTone(700, 0.1);
    }
    
    hideCarryForward() {
        const carryRow = document.getElementById('carryRow');
        const carryForward = carryRow.querySelector('.carry-forward');
        if (carryForward) {
            carryForward.style.display = 'none';
        }
    }
    
    setupProgressiveAnswer() {
        const oldInput = document.getElementById('answerInput');
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
            const sum = this.currentProblem.ones1 + this.currentProblem.ones2;
            if (sum >= 10 && e.target.value.length === 1) {
                document.getElementById('carryInput').focus();
            }
        });
        
        this.attachClickListeners();
        
        onesInput.focus();
    }
    
    displayVisualObjects(containerId, count) {
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
            
            const carryInput = document.getElementById('carryInput');
            const sum = this.currentProblem.ones1 + this.currentProblem.ones2;
            
            if (sum >= 10 && carryInput.value === '') {
                this.showFeedback('🤔 Ones add to ' + sum + '! Carry ' + Math.floor(sum / 10) + '!', 'incorrect');
                this.playErrorSound();
                carryInput.focus();
                return;
            }
            
            if (sum >= 10 && parseInt(carryInput.value) !== Math.floor(sum / 10)) {
                this.showFeedback('❌ Carry should be ' + Math.floor(sum / 10) + '! Try again!', 'incorrect');
                this.playErrorSound();
                carryInput.focus();
                carryInput.select();
                return;
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
    
    handleCorrectAnswer() {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus;
        
        this.updateStats();
        this.showFeedback(`Great job! ${this.getCelebrationEmoji()}`, 'correct');
        this.playSuccessSound();
        
        if (this.streak % 5 === 0) {
            this.showCelebration();
        }
        
        setTimeout(() => {
            this.generateProblem();
        }, 2000);
    }
    
    handleIncorrectAnswer(userAnswer) {
        this.streak = 0;
        this.updateStats();
        
        const diff = Math.abs(userAnswer - this.currentProblem.answer);
        let message = `Oops! Try again! 💪`;
        
        if (diff <= 2) {
            message = `So close! ${userAnswer > this.currentProblem.answer ? 'Try a little smaller!' : 'Try a little bigger!'}`;
        } else if (diff <= 5) {
            message = `You're getting warmer! 🌡️`;
        }
        
        this.showFeedback(message, 'incorrect');
        this.playErrorSound();
        
        document.getElementById('answerInput').select();
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
                const onesSum = this.currentProblem.ones1 + this.currentProblem.ones2;
                if (this.hintLevel === 1) {
                    hintMessage = `👀 First! Look at the ONES column!`;
                    this.highlightColumn('ones');
                } else if (this.hintLevel === 2) {
                    hintMessage = `🔢 Count the ones: ${this.currentProblem.ones1} + ${this.currentProblem.ones2} = ?`;
                } else if (this.hintLevel === 3) {
                    hintMessage = `🤔 The sum is ${onesSum}! ${onesSum >= 10 ? `Write ${onesSum % 10} and carry ${Math.floor(onesSum / 10)}!` : 'No carry needed!'}`;
                } else if (this.hintLevel >= 4) {
                    hintMessage = `💡 Type ${onesSum >= 10 ? Math.floor(onesSum / 10) : '0'} in the carry box!`;
                }
            } else {
                if (this.hintLevel === 1) {
                    hintMessage = `🎯 Now! Look at the TENS column!`;
                    this.highlightColumn('tens');
                } else if (this.hintLevel === 2) {
                    hintMessage = `🔢 Add tens: ${this.currentProblem.tens1} + ${this.currentProblem.tens2} = ?`;
                } else if (this.hintLevel === 3) {
                    const onesSum = this.currentProblem.ones1 + this.currentProblem.ones2;
                    const carry = Math.floor(onesSum / 10);
                    hintMessage = `🧮 Remember the carry! ${this.currentProblem.tens1} + ${this.currentProblem.tens2} + ${carry} = ?`;
                } else if (this.hintLevel >= 4) {
                    hintMessage = `💡 The answer is ${this.currentProblem.answer}!`;
                }
            }
        } else {
            const num1 = this.currentProblem.num1;
            const num2 = this.currentProblem.num2;
            const answer = this.currentProblem.answer;
            
            if (this.hintLevel === 1) {
                hintMessage = `👀 Look at pictures! Count the ones!`;
            } else if (this.hintLevel === 2) {
                hintMessage = `🌟 Great! Now count ${num2} ones!`;
            } else if (this.hintLevel === 3) {
                hintMessage = `🤔 Put them together! ${num1} + ${num2} = ?`;
            } else if (this.hintLevel === 4) {
                if (num1 + num2 <= 10) {
                    hintMessage = `👆 Use your fingers! Hold up ${num1}, then ${num2} more!`;
                } else {
                    hintMessage = `🧮 Let's count: ${num1}... ${num1 + 1}... ${num1 + 2}... keep going!`;
                }
            } else if (this.hintLevel === 5) {
                if (answer <= 10) {
                    hintMessage = `✨ You're so close! Try ${answer - 1} or ${answer + 1}!`;
                } else {
                    hintMessage = `🚀 Think bigger! The answer is between ${Math.max(num1, num2)} and ${answer + 5}!`;
                }
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
        }
        
        this.showFeedback(this.getRandomEncouragement(), 'correct');
    }
    
    highlightNumber(num) {
        const numDisplay = document.getElementById(`number${num}`);
        const visualContainer = document.getElementById(`visual${num}`);
        
        numDisplay.style.color = '#fdcb6e';
        numDisplay.style.textShadow = '0 0 20px #fdcb6e';
        numDisplay.style.transform = 'scale(1.2)';
        numDisplay.style.transition = 'all 0.3s ease';
        
        visualContainer.style.transform = 'scale(1.1)';
        visualContainer.style.boxShadow = '0 8px 25px rgba(253, 203, 110, 0.5)';
        visualContainer.style.transition = 'all 0.3s ease';
        
        this.playTone(800, 0.2);
        
        setTimeout(() => {
            numDisplay.style.color = '';
            numDisplay.style.textShadow = '';
            numDisplay.style.transform = '';
            
            visualContainer.style.transform = '';
            visualContainer.style.boxShadow = '';
        }, 2000);
    }
    
    highlightBoth() {
        const num1Display = document.getElementById('number1');
        const num2Display = document.getElementById('number2');
        const visual1 = document.getElementById('visual1');
        const visual2 = document.getElementById('visual2');
        
        num1Display.style.color = '#fdcb6e';
        num1Display.style.textShadow = '0 0 20px #fdcb6e';
        num2Display.style.color = '#fdcb6e';
        num2Display.style.textShadow = '0 0 20px #fdcb6e';
        
        visual1.style.transform = 'scale(1.1)';
        visual1.style.boxShadow = '0 8px 25px rgba(253, 203, 110, 0.5)';
        visual2.style.transform = 'scale(1.1)';
        visual2.style.boxShadow = '0 8px 25px rgba(253, 203, 110, 0.5)';
        
        this.playTone(800, 0.2);
        
        setTimeout(() => {
            num1Display.style.color = '';
            num1Display.style.textShadow = '';
            num2Display.style.color = '';
            num2Display.style.textShadow = '';
            
            visual1.style.transform = '';
            visual1.style.boxShadow = '';
            visual2.style.transform = '';
            visual2.style.boxShadow = '';
        }, 2000);
    }
    
    getRandomEncouragement() {
        const encouragements = [
            'You can do it! 💪',
            'Keep trying! 🌈',
            'Almost there! 🎯',
            'You\'re doing great! ⭐',
            'Don\'t give up! 🚀',
            'Believe in yourself! ✨',
            'One step at a time! 🎈',
            'Mistakes help us learn! 🌟'
        ];
        return encouragements[Math.floor(Math.random() * encouragements.length)];
    }
    
    mascotClick() {
        const mascot = document.getElementById('mascot');
        const messages = [
            '🦊 Hi there! Ready to learn?',
            '🦊 Click the hint button for help!',
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
    
    showFeedback(message, type) {
        const feedbackArea = document.getElementById('feedbackArea');
        feedbackArea.innerHTML = `
            <div class="feedback-message feedback-${type}">
                ${message}
            </div>
        `;
    }
    
    updateStats() {
        document.getElementById('stars').textContent = `⭐ ${this.stars}`;
        document.getElementById('streak').textContent = `🔥 ${this.streak}`;
    }
    
    getCelebrationEmoji() {
        const emojis = ['🎉', '👏', '🌟', '✨', '💫', '🎊', '🏆', '👍'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }
    
    showCelebration() {
        const container = document.getElementById('celebration');
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                container.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
        
        this.showFeedback(`🎉 Amazing! ${this.streak} in a row! 🎉`, 'correct');
    }
    
    playClickSound() {
        this.playTone(800, 0.1);
    }
    
    playSuccessSound() {
        this.playTone(523, 0.1);
        setTimeout(() => this.playTone(659, 0.1), 100);
        setTimeout(() => this.playTone(784, 0.2), 200);
    }
    
    playErrorSound() {
        this.playTone(200, 0.2);
        setTimeout(() => this.playTone(150, 0.2), 200);
    }
    
    playTone(frequency, duration) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
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
        const onesSum = ones1 + ones2;
        const tensSum = tens1 + tens2 + (onesSum >= 10 ? 1 : 0);
        const finalOnes = onesSum % 10;
        
        return [
            {
                title: '📊 Step 1: Look at the Ones',
                explanation: `First, let's look at the ones (the right column)! We have ${ones1} and ${ones2}. Let's add them together!`,
                highlight: 'ones'
            },
            {
                title: '🧮 Step 2: Add the Ones',
                explanation: `${ones1} + ${ones2} = ${onesSum}. ${onesSum >= 10 ? 'That\'s more than 10! We need to carry!' : 'Great job! That\'s less than 10.'}`,
                highlight: 'ones',
                showOnesResult: true
            },
            {
                title: '✈️ Step 3: Carry if Needed' + (onesSum >= 10 ? '' : ' (Skip this time!)'),
                explanation: onesSum >= 10 
                    ? `Since ${onesSum} is more than 10, we write ${finalOnes} and carry 1 to the tens place!` 
                    : `Since ${onesSum} is less than 10, we don't need to carry anything.`,
                highlight: 'carry',
                carry: onesSum >= 10 ? 1 : 0
            },
            {
                title: '🔢 Step 4: Add the Tens',
                explanation: `Now let's add the tens (the left column)! We have ${tens1} and ${tens2}.${onesSum >= 10 ? ` Plus 1 that we carried!` : ''} So: ${tens1} + ${tens2}${onesSum >= 10 ? ' + 1' : ''} = ${tensSum}`,
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
        const onesSum = ones1 + ones2;
        const finalOnes = onesSum % 10;
        const tensSum = Math.floor(num1 / 10) + Math.floor(num2 / 10) + (onesSum >= 10 ? 1 : 0);
        
        let carryDisplay = '';
        if (step.carry && stepIndex >= 2) {
            carryDisplay = `<div class="tutorial-carry">${step.carry}</div>`;
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
}

document.addEventListener('DOMContentLoaded', () => {
    new MathGame();
});