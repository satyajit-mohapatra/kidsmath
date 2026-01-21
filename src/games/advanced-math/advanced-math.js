class ArithmeticAlgorithmsGame extends AlgorithmGame {
    constructor() {
        super('addition');
        this.methodsLearned = 0;
        this.methodsAttempted = new Set();
        this.examplePresets = this.getExamplePresets();
        this.init();
    }

    init() {
        this.loadCalculationEngine();
        this.setupEventListeners();
        this.updateMethodButtons();
        this.updateMethodInfo();
        this.loadProgress();
        this.populateExampleDropdown();
        this.generateProblem();
    }

    loadCalculationEngine() {
        if (typeof CalculationEngine !== 'undefined') {
            this.engine = CalculationEngine;
        } else {
            console.warn('CalculationEngine not loaded, using fallback methods');
            this.engine = {
                AdditionMethods: {
                    standard: { METHOD_METADATA: { name: 'Standard Addition', difficulty: 1 }, calculate: (n1, n2) => ({ steps: [], finalAnswer: n1 + n2 }) }
                },
                SubtractionMethods: {},
                MultiplicationMethods: {},
                DivisionMethods: {}
            };
        }
    }

    loadProgress() {
        const saved = localStorage.getItem('arithmeticAlgorithmsProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.methodsLearned = progress.methodsLearned || 0;
            this.methodsAttempted = new Set(progress.methodsAttempted || []);
        }
        this.updateStats();
    }

    saveProgress() {
        const progress = {
            methodsLearned: this.methodsLearned,
            methodsAttempted: Array.from(this.methodsAttempted),
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('arithmeticAlgorithmsProgress', JSON.stringify(progress));
    }

    updateStats() {
        const methodsEl = document.getElementById('methodsLearned');
        if (methodsEl) methodsEl.textContent = this.methodsLearned;
        
        super.updateStats();
    }

    setupEventListeners() {
        this.setupOperationButtons();
        this.setupMethodButtons();
        this.setupNavigationButtons();
        this.setupPlaybackControls();
        this.setupExampleDropdown();
        this.setupExplainButton();
        this.setupExpandExplanation();
        super.setupAnswerHandlers();
    }

    getExamplePresets() {
        return {
            standard: [
                { num1: 247, num2: 185, label: '247 + 185 (multiple carries)' },
                { num1: 563, num2: 438, label: '563 + 438 (three-digit addition)' },
                { num1: 1999, num2: 2001, label: '1999 + 2001 (near 2000)' }
            ],
            kahan: [
                { num1: 0.1, num2: 0.2, label: '0.1 + 0.2 (decimal precision)' },
                { num1: 0.01, num2: 0.02, label: '0.01 + 0.02 (small decimals)' },
                { num1: 1.5, num2: 2.5, label: '1.5 + 2.5 (mixed decimals)' }
            ],
            carryLookahead: [
                { num1: 13, num2: 7, label: '13 + 7 (binary demo)' },
                { num1: 25, num2: 15, label: '25 + 15 (parallel carries)' },
                { num1: 100, num2: 50, label: '100 + 50 (computer method)' }
            ],
            twosComplement: [
                { num1: 100, num2: 50, label: '100 - 50 (binary subtraction)' },
                { num1: 75, num2: 30, label: '75 - 30 (signed numbers)' },
                { num1: 200, num2: 100, label: '200 - 100 (computer approach)' }
            ],
            gradeSchool: [
                { num1: 23, num2: 45, label: '23 × 45 (standard)' },
                { num1: 67, num2: 89, label: '67 × 89 (two-digit)' },
                { num1: 123, num2: 45, label: '123 × 45 (three-digit)' }
            ],
            vedicNikhilam: [
                { num1: 97, num2: 96, label: '97 × 96 (near 100) ⭐' },
                { num1: 104, num2: 103, label: '104 × 103 (near 100) ⭐' },
                { num1: 98, num2: 95, label: '98 × 95 (near 100)' }
            ],
            vedicUrdhvaTiryak: [
                { num1: 23, num2: 45, label: '23 × 45 (crosswise) ⭐' },
                { num1: 32, num2: 48, label: '32 × 48 (mental math)' },
                { num1: 44, num2: 55, label: '44 × 55 (vertical & cross)' }
            ],
            vedicEkadhikena: [
                { num1: 25, num2: 25, label: '25² (ends in 5) ⭐' },
                { num1: 35, num2: 35, label: '35² (ends in 5)' },
                { num1: 45, num2: 45, label: '45² (ends in 5)' }
            ],
            lattice: [
                { num1: 23, num2: 45, label: '23 × 45 (grid demo) ⭐' },
                { num1: 67, num2: 89, label: '67 × 89 (lattice)' },
                { num1: 34, num2: 56, label: '34 × 56 (visual)' }
            ],
            russianPeasant: [
                { num1: 18, num2: 25, label: '18 × 25 (doubling) ⭐' },
                { num1: 15, num2: 32, label: '15 × 32 (halving)' },
                { num1: 20, num2: 40, label: '20 × 40 (peasant method)' }
            ],
            abacus: [
                { num1: 25, num2: 37, label: '25 + 37 (bead method) ⭐' },
                { num1: 50, num2: 25, label: '50 + 25 (soroban)' },
                { num1: 100, num2: 50, label: '100 + 50 (mental abacus)' }
            ],
            karatsuba: [
                { num1: 12, num2: 34, label: '12 × 34 (recursive demo) ⚠️ Advanced' },
                { num1: 23, num2: 45, label: '23 × 45 (divide & conquer) ⚠️ Advanced' },
                { num1: 100, num2: 200, label: '100 × 200 (large numbers) ⚠️ Advanced' }
            ],
            longDivision: [
                { num1: 847, num2: 7, label: '847 ÷ 7 (classic) ⭐' },
                { num1: 1234, num2: 12, label: '1234 ÷ 12 (multi-digit)' },
                { num1: 500, num2: 8, label: '500 ÷ 8 (remainder)' }
            ],
            vedicParavartya: [
                { num1: 1000, num2: 8, label: '1000 ÷ 8 (transpose) ⭐' },
                { num1: 10000, num2: 25, label: '10000 ÷ 25 (near 100)' },
                { num1: 5000, num2: 4, label: '5000 ÷ 4 (adjust)' }
            ],
            synthetic: [
                { num1: 6, num2: 2, label: '(x²+5x+6)÷(x+2) ⭐ Advanced', dividend: 'x²+5x+6', divisor: 'x+2', isPolynomial: true },
                { num1: 12, num2: 3, label: '(x³-27)÷(x-3) ⚠️ Advanced', dividend: 'x³-27', divisor: 'x-3', isPolynomial: true },
                { num1: 20, num2: 4, label: '(x²-4)÷(x-2) ⚠️ Advanced', dividend: 'x²-4', divisor: 'x-4', isPolynomial: true }
            ],
            nonRestoring: [
                { num1: 100, num2: 3, label: '100 ÷ 3 (binary) ⚠️ Advanced' },
                { num1: 50, num2: 7, label: '50 ÷ 7 (computer) ⚠️ Advanced' },
                { num1: 200, num2: 11, label: '200 ÷ 11 (binary division) ⚠️ Advanced' }
            ],
            newtonRaphson: [
                { num1: 2, num2: 0, label: '√2 (iteration) ⚠️ Advanced', isRoot: true },
                { num1: 3, num2: 0, label: '√3 (approximation) ⚠️ Advanced', isRoot: true },
                { num1: 10, num2: 0, label: '√10 (refinement) ⚠️ Advanced', isRoot: true }
            ]
        };
    }

    populateExampleDropdown() {
        const select = document.getElementById('exampleSelect');
        if (!select) return;

        const presets = this.examplePresets[this.currentMethod] || [];
        
        select.innerHTML = '<option value="">-- Choose an Example --</option>';
        
        const recommendedGroup = document.createElement('optgroup');
        recommendedGroup.label = 'Perfect for This Method';
        
        const moreGroup = document.createElement('optgroup');
        moreGroup.label = 'More Examples';
        
        presets.forEach((preset, index) => {
            const option = document.createElement('option');
            option.value = JSON.stringify(preset);
            option.textContent = preset.label;
            
            if (index < 2) {
                recommendedGroup.appendChild(option);
            } else {
                moreGroup.appendChild(option);
            }
        });
        
        select.appendChild(recommendedGroup);
        select.appendChild(moreGroup);
    }

    setupExampleDropdown() {
        const select = document.getElementById('exampleSelect');
        const loadBtn = document.getElementById('loadExampleBtn');
        
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                const select = document.getElementById('exampleSelect');
                if (select && select.value) {
                    const preset = JSON.parse(select.value);
                    if (preset.isPolynomial) {
                        this.loadPolynomialExample(preset.dividend, preset.divisor);
                    } else if (preset.isRoot) {
                        this.loadRootExample(preset.num1);
                    } else {
                        this.loadExample(preset.num1, preset.num2);
                    }
                }
            });
        }
    }

    setupMethodButtons() {
        const methodContainer = document.getElementById('methodButtons');
        if (!methodContainer) return;
        
        methodContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.method-btn');
            if (btn) {
                document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMethod = btn.dataset.method;
                this.updateMethodInfo();
                this.populateExampleDropdown();
                this.generateProblem();
            }
        });
    }

    loadPolynomialExample(dividend, divisor) {
        this.showFeedback(`Loading polynomial: ${dividend} ÷ ${divisor}`, 'correct');
        this.createPolynomialFallback(dividend, divisor);
    }

    createPolynomialFallback(dividend, divisor) {
        if (!divisor || divisor === '0' || divisor === 'x') {
            this.showFeedback('Invalid polynomial division. Divisor cannot be zero.', 'incorrect');
            this.generateProblem();
            return;
        }
        
        const steps = [
            { stepNumber: 1, title: 'Polynomial Division', description: `${dividend} ÷ ${divisor}`, calculation: `${dividend} ÷ ${divisor}`, explanation: `Divide ${dividend} by ${divisor}.` }
        ];
        
        this.currentCalculation = {
            steps,
            finalAnswer: 'x + 3',
            inputs: { dividend, divisor },
            verification: { correct: true }
        };
        
        this.stepIndex = 0;
        this.displayInput();
        this.displayCurrentStep();
    }

    loadRootExample(number) {
        this.showFeedback(`Loading: √${number}`, 'correct');
        this.createRootFallback(number);
    }

    createRootFallback(number) {
        const result = Math.sqrt(number);
        const steps = [
            { stepNumber: 1, title: 'Square Root', description: `√${number}`, calculation: `√${number} ≈ ${result.toFixed(4)}`, explanation: `The square root of ${number} is approximately ${result.toFixed(4)}.` }
        ];
        
        this.currentCalculation = {
            steps,
            finalAnswer: result,
            inputs: { number },
            verification: { correct: true }
        };
        
        this.stepIndex = 0;
        this.displayInput();
        this.displayCurrentStep();
    }

    setupExplainButton() {
        const btn = document.getElementById('explainBtn');
        if (btn) {
            btn.addEventListener('click', () => this.showMethodExplanation());
        }
    }

    setupExpandExplanation() {
        const btn = document.getElementById('expandExplanationBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                const content = document.getElementById('explanationContent');
                if (content) {
                    const isHidden = content.style.display === 'none';
                    content.style.display = isHidden ? 'block' : 'none';
                    btn.textContent = isHidden ? '📖 Hide Explanation' : '📖 Learn More About This Method';
                }
            });
        }
    }

    loadExample(num1, num2) {
        const method = this.getMethodModule(this.currentMethod);
        if (method) {
            const validation = method.validateInput(num1, num2);
            if (validation.valid) {
                this.inputNumbers = { num1, num2 };
                this.currentCalculation = method.calculate(num1, num2);
                this.stepIndex = 0;
                this.displayInput();
                this.displayCurrentStep();
                this.showFeedback(`Loading example: ${num1} ${this.getOpSymbol()} ${num2}`, 'correct');
            } else {
                this.showFeedback(validation.message, 'incorrect');
            }
        }
    }

    getOpSymbol() {
        const symbols = { addition: '+', subtraction: '−', multiplication: '×', division: '÷' };
        return symbols[this.operation] || '+';
    }

    generateProblem() {
        this.methodsAttempted.add(this.currentMethod);
        this.saveProgress();
        
        const method = this.getMethodModule(this.currentMethod);
        const example = method?.getExample?.() || this.getDefaultExample();
        
        const num1 = this.randomNumber(example.min || 10, example.max || 99);
        const num2 = example.min2 !== undefined 
            ? this.randomNumber(example.min2, example.max2 || 99)
            : this.randomNumber(10, 99);

        this.inputNumbers = { num1, num2 };
        
        if (this.currentMethod === 'vedicEkadhikena' && method) {
            this.currentCalculation = method.calculate(num1 * num2);
        } else if (method) {
            if (this.operation === 'division') {
                const divisor = num2;
                const dividend = num1 * num2;
                this.currentCalculation = method.calculate(dividend, divisor);
            } else {
                this.currentCalculation = method.calculate(num1, num2);
            }
        } else {
            this.createFallbackCalculation(num1, num2);
        }

        this.stepIndex = 0;
        this.displayInput();
        this.displayCurrentStep();
    }

    createFallbackCalculation(num1, num2) {
        const op = this.operation;
        let result, steps;
        
        switch(op) {
            case 'addition':
                result = num1 + num2;
                steps = [
                    { stepNumber: 1, title: 'Add', description: `${num1} + ${num2}`, calculation: `${num1} + ${num2} = ${result}`, explanation: 'Simple addition.' }
                ];
                break;
            case 'subtraction':
                result = num1 - num2;
                steps = [
                    { stepNumber: 1, title: 'Subtract', description: `${num1} - ${num2}`, calculation: `${num1} - ${num2} = ${result}`, explanation: 'Simple subtraction.' }
                ];
                break;
            case 'multiplication':
                result = num1 * num2;
                steps = [
                    { stepNumber: 1, title: 'Multiply', description: `${num1} × ${num2}`, calculation: `${num1} × ${num2} = ${result}`, explanation: 'Simple multiplication.' }
                ];
                break;
            case 'division':
                const quotient = Math.floor(num1 / num2);
                const remainder = num1 % num2;
                result = quotient;
                steps = [
                    { stepNumber: 1, title: 'Divide', description: `${num1} ÷ ${num2}`, calculation: `${num1} ÷ ${num2} = ${quotient} R${remainder}`, explanation: 'Long division result.' }
                ];
                break;
        }
        
        this.currentCalculation = {
            steps,
            finalAnswer: result,
            inputs: { num1, num2 },
            verification: { correct: true }
        };
    }

    getDefaultExample() {
        const defaults = {
            addition: { min: 10, max: 99, min2: 10, max2: 99 },
            subtraction: { min: 50, max: 99, min2: 10, max2: 49 },
            multiplication: { min: 2, max: 12, min2: 2, max2: 12 },
            division: { min: 2, max: 12, min2: 2, max2: 99 }
        };
        return defaults[this.operation] || { min: 10, max: 99 };
    }

    displayCurrentStep() {
        const stepArea = document.getElementById('stepDisplay');
        const steps = this.currentCalculation?.steps || [];
        
        if (this.stepIndex >= steps.length) {
            this.showFinalAnswer();
            return;
        }

        const step = steps[this.stepIndex];
        
        if (stepArea) {
            stepArea.innerHTML = `
                <div class="step-container">
                    <div class="step-number">Step ${step.stepNumber}</div>
                    <div class="step-title">${step.title}</div>
                    <div class="step-description">${step.description}</div>
                    <div class="step-calculation">${step.calculation}</div>
                    ${step.explanation ? `<div class="step-explanation">💡 ${step.explanation}</div>` : ''}
                </div>
            `;
        }

        this.updateNavigationState();
    }

    showFinalAnswer() {
        const stepArea = document.getElementById('stepDisplay');
        const result = this.currentCalculation?.finalAnswer;
        
        if (stepArea && result !== undefined) {
            const { num1, num2 } = this.inputNumbers;
            stepArea.innerHTML = `
                <div class="final-answer">
                    <div class="answer-label">Final Answer</div>
                    <div class="answer-value">${result}</div>
                    <div class="verification">
                        ✓ ${num1} ${this.getOpSymbol()} ${num2} = ${result}
                    </div>
                </div>
            `;
        }
    }

    updateNavigationState() {
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const progress = document.getElementById('stepProgress');
        const steps = this.currentCalculation?.steps || [];
        
        if (prevBtn) prevBtn.disabled = this.stepIndex === 0;
        if (nextBtn) nextBtn.disabled = this.stepIndex >= steps.length;
        
        if (progress) {
            progress.textContent = `Step ${this.stepIndex + 1} of ${steps.length}`;
        }
    }

    checkAnswer() {
        const userAnswer = parseFloat(document.getElementById('answerInput').value);
        
        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a number! 🔢', 'incorrect');
            return;
        }

        const correctAnswer = this.currentCalculation?.finalAnswer;
        
        if (this.compareAnswers(userAnswer, correctAnswer)) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer(userAnswer);
        }
    }

    compareAnswers(userAnswer, correctAnswer) {
        if (typeof correctAnswer === 'number') {
            return Math.abs(userAnswer - correctAnswer) < 0.0001;
        }
        return userAnswer === correctAnswer;
    }

    handleCorrectAnswer() {
        this.streak++;
        
        if (!this.methodsAttempted.has(this.currentMethod)) {
            this.methodsAttempted.add(this.currentMethod);
            this.methodsLearned++;
            this.saveProgress();
            this.updateStats();
        }

        this.updateStats();
        this.saveStats();
        this.showFeedback(`Excellent! The answer is ${this.currentCalculation.finalAnswer} ${this.getCelebrationEmoji()}`, 'correct');
        this.playSuccessSound();

        if (this.streak % 3 === 0) {
            this.showCelebration();
        }

        setTimeout(() => {
            this.generateProblem();
        }, 2000);
    }

    handleIncorrectAnswer(userAnswer) {
        this.streak = 0;
        this.updateStats();
        this.saveStats();

        const correct = this.currentCalculation?.finalAnswer;
        const diff = Math.abs(userAnswer - correct);
        let message = `Oops! The answer is ${correct}. Try another problem! 💪`;

        if (diff === 1) {
            message = `So close! The answer is ${correct}. Try again! 🌟`;
        }

        this.showFeedback(message, 'incorrect');
        this.playErrorSound();
        
        document.getElementById('answerInput').select();
    }

    showHint() {
        const hintContent = document.getElementById('hintContent');
        if (!hintContent) return;
        
        const hints = [
            'Take it step by step! Read each step carefully.',
            'Look at the calculation shown in each step.',
            'Think about what operation makes sense here.',
            'Remember: Addition = combining, Subtraction = taking away, Multiplication = repeated addition, Division = sharing equally.'
        ];
        
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        hintContent.textContent = randomHint;
        this.playClickSound();
    }

    showMethodExplanation() {
        const content = document.getElementById('explanationContent');
        if (!content) return;
        
        const method = this.getMethodInfo(this.currentMethod);
        content.innerHTML = `
            <h3>${method.name}</h3>
            <div class="explanation-content">
                <h4>📚 How It Works</h4>
                <p>${method.mathPrinciple || 'This method uses a specific algorithm to perform calculations efficiently.'}</p>
                
                <h4>🌍 Origin & History</h4>
                <p><strong>${method.origin.culture || 'Unknown'}</strong></p>
                <p>${method.origin.timePeriod || 'Historical period unknown'}</p>
                <p>${method.origin.description || 'A traditional calculation method passed down through generations.'}</p>
                
                <h4>🎯 When to Use</h4>
                <ul>${(method.whenToUse || []).map(w => `<li>${w}</li>`).join('') || '<li>General calculations</li>'}</ul>
                
                <h4>⚡ Speed Rating</h4>
                <p>${(method.speedRating || 'medium').toUpperCase()} - ${this.getSpeedDescription(method.speedRating)}</p>
                
                <h4>👍 Advantages</h4>
                <ul>${(method.advantages || []).map(a => `<li>${a}</li>`).join('') || '<li>Reliable and accurate</li>'}</ul>
            </div>
        `;
        
        content.style.display = 'block';
        const btn = document.getElementById('expandExplanationBtn');
        if (btn) btn.textContent = '📖 Hide Explanation';
    }

    getSpeedDescription(speed) {
        const descriptions = {
            instant: 'Lightning fast - almost instant calculation',
            very_fast: 'Very fast - excellent for large numbers',
            fast: 'Fast - good for most situations',
            medium: 'Moderate speed - standard approach',
            slow: 'Slower but educational - good for learning'
        };
        return descriptions[speed] || 'Moderate speed';
    }

    mascotClick() {
        const messages = [
            'You\'re doing great! Keep exploring different methods! 🌟',
            'Math has many ways to solve problems! 🧩',
            'Each method has its own beauty! 📐',
            'Keep learning and you\'ll master them all! 💪',
            'Different methods work better in different situations! 🎯'
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('hintContent').textContent = randomMessage;
        this.playTone(600, 0.1);
        setTimeout(() => this.playTone(800, 0.1), 100);
    }

    updateMethodButtons() {
        const container = document.getElementById('methodButtons');
        if (!container) return;
        
        container.innerHTML = '';
        
        const methodConfigs = {
            addition: [
                { id: 'standard', name: 'Standard', diff: 1 },
                { id: 'kahan', name: 'Kahan', diff: 3 },
                { id: 'carryLookahead', name: 'Carry Lookahead', diff: 5 }
            ],
            subtraction: [
                { id: 'standard', name: 'Standard', diff: 1 },
                { id: 'twosComplement', name: 'Two\'s Complement', diff: 4 }
            ],
            multiplication: [
                { id: 'gradeSchool', name: 'Grade School', diff: 1 },
                { id: 'vedicNikhilam', name: 'Vedic Nikhilam', diff: 3 },
                { id: 'vedicUrdhvaTiryak', name: 'Vedic Urdhva', diff: 3 },
                { id: 'vedicEkadhikena', name: 'Squaring 5s', diff: 2 },
                { id: 'lattice', name: 'Lattice', diff: 2 },
                { id: 'russianPeasant', name: 'Russian Peasant', diff: 2 },
                { id: 'abacus', name: 'Abacus', diff: 4 },
                { id: 'karatsuba', name: 'Karatsuba', diff: 5 }
            ],
            division: [
                { id: 'longDivision', name: 'Long Division', diff: 2 },
                { id: 'vedicParavartya', name: 'Vedic Paravartya', diff: 4 },
                { id: 'synthetic', name: 'Synthetic', diff: 3 },
                { id: 'nonRestoring', name: 'Non-Restoring', diff: 5 },
                { id: 'newtonRaphson', name: 'Newton-Raphson', diff: 5 }
            ]
        };

        const methods = methodConfigs[this.operation] || methodConfigs.addition;
        
        methods.forEach(m => {
            const btn = document.createElement('button');
            btn.className = 'method-btn' + (m.id === this.currentMethod ? ' active' : '');
            btn.dataset.method = m.id;
            btn.innerHTML = `
                <span class="method-icon">${this.getMethodIcon(m.id)}</span>
                <span class="method-name">${m.name}</span>
                <span class="method-difficulty">${'⭐'.repeat(m.diff)}</span>
            `;
            btn.title = `Difficulty: ${'⭐'.repeat(m.diff)}`;
            container.appendChild(btn);
        });
    }

    getMethodIcon(methodId) {
        const icons = {
            standard: '📐',
            kahan: '🔢',
            carryLookahead: '⚡',
            twosComplement: '🔄',
            gradeSchool: '✏️',
            vedicNikhilam: '🧘',
            vedicUrdhvaTiryak: '🌀',
            vedicEkadhikena: '✨',
            lattice: '📊',
            russianPeasant: '🌾',
            longDivision: '📏',
            vedicParavartya: '🔃',
            synthetic: '📈'
        };
        return icons[methodId] || '🔸';
    }

    updateMethodInfo() {
        const infoPanel = document.getElementById('methodInfo');
        if (!infoPanel) return;
        
        const methodInfo = {
            standard: {
                name: 'Standard Method',
                origin: 'Universal - Ancient origins, refined in Medieval Europe',
                description: 'The traditional method taught in schools worldwide.',
                whenToUse: ['Everyday calculations', 'Learning basics', 'Quick estimates']
            },
            kahan: {
                name: 'Kahan Summation',
                origin: 'American (William Kahan) - 1965',
                description: 'Error-correcting algorithm for precise decimal addition.',
                whenToUse: ['Financial calculations', 'Scientific measurements', 'Many decimal numbers']
            },
            carryLookahead: {
                name: 'Carry Lookahead',
                origin: 'American - 1950s-1960s',
                description: 'Computer hardware method for parallel carry calculation.',
                whenToUse: ['Computer processor design', 'Understanding binary arithmetic']
            },
            twosComplement: {
                name: 'Two\'s Complement',
                origin: 'Computer Science - 1940s-1950s',
                description: 'Standard method for signed numbers in computers.',
                whenToUse: ['Computer arithmetic', 'Binary operations', 'Signed numbers']
            },
            gradeSchool: {
                name: 'Grade School',
                origin: 'Universal - Ancient origins',
                description: 'Partial products method taught in schools.',
                whenToUse: ['General multiplication', 'Learning basics', 'Any numbers']
            },
            vedicNikhilam: {
                name: 'Vedic Nikhilam',
                origin: 'Indian (Vedic) - ~500 CE',
                description: 'For numbers near powers of 10.',
                whenToUse: ['Numbers like 97, 96', 'Mental math', 'Near 100, 1000']
            },
            vedicUrdhvaTiryak: {
                name: 'Vedic Urdhva Tiryak',
                origin: 'Indian (Vedic) - ~500 CE',
                description: 'Vertical and crosswise method.',
                whenToUse: ['General multiplication', 'Mental math', '2-4 digit numbers']
            },
            vedicEkadhikena: {
                name: 'Ekadhikena Purvena',
                origin: 'Indian (Vedic) - ~500 CE',
                description: 'Lightning-fast squaring of numbers ending in 5.',
                whenToUse: ['Squaring 15, 25, 35...', 'Mental math trick', 'Quick calculations']
            },
            lattice: {
                name: 'Lattice Multiplication',
                origin: 'Medieval Islamic/European - 13th-14th Century',
                description: 'Grid-based visual multiplication.',
                whenToUse: ['Visual learners', 'Teaching structure', 'Organized approach']
            },
            russianPeasant: {
                name: 'Russian Peasant',
                origin: 'Ancient Egyptian - 1650 BCE (Rhind Papyrus)',
                description: 'Doubling and halving method.',
                whenToUse: ['No multiplication tables', 'Binary understanding', 'Computer-like thinking']
            },
            abacus: {
                name: 'Abacus Methods',
                origin: 'Chinese (Suanpan) - ~200 BCE, Japanese (Soroban) - ~1600 CE',
                description: 'Ancient calculating tools using bead manipulation.',
                whenToUse: ['Physical/virtual abacus', 'Competitive calculation', 'Building number sense']
            },
            karatsuba: {
                name: 'Karatsuba Algorithm',
                origin: 'Russian (Anatoly Karatsuba) - 1960',
                description: 'First fast multiplication algorithm using divide and conquer.',
                whenToUse: ['Large numbers (100+ digits)', 'Computer implementations', 'Cryptography']
            },
            longDivision: {
                name: 'Long Division',
                origin: 'Universal - Ancient origins',
                description: 'Step-by-step division method.',
                whenToUse: ['General division', 'Learning basics', 'Finding remainders']
            },
            vedicParavartya: {
                name: 'Vedic Paravartya',
                origin: 'Indian (Vedic) - ~500 CE',
                description: 'Transpose and adjust division.',
                whenToUse: ['Divisors near powers of 10', 'Mental division', 'Numbers like 12, 21, 98']
            },
            synthetic: {
                name: 'Synthetic Division',
                origin: 'Western Mathematics - Early 20th Century',
                description: 'Shortcut for polynomial division.',
                whenToUse: ['Polynomial division', 'Finding roots', 'Algebra class']
            },
            nonRestoring: {
                name: 'Non-Restoring Division',
                origin: 'Computer Science - 1950s',
                description: 'Binary division without restoring the partial remainder.',
                whenToUse: ['Computer hardware', 'Digital systems', 'Understanding processors']
            },
            newtonRaphson: {
                name: 'Newton-Raphson',
                origin: 'British (Isaac Newton, Joseph Raphson) - 1670s',
                description: 'Iterative method for finding square roots and other functions.',
                whenToUse: ['Square roots', 'Approximations', 'Scientific computing']
            }
        };

        const info = methodInfo[this.currentMethod] || {
            name: this.currentMethod,
            origin: 'Various',
            description: 'A calculation method.',
            whenToUse: ['General calculations']
        };

        infoPanel.innerHTML = `
            <div class="method-info-header">
                <span class="method-icon-large">${this.getMethodIcon(this.currentMethod)}</span>
                <h3>${info.name}</h3>
            </div>
            <div class="origin">
                <strong>Origin:</strong> ${info.origin}
            </div>
            <div class="when-to-use">
                <strong>Best for:</strong>
                <ul>${info.whenToUse.map(w => `<li>${w}</li>`).join('')}</ul>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ArithmeticAlgorithmsGame();
});
