(function(global) {
    'use strict';

    const StepType = {
        INPUT: 'input',
        CALCULATION: 'calculation',
        CARRY: 'carry',
        BORROW: 'borrow',
        PARTIAL_PRODUCT: 'partial_product',
        ADD_DIAGONAL: 'add_diagonal',
        SHIFT: 'shift',
        DIVIDE: 'divide',
        MULTIPLY: 'multiply',
        SUBTRACT: 'subtract',
        BRING_DOWN: 'bring_down',
        REMAINDER: 'remainder',
        RESULT: 'result',
        ANIMATION: 'animation',
        BINARY_OPERATION: 'binary_operation',
        VISUALIZATION: 'visualization',
        INFO: 'info'
    };

    const MethodCategory = {
        STANDARD: 'standard',
        VEDIC: 'vedic',
        ANCIENT: 'ancient',
        COMPUTER: 'computer',
        SPECIALIZED: 'specialized'
    };

    const DifficultyLevel = {
        BEGINNER: 1,
        ELEMENTARY: 2,
        INTERMEDIATE: 3,
        ADVANCED: 4,
        EXPERT: 5
    };

    const OperationType = {
        ADDITION: 'addition',
        SUBTRACTION: 'subtraction',
        MULTIPLICATION: 'multiplication',
        DIVISION: 'division'
    };

    function createStep(options) {
        return {
            stepNumber: options.stepNumber || 0,
            type: options.type || StepType.INFO,
            title: options.title || '',
            description: options.description || '',
            calculation: options.calculation || '',
            result: options.result || null,
            carry: options.carry || null,
            borrow: options.borrow || null,
            partialProduct: options.partialProduct || null,
            position: options.position || null,
            digit: options.digit || null,
            bits: options.bits || null,
            explanation: options.explanation || '',
            visualization: options.visualization || null,
            animationHint: options.animationHint || null
        };
    }

    function createMethodMetadata(options) {
        return {
            id: options.id,
            name: options.name,
            category: options.category,
            difficulty: options.difficulty,
            displayOrder: options.displayOrder || 0,
            origin: options.origin || {
                culture: '',
                timePeriod: '',
                description: ''
            },
            whenToUse: options.whenToUse || [],
            advantages: options.advantages || [],
            disadvantages: options.disadvantages || [],
            speedRating: options.speedRating || 'medium',
            mathPrinciple: options.mathPrinciple || '',
            relatedMethods: options.relatedMethods || []
        };
    }

    function createCalculationResult(options) {
        return {
            method: options.method,
            methodName: options.methodName,
            inputs: {
                num1: options.num1,
                num2: options.num2,
                divisor: options.divisor || null,
                dividend: options.dividend || null
            },
            steps: options.steps || [],
            finalAnswer: options.finalAnswer,
            timeComplexity: options.timeComplexity || 'O(n)',
            recommendedUse: options.recommendedUse || '',
            alternative: options.alternative || null,
            verification: options.verification || null
        };
    }

    const StepDataStructure = {
        StepType,
        MethodCategory,
        DifficultyLevel,
        OperationType,
        createStep,
        createMethodMetadata,
        createCalculationResult
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = StepDataStructure;
    }

    global.StepDataStructure = StepDataStructure;
    global.StepType = StepType;
    global.MethodCategory = MethodCategory;
    global.DifficultyLevel = DifficultyLevel;
    global.OperationType = OperationType;
    global.createStep = createStep;
    global.createMethodMetadata = createMethodMetadata;
    global.createCalculationResult = createCalculationResult;

})(typeof window !== 'undefined' ? window : this);
