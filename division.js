class DivisionGame extends BaseGame {
    constructor() {
        super('division');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateProblem();
    }

    setupEventListeners() {
        this.setupLevelButtons();
        this.setupAnswerHandlers();

        const quotientInput = document.getElementById('quotientInput');
        const remainderInput = document.getElementById('remainderInput');
        const submitBtn = document.getElementById('submitBtn');

        if (quotientInput) {
            quotientInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer();
                }
            });
        }

        if (remainderInput) {
            remainderInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer();
                }
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.checkAnswer());
        }

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
        document.getElementById('hintContent').textContent = '';
        document.getElementById('feedbackArea').innerHTML = '';
        document.getElementById('quotientInput').value = '';
        document.getElementById('remainderInput').value = '0';
        document.getElementById('sharingDisplay').innerHTML = '';

        let dividend, divisor, quotient, remainder;

        switch(this.currentLevel) {
            case 1:
                divisor = this.randomNumber(2, 5);
                quotient = this.randomNumber(1, 5);
                dividend = divisor * quotient;
                remainder = 0;
                break;
            case 2:
                divisor = this.randomNumber(2, 9);
                quotient = this.randomNumber(1, 9);
                dividend = divisor * quotient;
                remainder = 0;
                break;
            case 3:
                divisor = this.randomNumber(2, 9);
                quotient = this.randomNumber(2, 10);
                dividend = divisor * quotient;
                remainder = 0;
                break;
            case 4:
                divisor = this.randomNumber(2, 9);
                quotient = this.randomNumber(2, 9);
                dividend = divisor * quotient + this.randomNumber(0, divisor - 1);
                remainder = dividend % divisor;
                quotient = Math.floor(dividend / divisor);
                break;
        }

        this.currentProblem = {
            dividend,
            divisor,
            quotient,
            remainder,
            answer: quotient,
            remainderAnswer: remainder
        };

        document.getElementById('quotientInput').focus();
        this.displayProblem();
    }

    displayProblem() {
        const { dividend, divisor, remainder } = this.currentProblem;

        document.getElementById('dividend').textContent = dividend;
        document.getElementById('divisor').textContent = divisor;

        if (remainder > 0) {
            document.querySelector('.remainder-section').style.display = 'flex';
            document.getElementById('remainderInput').value = '';
        } else {
            document.querySelector('.remainder-section').style.display = 'none';
        }

        this.displaySharing();
        this.updateExplanation();
    }

    updateExplanation() {
        const { dividend, divisor, quotient, remainder } = this.currentProblem;
        const answer = quotient;

        const stepsContainer = document.getElementById('compactSteps');

        if (remainder > 0) {
            stepsContainer.innerHTML = `
                <div class="compact-step">
                    <span class="compact-step-number">1</span>
                    <span>We have ${dividend} items</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">2</span>
                    <span>Share among ${divisor} friends equally</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">3</span>
                    <span>Each friend gets ${answer} items</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">4</span>
                    <span>${remainder} items left over</span>
                </div>
                <div class="compact-step" style="background: #c8e6c9;">
                    <span class="compact-step-number">✓</span>
                    <span><strong>Answer: ${answer} R ${remainder}</strong></span>
                </div>
            `;
        } else {
            stepsContainer.innerHTML = `
                <div class="compact-step">
                    <span class="compact-step-number">1</span>
                    <span>We have ${dividend} items</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">2</span>
                    <span>Share among ${divisor} friends equally</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">3</span>
                    <span>Each friend gets ${answer} items</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">4</span>
                    <span>Check: ${answer} × ${divisor} = ${answer * divisor}</span>
                </div>
                <div class="compact-step" style="background: #c8e6c9;">
                    <span class="compact-step-number">✓</span>
                    <span><strong>Answer: ${answer}</strong></span>
                </div>
            `;
        }
    }

    displaySharing() {
        const { dividend, divisor, quotient, remainder } = this.currentProblem;

        const sharingDisplay = document.getElementById('sharingDisplay');
        sharingDisplay.innerHTML = '';

        const title = document.createElement('div');
        title.className = 'sharing-title';
        title.innerHTML = `Share <span class="share-number">${dividend}</span> among <span class="share-number">${divisor}</span> friends equally`;
        sharingDisplay.appendChild(title);

        const circlesContainer = document.createElement('div');
        circlesContainer.className = 'circles-container';

        const itemsBefore = document.createElement('div');
        itemsBefore.className = 'items-before';
        itemsBefore.innerHTML = `<span class="items-label">Before:</span>`;

        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'items-grid';

        for (let i = 0; i < dividend; i++) {
            const dot = document.createElement('div');
            dot.className = 'item-dot';
            dot.style.animationDelay = `${i * 0.03}s`;
            itemsGrid.appendChild(dot);
        }

        itemsBefore.appendChild(itemsGrid);
        circlesContainer.appendChild(itemsBefore);

        const arrow = document.createElement('div');
        arrow.className = 'share-arrow';
        arrow.innerHTML = '⬇️';
        circlesContainer.appendChild(arrow);

        const groupsContainer = document.createElement('div');
        groupsContainer.className = 'groups-container';

        const friendColors = ['#fd79a8', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#ff7675', '#00cec9', '#fab1a0', '#e17055', '#0984e3'];

        for (let group = 0; group < divisor; group++) {
            const groupCircle = document.createElement('div');
            groupCircle.className = 'group-circle';
            groupCircle.style.borderColor = friendColors[group % friendColors.length];
            groupCircle.style.animationDelay = `${group * 0.1}s`;

            const friendLabel = document.createElement('div');
            friendLabel.className = 'friend-label';
            friendLabel.textContent = `Friend ${group + 1}`;
            groupCircle.appendChild(friendLabel);

            const circleDots = document.createElement('div');
            circleDots.className = 'circle-dots';

            for (let i = 0; i < quotient; i++) {
                const dot = document.createElement('div');
                dot.className = 'circle-dot';
                dot.style.backgroundColor = friendColors[group % friendColors.length];
                circleDots.appendChild(dot);
            }

            groupCircle.appendChild(circleDots);

            const countLabel = document.createElement('div');
            countLabel.className = 'circle-count';
            countLabel.textContent = `${quotient}`;
            groupCircle.appendChild(countLabel);

            groupsContainer.appendChild(groupCircle);
        }

        circlesContainer.appendChild(groupsContainer);

        if (remainder > 0) {
            const remainderBox = document.createElement('div');
            remainderBox.className = 'remainder-box-new';

            const remainderTitle = document.createElement('div');
            remainderTitle.className = 'remainder-title-new';
            remainderTitle.textContent = `${remainder} left over`;
            remainderBox.appendChild(remainderTitle);

            const remainderDots = document.createElement('div');
            remainderDots.className = 'remainder-dots';

            for (let i = 0; i < remainder; i++) {
                const dot = document.createElement('div');
                dot.className = 'remainder-dot';
                dot.style.animationDelay = `${i * 0.05}s`;
                remainderDots.appendChild(dot);
            }

            remainderBox.appendChild(remainderDots);
            circlesContainer.appendChild(remainderBox);
        }

        sharingDisplay.appendChild(circlesContainer);
    }

    checkAnswer() {
        const quotient = parseInt(document.getElementById('quotientInput').value);

        if (isNaN(quotient)) {
            this.showFeedback('Please enter a number! 🤔', 'incorrect');
            return;
        }

        const remainderInput = document.getElementById('remainderInput');
        const userRemainder = remainderInput && remainderInput.style.display !== 'none'
            ? parseInt(remainderInput.value) || 0
            : 0;

        if (quotient === this.currentProblem.answer && userRemainder === this.currentProblem.remainderAnswer) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer(quotient, userRemainder);
        }
    }

    handleIncorrectAnswer(quotient, remainder) {
        this.streak = 0;
        this.updateStats();
        this.saveStats();

        const diff = Math.abs(quotient - this.currentProblem.answer);
        let message = `Oops! Try again! 💪`;

        if (diff <= 1 && remainder === this.currentProblem.remainderAnswer) {
            message = `So close! ${quotient > this.currentProblem.answer ? 'Try a little smaller!' : 'Try a little bigger!'}`;
        } else if (quotient === this.currentProblem.answer && remainder !== this.currentProblem.remainderAnswer) {
            message = `Quotient is right! Check remainder! 🤔`;
        } else if (quotient * this.currentProblem.divisor < this.currentProblem.dividend - this.currentProblem.remainderAnswer) {
            message = `Try a bigger number! ${quotient} × ${this.currentProblem.divisor} = ${quotient * this.currentProblem.divisor}`;
        } else if (quotient * this.currentProblem.divisor > this.currentProblem.dividend) {
            message = `Try a smaller number! ${quotient} × ${this.currentProblem.divisor} = ${quotient * this.currentProblem.divisor}`;
        }

        this.showFeedback(message, 'incorrect');
        this.playErrorSound();

        document.getElementById('quotientInput').select();
    }

    showHint() {
        this.hintLevel++;
        this.playTone(700, 0.15);

        const maxHints = 6;

        if (this.hintLevel > maxHints) {
            this.hintLevel = maxHints;
        }

        document.getElementById('hintCounter').textContent = `${this.hintLevel}/${maxHints}`;

        const mascot = document.getElementById('mascot');
        mascot.classList.add('talking');
        setTimeout(() => mascot.classList.remove('talking'), 500);

        let hintMessage = '';
        const { dividend, divisor, quotient, remainder } = this.currentProblem;

        if (this.hintLevel === 1) {
            hintMessage = `👀 Count how many friends! There are ${divisor} friends!`;
        } else if (this.hintLevel === 2) {
            hintMessage = `🌟 Each friend gets same number of items!`;
        } else if (this.hintLevel === 3) {
            const test = divisor * Math.floor(quotient / 2);
            hintMessage = `🧮 Try multiplying: ${divisor} × ? = ${dividend} (or close)`;
        } else if (this.hintLevel === 4) {
            if (remainder > 0) {
                hintMessage = `🤔 There are ${remainder} items left over! So quotient is less than ${Math.floor(dividend / divisor) + 1}!`;
            } else {
                hintMessage = `🤔 No remainder! ${divisor} × ${quotient} = ${dividend}!`;
            }
        } else if (this.hintLevel === 5) {
            hintMessage = `✨ You're so close! Try ${quotient - 1} or ${quotient + 1}!`;
        } else {
            hintMessage = `💡 The answer is ${quotient}${remainder > 0 ? ' R ' + remainder : ''}!`;
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
            '🐻 Hi there! Ready to share?',
            '🐻 Division is sharing equally!',
            '🐻 You\'re doing amazing!',
            '🐻 Bear loves sharing! 🐻',
            '🐻 Keep up great work!',
            '🐻 Click me anytime! 🎉',
            '🐻 Believe in yourself!',
            '🐻 Share fair and square!'
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
        const { dividend, divisor, quotient, remainder } = this.currentProblem;

        return [
            {
                title: '📊 Step 1: Understand the Problem',
                explanation: `We have ${dividend} items to share equally among ${divisor} friends!`,
                highlight: 'problem'
            },
            {
                title: '🧮 Step 2: Share Equally',
                explanation: `Each friend gets the same number of items. ${dividend} ÷ ${divisor} = ?`,
                highlight: 'share'
            },
            {
                title: '➗ Step 3: Check Remainder',
                explanation: remainder > 0
                    ? `After sharing, ${remainder} items are left over! So the answer is ${quotient} R ${remainder}`
                    : `All items are shared equally! No remainder! The answer is ${quotient}`,
                highlight: 'remainder'
            },
            {
                title: '🎯 Step 4: Verify',
                explanation: `Check: ${quotient} × ${divisor} = ${quotient * divisor}${remainder > 0 ? ' + ' + remainder + ' = ' + dividend : ''}. Correct!`,
                highlight: 'verify'
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
        const { dividend, divisor, quotient, remainder } = this.currentProblem;

        const visual = `
            <div class="tutorial-problem" style="flex-direction: row; justify-content: center; gap: 15px;">
                <span class="tutorial-digit" style="font-size: 2.5rem;">${dividend}</span>
                <span class="tutorial-digit" style="font-size: 2.5rem; color: #0984e3;">÷</span>
                <span class="tutorial-digit" style="font-size: 2.5rem;">${divisor}</span>
                <span class="tutorial-digit" style="font-size: 2.5rem; color: #0984e3;">=</span>
                <span class="tutorial-digit" style="font-size: 2.5rem; color: #6c5ce7;">${stepIndex === 3 ? quotient : '?'}</span>
                ${remainder > 0 ? `<span class="tutorial-digit" style="font-size: 1.5rem; color: #e17055;">R</span>
                <span class="tutorial-digit" style="font-size: 2rem; color: #e17055;">${stepIndex === 3 ? remainder : '?'}</span>` : ''}
            </div>
        `;

        return visual;
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
    new DivisionGame();
});
