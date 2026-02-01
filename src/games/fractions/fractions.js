class FractionsGame extends BaseGame {
    constructor() {
        super('fractions');
        this.currentActivity = 'visual';
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

        const hintBtn = document.getElementById('hintBtn');
        const tutorialBtn = document.getElementById('tutorialBtn');
        const closeTutorial = document.getElementById('closeTutorial');
        const nextStep = document.getElementById('nextStep');
        const prevStep = document.getElementById('prevStep');
        const mascot = document.getElementById('mascot');
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
        if (tutorialBtn) {
            tutorialBtn.addEventListener('click', () => this.startTutorial());
        }
        if (closeTutorial) {
            closeTutorial.addEventListener('click', () => this.closeTutorial());
        }
        if (nextStep) {
            nextStep.addEventListener('click', () => this.nextTutorialStep());
        }
        if (prevStep) {
            prevStep.addEventListener('click', () => this.prevTutorialStep());
        }
        if (mascot) {
            mascot.addEventListener('click', () => this.mascotClick());
        }
    }

    generateActivity() {
        this.usedHint = false;
        this.hintLevel = 0;
        
        const hintContent = document.getElementById('hintContent');
        const feedbackArea = document.getElementById('feedbackArea');
        
        if (hintContent) hintContent.textContent = '';
        if (feedbackArea) feedbackArea.innerHTML = '';

        switch(this.currentActivity) {
            case 'visual':
                this.generateVisualFraction();
                break;
            case 'compare':
                this.generateComparison();
                break;
            case 'add':
                this.generateAddition();
                break;
            case 'subtract':
                this.generateSubtraction();
                break;
        }
    }

    generateVisualFraction() {
        const denominator = this.randomNumber(2, 8);
        const numerator = this.randomNumber(1, denominator - 1);
        
        this.currentProblem = {
            type: 'visual',
            numerator: numerator,
            denominator: denominator,
            answer: numerator / denominator
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="fraction-visual-game">
                <h2 class="fraction-title">🎨 What fraction is shaded?</h2>
                <div class="fraction-hint">Count the shaded parts and total parts!</div>
                <div class="fraction-shape-container" id="fractionShape"></div>
                <div class="fraction-input-area">
                    <div class="fraction-input">
                        <input type="number" class="fraction-numerator" id="numeratorInput" min="1" max="20" placeholder="?">
                        <div class="fraction-line"></div>
                        <input type="number" class="fraction-denominator" id="denominatorInput" min="1" max="20" placeholder="?">
                    </div>
                    <button class="submit-btn" id="submitFraction">Check! ✓</button>
                </div>
            </div>
        `;

        this.drawFractionShape(numerator, denominator);
        this.setupFractionHandlers();
    }

    drawFractionShape(numerator, denominator) {
        const container = document.getElementById('fractionShape');
        const shapeType = Math.random() > 0.5 ? 'circle' : 'rectangle';
        
        let html = `<div class="fraction-shape ${shapeType}">`;
        
        if (shapeType === 'circle') {
            const anglePerSection = 360 / denominator;
            for (let i = 0; i < denominator; i++) {
                const isShaded = i < numerator;
                html += `<div class="circle-section ${isShaded ? 'shaded' : ''}" 
                              style="transform: rotate(${i * anglePerSection}deg);">
                              <div class="section-fill"></div>
                         </div>`;
            }
        } else {
            const widthPercent = 100 / denominator;
            for (let i = 0; i < denominator; i++) {
                const isShaded = i < numerator;
                html += `<div class="rectangle-section ${isShaded ? 'shaded' : ''}" 
                              style="width: ${widthPercent}%;"></div>`;
            }
        }
        
        html += '</div>';
        container.innerHTML = html;
    }

    generateComparison() {
        const denom1 = this.randomNumber(2, 6);
        const num1 = this.randomNumber(1, denom1 - 1);
        const denom2 = this.randomNumber(2, 6);
        const num2 = this.randomNumber(1, denom2 - 1);
        
        const value1 = num1 / denom1;
        const value2 = num2 / denom2;
        
        this.currentProblem = {
            type: 'compare',
            fraction1: { numerator: num1, denominator: denom1, value: value1 },
            fraction2: { numerator: num2, denominator: denom2, value: value2 },
            answer: value1 > value2 ? '>' : value1 < value2 ? '<' : '='
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="fraction-compare-game">
                <h2 class="fraction-title">⚖️ Which fraction is bigger?</h2>
                <div class="fraction-hint">Compare the shaded parts!</div>
                <div class="fraction-comparison">
                    <div class="fraction-side">
                        <div class="fraction-display">
                            <span class="fraction-num">${num1}</span>
                            <span class="fraction-line">/</span>
                            <span class="fraction-den">${denom1}</span>
                        </div>
                        <div class="fraction-shape small" id="shape1"></div>
                    </div>
                    <div class="comparison-operator" id="compareOperator">?</div>
                    <div class="fraction-side">
                        <div class="fraction-display">
                            <span class="fraction-num">${num2}</span>
                            <span class="fraction-line">/</span>
                            <span class="fraction-den">${denom2}</span>
                        </div>
                        <div class="fraction-shape small" id="shape2"></div>
                    </div>
                </div>
                <div class="comparison-buttons">
                    <button class="compare-btn fraction-compare-btn" data-op="<">&lt;</button>
                    <button class="compare-btn fraction-compare-btn" data-op="=">=</button>
                    <button class="compare-btn fraction-compare-btn" data-op=">">&gt;</button>
                </div>
            </div>
        `;

        this.drawSmallFraction('shape1', num1, denom1);
        this.drawSmallFraction('shape2', num2, denom2);

        document.querySelectorAll('.fraction-compare-btn').forEach(btn => {
            btn.addEventListener('click', () => this.checkComparison(btn.dataset.op));
        });
    }

    drawSmallFraction(containerId, numerator, denominator) {
        const container = document.getElementById(containerId);
        const widthPercent = 100 / denominator;
        let html = '<div class="fraction-rectangle">';
        
        for (let i = 0; i < denominator; i++) {
            const isShaded = i < numerator;
            html += `<div class="rectangle-section ${isShaded ? 'shaded' : ''}" 
                          style="width: ${widthPercent}%;"></div>`;
        }
        
        html += '</div>';
        container.innerHTML = html;
    }

    generateAddition() {
        const denom = this.randomNumber(2, 4) * 2;
        const num1 = this.randomNumber(1, Math.floor(denom / 2));
        const num2 = this.randomNumber(1, Math.floor(denom / 2));
        
        this.currentProblem = {
            type: 'add',
            fraction1: { numerator: num1, denominator: denom },
            fraction2: { numerator: num2, denominator: denom },
            answer: { numerator: num1 + num2, denominator: denom }
        };

        this.showFractionOperation(num1, denom, num2, denom, '+');
    }

    generateSubtraction() {
        const denom = this.randomNumber(2, 4) * 2;
        const num1 = this.randomNumber(Math.floor(denom / 2) + 1, denom - 1);
        const num2 = this.randomNumber(1, num1 - 1);
        
        this.currentProblem = {
            type: 'subtract',
            fraction1: { numerator: num1, denominator: denom },
            fraction2: { numerator: num2, denominator: denom },
            answer: { numerator: num1 - num2, denominator: denom }
        };

        this.showFractionOperation(num1, denom, num2, denom, '-');
    }

    showFractionOperation(num1, denom1, num2, denom2, operator) {
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="fraction-operation-game">
                <h2 class="fraction-title">🔢 Solve the fraction problem!</h2>
                <div class="fraction-hint">Add the numerators, keep the denominator!</div>
                <div class="fraction-operation">
                    <div class="fraction-term">
                        <div class="fraction-display">
                            <span class="fraction-num">${num1}</span>
                            <span class="fraction-line">/</span>
                            <span class="fraction-den">${denom1}</span>
                        </div>
                        <div class="fraction-shape tiny" id="shape1"></div>
                    </div>
                    <div class="operation-operator">${operator}</div>
                    <div class="fraction-term">
                        <div class="fraction-display">
                            <span class="fraction-num">${num2}</span>
                            <span class="fraction-line">/</span>
                            <span class="fraction-den">${denom2}</span>
                        </div>
                        <div class="fraction-shape tiny" id="shape2"></div>
                    </div>
                    <div class="operation-operator">=</div>
                    <div class="fraction-answer">
                        <div class="fraction-input">
                            <input type="number" class="fraction-numerator" id="answerNum" min="1" max="20" placeholder="?">
                            <div class="fraction-line"></div>
                            <input type="number" class="fraction-denominator" id="answerDen" min="1" max="20" placeholder="${denom1}">
                        </div>
                    </div>
                </div>
                <button class="submit-btn" id="submitFraction">Check! ✓</button>
            </div>
        `;

        this.drawSmallFraction('shape1', num1, denom1);
        this.drawSmallFraction('shape2', num2, denom2);
        this.setupFractionHandlers();
    }

    setupFractionHandlers() {
        const submitBtn = document.getElementById('submitFraction');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.checkFractionAnswer());
        }

        const inputs = document.querySelectorAll('.fraction-input input');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkFractionAnswer();
                }
            });
        });
    }

    checkFractionAnswer() {
        const problem = this.currentProblem;
        let isCorrect = false;

        if (problem.type === 'visual') {
            const numInput = document.getElementById('numeratorInput');
            const denInput = document.getElementById('denominatorInput');
            
            const userNum = parseInt(numInput.value);
            const userDen = parseInt(denInput.value);
            
            isCorrect = userNum === problem.numerator && userDen === problem.denominator;
        } else if (problem.type === 'add' || problem.type === 'subtract') {
            const numInput = document.getElementById('answerNum');
            const denInput = document.getElementById('answerDen');
            
            const userNum = parseInt(numInput.value);
            const userDen = parseInt(denInput.value) || problem.answer.denominator;
            
            isCorrect = userNum === problem.answer.numerator && userDen === problem.answer.denominator;
        }

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    checkComparison(userAnswer) {
        const operator = document.getElementById('compareOperator');
        
        if (userAnswer === this.currentProblem.answer) {
            operator.textContent = userAnswer;
            operator.classList.add('correct');
            this.handleCorrectAnswer();
        } else {
            operator.textContent = userAnswer;
            operator.classList.add('incorrect');
            
            setTimeout(() => {
                operator.textContent = '?';
                operator.classList.remove('incorrect');
            }, 1000);
            
            this.handleIncorrectAnswer();
        }
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
        const problem = this.currentProblem;

        switch(problem.type) {
            case 'visual':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Count all the parts: there are ${problem.denominator} total parts!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🎨 Count the shaded parts: ${problem.numerator} parts are shaded!`;
                } else {
                    hintMessage = `✅ The answer is ${problem.numerator}/${problem.denominator}!`;
                }
                break;
            case 'compare':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Look at both shapes. Which has more shaded?`;
                } else if (this.hintLevel === 2) {
                    const f1 = problem.fraction1;
                    const f2 = problem.fraction2;
                    hintMessage = `🎨 ${f1.numerator}/${f1.denominator} vs ${f2.numerator}/${f2.denominator}`;
                } else {
                    hintMessage = `✅ ${problem.fraction1.numerator}/${problem.fraction1.denominator} ${problem.answer} ${problem.fraction2.numerator}/${problem.fraction2.denominator}`;
                }
                break;
            case 'add':
                if (this.hintLevel === 1) {
                    hintMessage = `➕ Add the top numbers (numerators)!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🎨 ${problem.fraction1.numerator} + ${problem.fraction2.numerator} = ?`;
                } else {
                    hintMessage = `✅ The answer is ${problem.answer.numerator}/${problem.answer.denominator}!`;
                }
                break;
            case 'subtract':
                if (this.hintLevel === 1) {
                    hintMessage = `➖ Subtract the top numbers (numerators)!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🎨 ${problem.fraction1.numerator} - ${problem.fraction2.numerator} = ?`;
                } else {
                    hintMessage = `✅ The answer is ${problem.answer.numerator}/${problem.answer.denominator}!`;
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
            '🍕 Fractions are like pizza slices!',
            '🎨 The top number is the shaded parts!',
            '📊 The bottom number is all the parts!',
            '⭐ You\'re doing great with fractions!',
            '🎯 Keep practicing fractions!',
            '🔢 Fractions are fun!',
            '🎉 You can do it!',
            '🌟 Fractions help us share!'
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
        const problem = this.currentProblem;
        
        switch(problem.type) {
            case 'visual':
                return [
                    {
                        title: '📊 Step 1: Count Total Parts',
                        explanation: `Look at the shape. Count all the parts: ${problem.denominator} total parts!`,
                        highlight: 'total'
                    },
                    {
                        title: '🧮 Step 2: Count Shaded Parts',
                        explanation: `Now count the shaded/colored parts: ${problem.numerator} parts are shaded!`,
                        highlight: 'shaded'
                    },
                    {
                        title: '🎯 Step 3: Write the Fraction',
                        explanation: `The fraction is ${problem.numerator}/${problem.denominator} - ${problem.numerator} shaded out of ${problem.denominator} total!`,
                        highlight: 'fraction'
                    }
                ];
            case 'compare':
                const f1 = problem.fraction1;
                const f2 = problem.fraction2;
                return [
                    {
                        title: '📊 Step 1: Look at Both Fractions',
                        explanation: `Compare ${f1.numerator}/${f1.denominator} with ${f2.numerator}/${f2.denominator}`,
                        highlight: 'look'
                    },
                    {
                        title: '🧮 Step 2: Compare Shaded Areas',
                        explanation: `Look at the shaded parts. Which shape has more shaded?`,
                        highlight: 'compare'
                    },
                    {
                        title: '🎯 Step 3: Choose the Symbol',
                        explanation: `${f1.numerator}/${f1.denominator} ${problem.answer} ${f2.numerator}/${f2.denominator}`,
                        highlight: 'answer'
                    }
                ];
            case 'add':
                return [
                    {
                        title: '📊 Step 1: Check Denominators',
                        explanation: `Both fractions have the same denominator: ${problem.fraction1.denominator}!`,
                        highlight: 'denominator'
                    },
                    {
                        title: '🧮 Step 2: Add Numerators',
                        explanation: `Add the top numbers: ${problem.fraction1.numerator} + ${problem.fraction2.numerator} = ${problem.answer.numerator}`,
                        highlight: 'add'
                    },
                    {
                        title: '🎯 Step 3: Keep Denominator',
                        explanation: `The answer is ${problem.answer.numerator}/${problem.answer.denominator} - same denominator!`,
                        highlight: 'answer'
                    }
                ];
            case 'subtract':
                return [
                    {
                        title: '📊 Step 1: Check Denominators',
                        explanation: `Both fractions have the same denominator: ${problem.fraction1.denominator}!`,
                        highlight: 'denominator'
                    },
                    {
                        title: '🧮 Step 2: Subtract Numerators',
                        explanation: `Subtract the top numbers: ${problem.fraction1.numerator} - ${problem.fraction2.numerator} = ${problem.answer.numerator}`,
                        highlight: 'subtract'
                    },
                    {
                        title: '🎯 Step 3: Keep Denominator',
                        explanation: `The answer is ${problem.answer.numerator}/${problem.answer.denominator} - same denominator!`,
                        highlight: 'answer'
                    }
                ];
            default:
                return [
                    {
                        title: '📊 Step 1: Understand',
                        explanation: 'Look at the fraction problem carefully!',
                        highlight: 'understand'
                    },
                    {
                        title: '🧮 Step 2: Solve',
                        explanation: 'Think about the answer!',
                        highlight: 'solve'
                    },
                    {
                        title: '🎯 Step 3: Answer',
                        explanation: 'Great job!',
                        highlight: 'answer'
                    }
                ];
        }
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
        const problem = this.currentProblem;
        
        switch(problem.type) {
            case 'visual':
                return `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 15px;">
                        <div style="display: flex; gap: 5px; justify-content: center; padding: 20px; background: #f8f9fa; border-radius: 15px;">
                            ${Array(problem.denominator).fill(0).map((_, i) => `
                                <div style="width: 40px; height: 60px; background: ${i < problem.numerator ? 'linear-gradient(135deg, #fd79a8, #e84393)' : '#dfe6e9'}; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid ${i < problem.numerator ? '#e84393' : '#b2bec3'};">${i < problem.numerator ? '✓' : ''}</div>
                            `).join('')}
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; font-size: 2rem;">
                            <div style="color: ${stepIndex >= 1 ? '#fd79a8' : '#636e72'}; font-weight: bold;">${problem.numerator}</div>
                            <div style="color: #b2bec3;">/</div>
                            <div style="color: ${stepIndex >= 0 ? '#74b9ff' : '#636e72'}; font-weight: bold;">${problem.denominator}</div>
                        </div>
                    </div>
                `;
            case 'compare':
                const f1 = problem.fraction1;
                const f2 = problem.fraction2;
                return `
                    <div class="tutorial-problem" style="flex-direction: row; justify-content: center; gap: 30px; align-items: center;">
                        <div style="text-align: center;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #74b9ff; margin-bottom: 10px;">${f1.numerator}/${f1.denominator}</div>
                            <div style="display: flex; gap: 3px; justify-content: center;">
                                ${Array(f1.denominator).fill(0).map((_, i) => `
                                    <div style="width: 25px; height: 40px; background: ${i < f1.numerator ? '#74b9ff' : '#dfe6e9'}; border-radius: 5px;"></div>
                                `).join('')}
                            </div>
                        </div>
                        <div style="font-size: 3rem; color: #6c5ce7; font-weight: bold; background: #f8f9fa; padding: 15px 25px; border-radius: 15px;">${stepIndex === 2 ? problem.answer : '?'}</div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #fd79a8; margin-bottom: 10px;">${f2.numerator}/${f2.denominator}</div>
                            <div style="display: flex; gap: 3px; justify-content: center;">
                                ${Array(f2.denominator).fill(0).map((_, i) => `
                                    <div style="width: 25px; height: 40px; background: ${i < f2.numerator ? '#fd79a8' : '#dfe6e9'}; border-radius: 5px;"></div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            case 'add':
            case 'subtract':
                const isAdd = problem.type === 'add';
                return `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 20px;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; font-size: 2rem;">
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="color: #74b9ff; font-weight: bold; font-size: 2.5rem;">${problem.fraction1.numerator}</div>
                                <div style="width: 60px; height: 3px; background: #b2bec3; margin: 5px 0;"></div>
                                <div style="color: #74b9ff; font-size: 1.5rem;">${problem.fraction1.denominator}</div>
                            </div>
                            <div style="font-size: 3rem; color: #6c5ce7;">${isAdd ? '+' : '-'}</div>
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="color: #fd79a8; font-weight: bold; font-size: 2.5rem;">${problem.fraction2.numerator}</div>
                                <div style="width: 60px; height: 3px; background: #b2bec3; margin: 5px 0;"></div>
                                <div style="color: #fd79a8; font-size: 1.5rem;">${problem.fraction2.denominator}</div>
                            </div>
                            <div style="font-size: 3rem; color: #6c5ce7;">=</div>
                            <div style="display: flex; flex-direction: column; align-items: center; background: ${stepIndex === 2 ? 'linear-gradient(135deg, #55efc4, #00b894)' : '#f8f9fa'}; padding: 15px; border-radius: 15px;">
                                <div style="color: ${stepIndex === 2 ? 'white' : '#636e72'}; font-weight: bold; font-size: 2.5rem;">${stepIndex === 2 ? problem.answer.numerator : '?'}</div>
                                <div style="width: 60px; height: 3px; background: ${stepIndex === 2 ? 'white' : '#b2bec3'}; margin: 5px 0;"></div>
                                <div style="color: ${stepIndex === 2 ? 'white' : '#636e72'}; font-size: 1.5rem;">${problem.answer.denominator}</div>
                            </div>
                        </div>
                        ${stepIndex === 1 ? `
                            <div style="font-size: 1.5rem; color: #6c5ce7; background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                                ${isAdd ? 'Add' : 'Subtract'} the numerators: ${problem.fraction1.numerator} ${isAdd ? '+' : '-'} ${problem.fraction2.numerator} = ${problem.answer.numerator}
                            </div>
                        ` : ''}
                    </div>
                `;
            default:
                return `
                    <div class="tutorial-problem" style="flex-direction: row; justify-content: center; gap: 20px;">
                        <span style="font-size: 3rem;">🍕</span>
                    </div>
                `;
        }
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

    handleCorrectAnswer() {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus;

        this.updateDailyStats(bonus);
        this.updateStats();
        this.saveStats();
        this.checkAchievements();
        this.checkDailyChallenges();
        this.showFeedback(`Great job! ${this.getCelebrationEmoji()}`, 'correct');
        this.playSuccessSound();

        if (this.streak % 5 === 0) {
            this.showCelebration();
        }

        setTimeout(() => {
            this.generateActivity();
        }, 2000);
    }

    handleIncorrectAnswer(userAnswer) {
        this.streak = 0;
        this.trackIncorrectAnswer();
        this.updateStats();
        this.saveStats();

        let message = `Oops! Try again! 💪`;
        
        if (this.currentProblem.type === 'visual') {
            message = `Oops! Count the shaded parts and total parts carefully!`;
        } else if (this.currentProblem.type === 'compare') {
            message = `Oops! Look at which shape has more shaded parts!`;
        } else if (this.currentProblem.type === 'add') {
            message = `Oops! Add the numerators (top numbers) and keep the denominator!`;
        } else if (this.currentProblem.type === 'subtract') {
            message = `Oops! Subtract the numerators (top numbers) and keep the denominator!`;
        }

        this.showFeedback(message, 'incorrect');
        this.playErrorSound();
        
        // Clear fraction inputs
        const numInput = document.getElementById('numeratorInput') || document.getElementById('answerNum');
        const denInput = document.getElementById('denominatorInput') || document.getElementById('answerDen');
        if (numInput) numInput.value = '';
        if (denInput) denInput.value = '';
        if (numInput) numInput.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FractionsGame();
});