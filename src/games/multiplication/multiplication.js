class MultiplicationGame extends BaseGame {
    constructor() {
        super('multiplication');
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
        document.getElementById('hintContent').textContent = '';
        document.getElementById('feedbackArea').innerHTML = '';
        document.getElementById('answerInput').value = '';
        document.getElementById('answerInput').focus();
        document.getElementById('arrayDisplay').innerHTML = '';
        document.getElementById('groupsDisplay').innerHTML = '';
        document.getElementById('compactExplanation').style.display = 'none';
        document.getElementById('stepsBtn').style.display = 'none';

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
                num1 = this.randomNumber(1, 10);
                num2 = this.randomNumber(10, 12);
                break;
            case 4:
                num1 = this.randomNumber(2, 12);
                num2 = this.randomNumber(2, 12);
                break;
        }

        this.currentProblem = {
            num1,
            num2,
            answer: num1 * num2
        };

        this.displayProblem();
    }

    displayProblem() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;

        document.getElementById('number1').textContent = num1;
        document.getElementById('number2').textContent = num2;

        this.displayAreaModel();

        this.updateExplanation();
    }

    displayAreaModel() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;

        const arrayDisplay = document.getElementById('arrayDisplay');
        const groupsDisplay = document.getElementById('groupsDisplay');

        arrayDisplay.innerHTML = '';
        groupsDisplay.innerHTML = '';

        const title = document.createElement('div');
        title.className = 'area-model-title';
        title.innerHTML = `<span class="area-label">${num1}</span> rows × <span class="area-label">${num2}</span> columns = <span class="area-total">?</span>`;
        arrayDisplay.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'area-grid';
        grid.style.gridTemplateColumns = `repeat(${num2}, 1fr)`;

        for (let row = 0; row < num1; row++) {
            const rowLabel = document.createElement('div');
            rowLabel.className = 'area-row-label';
            rowLabel.textContent = row === 0 ? `${num2} each` : '';
            grid.appendChild(rowLabel);

            for (let col = 0; col < num2; col++) {
                const dot = document.createElement('div');
                dot.className = 'area-dot';
                dot.style.animationDelay = `${(row * num2 + col) * 0.03}s`;
                grid.appendChild(dot);
            }
        }

        const bottomLabel = document.createElement('div');
        bottomLabel.className = 'area-bottom-label';
        bottomLabel.textContent = `${num1} rows`;
        grid.appendChild(bottomLabel);

        arrayDisplay.appendChild(grid);

        const groupsTitle = document.createElement('div');
        groupsTitle.className = 'area-model-title';
        groupsTitle.innerHTML = `<span class="area-label">${num1}</span> groups of <span class="area-label">${num2}</span> = <span class="area-total">?</span>`;
        groupsTitle.style.marginTop = '20px';
        groupsDisplay.appendChild(groupsTitle);

        const groupsGrid = document.createElement('div');
        groupsGrid.className = 'groups-grid';

        for (let group = 0; group < num1; group++) {
            const groupContainer = document.createElement('div');
            groupContainer.className = 'group-box';
            groupContainer.style.animationDelay = `${group * 0.1}s`;

            const groupLabel = document.createElement('div');
            groupLabel.className = 'group-box-label';
            groupLabel.textContent = `Group ${group + 1}`;
            groupContainer.appendChild(groupLabel);

            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'group-dots';

            for (let i = 0; i < num2; i++) {
                const dot = document.createElement('div');
                dot.className = 'group-dot';
                dotsContainer.appendChild(dot);
            }

            groupContainer.appendChild(dotsContainer);
            groupsGrid.appendChild(groupContainer);
        }

        groupsDisplay.appendChild(groupsGrid);
    }

    updateExplanation() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;
        const answer = this.currentProblem.answer;

        const stepsContainer = document.getElementById('compactSteps');

        if (this.currentLevel === 1 || this.currentLevel === 2) {
            stepsContainer.innerHTML = `
                <div class="compact-step">
                    <span class="compact-step-number">1</span>
                    <span>We have ${num1} groups</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">2</span>
                    <span>Each group has ${num2} items</span>
                </div>
                <div class="compact-step">
                    <span class="compact-step-number">3</span>
                    <span>Add all groups: ${Array(num1).fill(num2).join(' + ')}</span>
                </div>
                <div class="compact-step" style="background: #c8e6c9;">
                    <span class="compact-step-number">✓</span>
                    <span><strong>Answer: ${answer}</strong></span>
                </div>
            `;
        } else {
            const ones2 = num2 % 10;
            const tens2 = Math.floor(num2 / 10);
            const tensPartial = num1 * tens2;
            const onesPartial = num1 * ones2;

            if (tens2 > 0) {
                stepsContainer.innerHTML = `
                    <div class="compact-step">
                        <span class="compact-step-number">1</span>
                        <span>BREAK: ${num2} = ${tens2} tens + ${ones2} ones</span>
                    </div>
                    ${tensPartial > 0 ? `
                    <div class="compact-step">
                        <span class="compact-step-number">2</span>
                        <span>TENS: ${num1} × ${tens2} = ${tensPartial} tens = ${tensPartial * 10}</span>
                    </div>
                    ` : ''}
                    ${onesPartial > 0 ? `
                    <div class="compact-step">
                        <span class="compact-step-number">${tensPartial > 0 ? '3' : '2'}</span>
                        <span>ONES: ${num1} × ${ones2} = ${onesPartial}</span>
                    </div>
                    ` : ''}
                    <div class="compact-step" style="background: #c8e6c9;">
                        <span class="compact-step-number">✓</span>
                        <span><strong>Answer: ${tensPartial * 10} + ${onesPartial} = ${answer}</strong></span>
                    </div>
                `;
            } else {
                stepsContainer.innerHTML = `
                    <div class="compact-step">
                        <span class="compact-step-number">1</span>
                        <span>We have ${num1} groups of ${num2}</span>
                    </div>
                    <div class="compact-step">
                        <span class="compact-step-number">2</span>
                        <span>Add: ${Array(num1).fill(num2).join(' + ')}</span>
                    </div>
                    <div class="compact-step" style="background: #c8e6c9;">
                        <span class="compact-step-number">✓</span>
                        <span><strong>Answer: ${answer}</strong></span>
                    </div>
                `;
            }
        }
    }

    displayArray() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;

        const arrayDisplay = document.getElementById('arrayDisplay');

        const title = document.createElement('div');
        title.className = 'array-title';
        title.textContent = `${num1} rows of ${num2} objects = ${num1} × ${num2} = ?`;
        arrayDisplay.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'array-grid';
        grid.style.gridTemplateColumns = `repeat(${num2}, 1fr)`;

        let objectIndex = 0;
        for (let row = 0; row < num1; row++) {
            for (let col = 0; col < num2; col++) {
                const item = document.createElement('div');
                item.className = 'array-item';
                const emoji = this.emojis[objectIndex % this.emojis.length];
                const color = this.colors[objectIndex % this.colors.length];
                item.textContent = emoji;
                item.style.backgroundColor = color;
                item.style.animationDelay = `${objectIndex * 0.05}s`;
                item.addEventListener('click', () => this.playClickSound());
                grid.appendChild(item);
                objectIndex++;
            }
        }

        arrayDisplay.appendChild(grid);
    }

    displayGroups() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;

        const groupsDisplay = document.getElementById('groupsDisplay');

        const title = document.createElement('div');
        title.className = 'array-title';
        title.textContent = `${num1} groups with ${num2} in each group`;
        title.style.width = '100%';
        title.style.textAlign = 'center';
        groupsDisplay.appendChild(title);

        for (let group = 0; group < num1; group++) {
            const groupContainer = document.createElement('div');
            groupContainer.className = 'group-container';

            const label = document.createElement('div');
            label.className = 'group-label';
            label.textContent = `Group ${group + 1}: ${num2} items`;
            groupContainer.appendChild(label);

            const groupItems = document.createElement('div');
            groupItems.className = 'group-items';

            for (let item = 0; item < num2; item++) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'group-item';
                const emoji = this.emojis[(group * 10 + item) % this.emojis.length];
                const color = this.colors[(group * 10 + item) % this.colors.length];
                itemDiv.textContent = emoji;
                itemDiv.style.backgroundColor = color;
                itemDiv.style.animationDelay = `${(group * num2 + item) * 0.05}s`;
                itemDiv.addEventListener('click', () => this.playClickSound());
                groupItems.appendChild(itemDiv);
            }

            groupContainer.appendChild(groupItems);
            groupsDisplay.appendChild(groupContainer);
        }
    }

    displayPartialProducts() {
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;

        const groupsDisplay = document.getElementById('groupsDisplay');
        groupsDisplay.innerHTML = '';

        const ones2 = num2 % 10;
        const tens2 = Math.floor(num2 / 10);

        if (tens2 > 0) {
            const tensSection = document.createElement('div');
            tensSection.className = 'partial-section';

            const tensTitle = document.createElement('div');
            tensTitle.className = 'partial-title';
            tensTitle.textContent = `${num1} × ${tens2} tens`;
            tensSection.appendChild(tensTitle);

            const tensGrid = document.createElement('div');
            tensGrid.className = 'partial-grid';

            const tensLabel = document.createElement('div');
            tensLabel.className = 'partial-label';
            tensLabel.textContent = `${num1} groups`;
            tensGrid.appendChild(tensLabel);

            for (let group = 0; group < num1; group++) {
                const tensBox = document.createElement('div');
                tensBox.className = 'partial-box';
                tensBox.style.animationDelay = `${group * 0.08}s`;
                tensBox.innerHTML = `<span class="box-content">${tens2}0</span>`;
                tensGrid.appendChild(tensBox);
            }

            const tensResult = document.createElement('div');
            tensResult.className = 'partial-result';
            tensResult.textContent = `= ${num1 * tens2 * 10}`;
            tensGrid.appendChild(tensResult);

            tensSection.appendChild(tensGrid);
            groupsDisplay.appendChild(tensSection);
        }

        if (ones2 > 0) {
            const onesSection = document.createElement('div');
            onesSection.className = 'partial-section';

            const onesTitle = document.createElement('div');
            onesTitle.className = 'partial-title';
            onesTitle.textContent = `${num1} × ${ones2}`;
            onesSection.appendChild(onesTitle);

            const onesGrid = document.createElement('div');
            onesGrid.className = 'partial-grid';

            const onesLabel = document.createElement('div');
            onesLabel.className = 'partial-label';
            onesLabel.textContent = `${num1} groups`;
            onesGrid.appendChild(onesLabel);

            for (let group = 0; group < num1; group++) {
                const onesBox = document.createElement('div');
                onesBox.className = 'partial-box';
                onesBox.style.animationDelay = `${group * 0.08}s`;
                onesBox.innerHTML = `<span class="box-content">${ones2}</span>`;
                onesGrid.appendChild(onesBox);
            }

            const onesResult = document.createElement('div');
            onesResult.className = 'partial-result';
            onesResult.textContent = `= ${num1 * ones2}`;
            onesGrid.appendChild(onesResult);

            onesSection.appendChild(onesGrid);
            groupsDisplay.appendChild(onesSection);
        }

        if (tens2 > 0 && ones2 > 0) {
            const totalSection = document.createElement('div');
            totalSection.className = 'partial-total';
            totalSection.innerHTML = `<span class="total-label">Total:</span> <span class="total-calculation">${num1 * tens2 * 10} + ${num1 * ones2} = <strong>${this.currentProblem.answer}</strong></span>`;
            groupsDisplay.appendChild(totalSection);
        }
    }

    checkAnswer() {
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

    handleIncorrectAnswer(userAnswer) {
        super.handleIncorrectAnswer(userAnswer);
        document.getElementById('stepsBtn').style.display = 'inline-flex';
    }

    showSteps() {
        this.updateExplanation();
        document.getElementById('compactExplanation').style.display = 'block';
        document.getElementById('stepsBtn').style.display = 'none';
        this.playTone(600, 0.1);
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
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;

        if (this.currentLevel <= 2) {
            if (this.hintLevel === 1) {
                hintMessage = `👀 Look at ${num1} rows! Each has ${num2} items!`;
            } else if (this.hintLevel === 2) {
                hintMessage = `🌟 Count each row: ${num2}, then ${num2}, then ${num2}...`;
            } else if (this.hintLevel === 3) {
                hintMessage = `🧮 Add them all: ${num1} groups of ${num2} = ?`;
            } else if (this.hintLevel === 4) {
                let sum = 0;
                for (let i = 0; i < num1; i++) {
                    sum += num2;
                    hintMessage += `${i > 0 ? ' + ' : ''}${num2}`;
                }
                hintMessage = `📝 Add them: ${hintMessage} = ?`;
            } else if (this.hintLevel === 5) {
                hintMessage = `✨ You're so close! Try ${this.currentProblem.answer - 1} or ${this.currentProblem.answer + 1}!`;
            } else {
                hintMessage = `💡 ${num1} × ${num2} = ${num1 * num2}!`;
            }
        } else {
            const ones2 = num2 % 10;
            const tens2 = Math.floor(num2 / 10);

            if (this.hintLevel === 1) {
                hintMessage = `👀 Break ${num2} into tens and ones: ${tens2} tens and ${ones2} ones!`;
            } else if (this.hintLevel === 2) {
                hintMessage = `🌟 Multiply by tens first: ${num1} × ${tens2} tens = ${num1 * tens2} tens!`;
            } else if (this.hintLevel === 3) {
                hintMessage = `🧮 Multiply by ones: ${num1} × ${ones2} = ${num1 * ones2}!`;
            } else if (this.hintLevel === 4) {
                hintMessage = `📝 Add partials: ${num1 * tens2 * 10} + ${num1 * ones2} = ?`;
            } else if (this.hintLevel === 5) {
                hintMessage = `✨ The answer starts with ${Math.floor(this.currentProblem.answer / 10)}!`;
            } else {
                hintMessage = `💡 ${num1} × ${num2} = ${this.currentProblem.answer}!`;
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
            '🦉 Hi there! Ready to multiply?',
            '🦉 Multiplication is repeated addition!',
            '🦉 You\'re doing amazing!',
            '🦉 Owl loves arrays! 🦉',
            '🦉 Keep up the great work!',
            '🦉 Click me anytime! 🎉',
            '🦉 Believe in yourself!',
            '🦉 Count by groups!'
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
        const num1 = this.currentProblem.num1;
        const num2 = this.currentProblem.num2;
        const answer = this.currentProblem.answer;
        
        // Check if we need to show partial products method for larger numbers
        const showPartialProducts = this.currentLevel >= 3 && num2 >= 10;
        const ones2 = num2 % 10;
        const tens2 = Math.floor(num2 / 10);
        
        if (showPartialProducts && tens2 > 0) {
            const tensPartial = num1 * tens2;
            const onesPartial = num1 * ones2;
            
            return [
                {
                    title: '📊 Step 1: Break Down the Problem',
                    explanation: `We have ${num1} × ${num2}. Let's break ${num2} into ${tens2} tens and ${ones2} ones!`,
                    highlight: 'break'
                },
                {
                    title: '🧮 Step 2: Multiply by Tens',
                    explanation: `First, multiply ${num1} × ${tens2} = ${tensPartial}. This is ${tensPartial} tens, which equals ${tensPartial * 10}!`,
                    highlight: 'tens'
                },
                {
                    title: '🔢 Step 3: Multiply by Ones',
                    explanation: `Next, multiply ${num1} × ${ones2} = ${onesPartial}!`,
                    highlight: 'ones'
                },
                {
                    title: '➕ Step 4: Add the Parts',
                    explanation: `Add the partial products: ${tensPartial * 10} + ${onesPartial} = ${answer}`,
                    highlight: 'add'
                },
                {
                    title: '🎯 Step 5: The Answer!',
                    explanation: `${num1} × ${num2} = ${answer}. Great work! You used the partial products method!`,
                    highlight: 'answer',
                    showFinal: true
                }
            ];
        }

        return [
            {
                title: '📊 Step 1: Understand the Problem',
                explanation: `We have ${num1} groups, and each group has ${num2} items. We want to find the total!`,
                highlight: 'problem'
            },
            {
                title: '🧮 Step 2: Count the Groups',
                explanation: `Count each group: ${num1} groups, each with ${num2} items!`,
                highlight: 'groups'
            },
            {
                title: '➕ Step 3: Add Them Up',
                explanation: `Add all groups: ${Array(num1).fill(num2).join(' + ')} = ${answer}`,
                highlight: 'add'
            },
            {
                    title: '🎯 Step 4: The Answer!',
                    explanation: `${num1} × ${num2} = ${answer}. Great work! Multiplication is just repeated addition!`,
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
        const answer = this.currentProblem.answer;
        
        // Check if we're using partial products
        const showPartialProducts = this.currentLevel >= 3 && num2 >= 10;
        const ones2 = num2 % 10;
        const tens2 = Math.floor(num2 / 10);
        
        let visualHTML = '';
        
        if (showPartialProducts && tens2 > 0) {
            const tensPartial = num1 * tens2;
            const onesPartial = num1 * ones2;
            
            // Build visual based on step
            if (step.highlight === 'break') {
                visualHTML = `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 15px;">
                        <div style="font-size: 2rem; color: #6c5ce7;">${num1} × ${num2}</div>
                        <div style="font-size: 1.5rem;">Break ${num2} into:</div>
                        <div style="display: flex; gap: 20px; justify-content: center;">
                            <div style="background: #74b9ff; padding: 10px 20px; border-radius: 10px; color: white;">${tens2} tens</div>
                            <div style="background: #fd79a8; padding: 10px 20px; border-radius: 10px; color: white;">${ones2} ones</div>
                        </div>
                    </div>
                `;
            } else if (step.highlight === 'tens') {
                visualHTML = `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 15px;">
                        <div style="font-size: 1.8rem;">${num1} × ${tens2} = ${tensPartial}</div>
                        <div style="font-size: 1.5rem; color: #74b9ff;">${tensPartial} tens = ${tensPartial * 10}</div>
                        <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap; max-width: 300px;">
                            ${Array(num1).fill(0).map((_, i) => `<div style="background: #74b9ff; padding: 5px 10px; border-radius: 5px; color: white; font-size: 0.9rem;">${tens2}0</div>`).join('')}
                        </div>
                    </div>
                `;
            } else if (step.highlight === 'ones') {
                visualHTML = `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 15px;">
                        <div style="font-size: 1.8rem;">${num1} × ${ones2} = ${onesPartial}</div>
                        <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap; max-width: 300px;">
                            ${Array(num1).fill(0).map((_, i) => `<div style="background: #fd79a8; padding: 5px 10px; border-radius: 5px; color: white; font-size: 0.9rem;">${ones2}</div>`).join('')}
                        </div>
                    </div>
                `;
            } else if (step.highlight === 'add') {
                visualHTML = `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 15px;">
                        <div style="font-size: 1.5rem;">Add the parts:</div>
                        <div style="font-size: 2rem; color: #74b9ff;">${tensPartial * 10}</div>
                        <div style="font-size: 1.5rem;">+</div>
                        <div style="font-size: 2rem; color: #fd79a8;">${onesPartial}</div>
                        <div style="font-size: 2.5rem; color: #6c5ce7; font-weight: bold;">= ${answer}</div>
                    </div>
                `;
            } else {
                visualHTML = `
                    <div class="tutorial-problem" style="flex-direction: row; justify-content: center; gap: 20px;">
                        <span class="tutorial-digit" style="font-size: 2.5rem;">${num1}</span>
                        <span class="tutorial-digit" style="font-size: 2.5rem; color: #fd79a8;">×</span>
                        <span class="tutorial-digit" style="font-size: 2.5rem;">${num2}</span>
                        <span class="tutorial-digit" style="font-size: 2.5rem; color: #fd79a8;">=</span>
                        <span class="tutorial-digit" style="font-size: 2.5rem; color: #6c5ce7;">${step.showFinal ? answer : '?'}</span>
                    </div>
                `;
            }
        } else {
            // Standard repeated addition visual
            visualHTML = `
                <div class="tutorial-problem" style="flex-direction: row; justify-content: center; gap: 20px;">
                    <span class="tutorial-digit" style="font-size: 2.5rem;">${num1}</span>
                    <span class="tutorial-digit" style="font-size: 2.5rem; color: #fd79a8;">×</span>
                    <span class="tutorial-digit" style="font-size: 2.5rem;">${num2}</span>
                    <span class="tutorial-digit" style="font-size: 2.5rem; color: #fd79a8;">=</span>
                    <span class="tutorial-digit" style="font-size: 2.5rem; color: #6c5ce7;">${step.showFinal ? answer : '?'}</span>
                </div>
            `;
        }
        
        return visualHTML;
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
    new MultiplicationGame();
});
