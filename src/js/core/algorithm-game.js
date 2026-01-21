class AlgorithmGame extends BaseGame {
    constructor(operation) {
        super(operation);
        this.currentMethod = 'standard';
        this.currentCalculation = null;
        this.stepIndex = 0;
        this.isPlaying = false;
        this.autoPlaySteps = false;
        this.stepDelay = 1500;
        
        this.operations = {
            addition: {
                name: 'Addition',
                icon: '+',
                methods: ['standard', 'kahan', 'carryLookahead']
            },
            subtraction: {
                name: 'Subtraction',
                icon: '−',
                methods: ['standard', 'twosComplement']
            },
            multiplication: {
                name: 'Multiplication',
                icon: '×',
                methods: ['gradeSchool', 'vedicNikhilam', 'vedicUrdhvaTiryak', 'vedicEkadhikena', 'lattice', 'russianPeasant', 'abacus', 'karatsuba']
            },
            division: {
                name: 'Division',
                icon: '÷',
                methods: ['longDivision', 'vedicParavartya', 'synthetic', 'nonRestoring', 'newtonRaphson']
            }
        };
    }

    init() {
        this.loadCalculationEngine();
        this.setupEventListeners();
        this.generateProblem();
    }

    loadCalculationEngine() {
        this.engine = window.CalculationEngine || {
            AdditionMethods: {},
            SubtractionMethods: {},
            MultiplicationMethods: {},
            DivisionMethods: {}
        };
    }

    setupEventListeners() {
        this.setupOperationButtons();
        this.setupMethodButtons();
        this.setupNavigationButtons();
        this.setupPlaybackControls();
        super.setupAnswerHandlers();
    }

    setupOperationButtons() {
        const operationBtns = document.querySelectorAll('.operation-btn');
        operationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                operationBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.operation = e.target.dataset.operation;
                this.currentMethod = this.operations[this.operation].methods[0];
                this.updateMethodButtons();
                this.generateProblem();
            });
        });
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
                this.generateProblem();
            }
        });
    }

    setupNavigationButtons() {
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const playBtn = document.getElementById('playStepsBtn');
        const resetBtn = document.getElementById('resetStepsBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        if (playBtn) playBtn.addEventListener('click', () => this.togglePlaySteps());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetSteps());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.disabled) {
                this.previousStep();
            } else if (e.key === 'ArrowRight' && nextBtn && !nextBtn.disabled) {
                this.nextStep();
            } else if (e.key === ' ') {
                if (playBtn) this.togglePlaySteps();
                e.preventDefault();
            }
        });
    }

    setupPlaybackControls() {
        const speedSlider = document.getElementById('stepSpeed');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.stepDelay = 3000 - e.target.value * 500;
            });
        }
    }

    updateMethodButtons() {
        const container = document.getElementById('methodButtons');
        if (!container) return;
        
        container.innerHTML = '';
        const methods = this.operations[this.operation].methods;
        
        methods.forEach(methodId => {
            const method = this.getMethodInfo(methodId);
            const btn = document.createElement('button');
            btn.className = 'method-btn' + (methodId === this.currentMethod ? ' active' : '');
            btn.dataset.method = methodId;
            btn.innerHTML = `
                <span class="method-icon">${this.getMethodIcon(methodId)}</span>
                <span class="method-name">${method.name}</span>
                <span class="method-difficulty">${'⭐'.repeat(method.difficulty)}</span>
            `;
            btn.title = method.origin.culture;
            container.appendChild(btn);
        });
    }

    getMethodInfo(methodId) {
        const module = this.getMethodModule(methodId);
        return module?.METHOD_METADATA || {
            name: methodId,
            difficulty: 1,
            origin: { culture: '', timePeriod: '' },
            whenToUse: [],
            advantages: [],
            speedRating: 'medium'
        };
    }

    getMethodModule(methodId) {
        const operationModules = {
            addition: this.engine.AdditionMethods,
            subtraction: this.engine.SubtractionMethods,
            multiplication: this.engine.MultiplicationMethods,
            division: this.engine.DivisionMethods
        };
        return operationModules[this.operation]?.[methodId];
    }

    getMethodIcon(methodId) {
        const icons = {
            standard: '📐',
            kahan: '🔢',
            carryLookahead: '⚡',
            twosComplement: '🔄',
            gradeSchool: '✏️',
            vedicNikhilam: '🧘',
            vedicUrdhvaTiryak: '➗',
            vedicEkadhikena: '✨',
            lattice: '📊',
            russianPeasant: '🌾',
            abacus: '🔮',
            karatsuba: '🚀',
            longDivision: '📏',
            vedicParavartya: '🔃',
            nonRestoring: '⚙️',
            newtonRaphson: '🔺',
            synthetic: '📈'
        };
        return icons[methodId] || '🔸';
    }

    updateMethodInfo() {
        const infoPanel = document.getElementById('methodInfo');
        if (!infoPanel) return;
        
        const method = this.getMethodInfo(this.currentMethod);
        infoPanel.innerHTML = `
            <div class="method-info-header">
                <span class="method-icon-large">${this.getMethodIcon(this.currentMethod)}</span>
                <h3>${method.name}</h3>
            </div>
            <div class="method-meta">
                <span class="difficulty">Difficulty: ${'⭐'.repeat(method.difficulty)}</span>
                <span class="speed">Speed: ${method.speedRating}</span>
            </div>
            <div class="origin">
                <strong>Origin:</strong> ${method.origin.culture} (${method.origin.timePeriod})
            </div>
            <div class="when-to-use">
                <strong>Best for:</strong>
                <ul>${method.whenToUse.map(w => `<li>${w}</li>`).join('')}</ul>
            </div>
            <div class="principle">
                <strong>Math Principle:</strong> ${method.mathPrinciple || 'See explanation panel'}
            </div>
        `;
    }

    generateProblem() {
        const method = this.getMethodModule(this.currentMethod);
        const example = method?.getExample() || this.getDefaultExample();
        
        const num1 = this.randomNumber(example.min || 10, example.max || 99);
        const num2 = example.min2 !== undefined 
            ? this.randomNumber(example.min2, example.max2 || 99)
            : this.randomNumber(10, 99);

        this.inputNumbers = { num1, num2 };
        
        if (this.currentMethod === 'vedicEkadhikena') {
            this.currentCalculation = method.calculate(num1 * num2);
        } else if (this.operation === 'division') {
            const divisor = num2;
            const dividend = num1 * num2;
            this.currentCalculation = method.calculate(dividend, divisor);
        } else {
            this.currentCalculation = method.calculate(num1, num2);
        }

        this.stepIndex = 0;
        this.displayInput();
        this.displayCurrentStep();
    }

    getDefaultExample() {
        return { min: 10, max: 99, description: 'Generate random numbers' };
    }

    displayInput() {
        const inputArea = document.getElementById('inputDisplay');
        if (!inputArea) return;
        
        const { num1, num2 } = this.inputNumbers;
        const op = this.operations[this.operation].icon;
        
        if (this.currentMethod === 'vedicEkadhikena') {
            inputArea.innerHTML = `
                <div class="input-numbers">
                    <span class="number">${num1}</span>
                    <span class="operator">×</span>
                    <span class="number">${num2}</span>
                    <span class="equals">=</span>
                </div>
            `;
        } else if (this.operation === 'division') {
            const result = this.currentCalculation?.finalAnswer;
            inputArea.innerHTML = `
                <div class="input-numbers">
                    <span class="number">${result?.dividend || num1 * num2}</span>
                    <span class="operator">÷</span>
                    <span class="number">${result?.divisor || num2}</span>
                    <span class="equals">=</span>
                </div>
            `;
        } else {
            inputArea.innerHTML = `
                <div class="input-numbers">
                    <span class="number">${num1}</span>
                    <span class="operator">${op}</span>
                    <span class="number">${num2}</span>
                    <span class="equals">=</span>
                </div>
            `;
        }
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
                    ${step.visualization ? this.renderVisualization(step.visualization) : ''}
                </div>
            `;
        }

        this.updateNavigationState();
    }

    renderVisualization(visualization) {
        if (!visualization) return '';
        
        let html = '<div class="step-visualization">';
        
        if (visualization.type === 'lattice_setup') {
            html += '<div class="lattice-visualization">Lattice Grid Setup</div>';
        } else if (visualization.type === 'peasant_table') {
            html += '<div class="peasant-visualization">Doubling Table</div>';
        } else if (visualization.type === 'abacus_setup') {
            html += '<div class="abacus-visualization">Abacus Setup</div>';
        } else if (visualization.type === 'synthetic_setup') {
            html += '<div class="synthetic-visualization">Synthetic Division Setup</div>';
        } else if (visualization.type === 'urdhva_setup') {
            html += '<div class="urdhva-visualization">Urdhva Tiryak Setup</div>';
        }
        
        html += '</div>';
        return html;
    }

    nextStep() {
        if (this.stepIndex < this.currentCalculation.steps.length) {
            this.stepIndex++;
            this.displayCurrentStep();
        }
    }

    previousStep() {
        if (this.stepIndex > 0) {
            this.stepIndex--;
            this.displayCurrentStep();
        }
    }

    togglePlaySteps() {
        this.autoPlaySteps = !this.autoPlaySteps;
        const btn = document.getElementById('playStepsBtn');
        if (btn) {
            btn.textContent = this.autoPlaySteps ? '⏸️ Pause' : '▶️ Play Steps';
        }
        
        if (this.autoPlaySteps) {
            this.playSteps();
        }
    }

    playSteps() {
        if (!this.autoPlaySteps) return;
        
        if (this.stepIndex < this.currentCalculation.steps.length) {
            this.nextStep();
            setTimeout(() => this.playSteps(), this.stepDelay);
        } else {
            this.autoPlaySteps = false;
            const btn = document.getElementById('playStepsBtn');
            if (btn) btn.textContent = '▶️ Play Steps';
        }
    }

    resetSteps() {
        this.stepIndex = 0;
        this.autoPlaySteps = false;
        const btn = document.getElementById('playStepsBtn');
        if (btn) btn.textContent = '▶️ Play Steps';
        this.displayCurrentStep();
    }

    updateNavigationState() {
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const progress = document.getElementById('stepProgress');
        
        if (prevBtn) prevBtn.disabled = this.stepIndex === 0;
        if (nextBtn) nextBtn.disabled = this.stepIndex >= this.currentCalculation.steps.length;
        
        if (progress) {
            const total = this.currentCalculation.steps.length;
            progress.textContent = `Step ${this.stepIndex + 1} of ${total}`;
        }
    }

    showFinalAnswer() {
        const stepArea = document.getElementById('stepDisplay');
        const result = this.currentCalculation.finalAnswer;
        
        if (stepArea) {
            stepArea.innerHTML = `
                <div class="final-answer">
                    <div class="answer-label">Final Answer</div>
                    <div class="answer-value">${result}</div>
                    ${this.currentCalculation.verification ? `
                        <div class="verification">
                            ✓ Correct! ${this.currentCalculation.inputs.num1} ${this.getOperationSymbol()} ${this.currentCalculation.inputs.num2} = ${result}
                        </div>
                    ` : ''}
                </div>
            `;
        }
    }

    getOperationSymbol() {
        const symbols = {
            addition: '+',
            subtraction: '−',
            multiplication: '×',
            division: '÷'
        };
        return symbols[this.operation] || '=';
    }

    showMethodExplanation() {
        const panel = document.getElementById('methodExplanation');
        if (!panel) return;
        
        const method = this.getMethodInfo(this.currentMethod);
        panel.innerHTML = `
            <h3>${method.name}</h3>
            <div class="explanation-content">
                <h4>How It Works</h4>
                <p>${method.mathPrinciple}</p>
                
                <h4>Origin & History</h4>
                <p><strong>${method.origin.culture}</strong> - ${method.origin.timePeriod}</p>
                <p>${method.origin.description}</p>
                
                <h4>When to Use</h4>
                <ul>${method.whenToUse.map(w => `<li>${w}</li>`).join('')}</ul>
                
                <h4>Advantages</h4>
                <ul>${method.advantages.map(a => `<li>${a}</li>`).join('')}</ul>
            </div>
        `;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlgorithmGame;
}
