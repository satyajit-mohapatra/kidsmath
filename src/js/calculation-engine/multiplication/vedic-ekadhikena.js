(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'vedicEkadhikena',
    name: 'Vedic Ekadhikena Purvena',
    category: MethodCategory.VEDIC,
    difficulty: DifficultyLevel.BEGINNER,
    displayOrder: 4,
    origin: {
        culture: 'Indian (Vedic Mathematics)',
        timePeriod: 'Ancient - ~500 CE',
        description: 'From the "Ekadhikena Purvena" sutra meaning "By one more than the previous one", a lightning-fast technique for squaring numbers ending in 5.'
    },
    whenToUse: [
        'Squaring any number ending in 5 (15, 25, 35, 45, ...)',
        'Mental math for quick calculations',
        'Impressing friends with math tricks',
        'Building pattern recognition'
    ],
    advantages: [
        'Instant calculation - no multiplication needed',
        'Extremely fast for applicable cases',
        'Easy to learn and remember',
        'Works for any size number ending in 5'
    ],
    disadvantages: [
        'Only works for squaring numbers ending in 5',
        'Limited to a specific case',
        'Not a general multiplication method'
    ],
    speedRating: 'instant',
    mathPrinciple: 'For (10a + 5)²: multiply a by (a+1) and append 25',
    relatedMethods: ['gradeSchool', 'vedicNikhilam']
});

function calculate(num) {
    const steps = [];
    const n = Math.abs(num);
    const str = n.toString();
    
    if (parseInt(str[str.length - 1]) !== 5) {
        throw new Error('Ekadhikena only works for numbers ending in 5');
    }

    const prefixStr = str.slice(0, -1);
    const prefix = prefixStr === '' ? 0 : parseInt(prefixStr);
    const next = prefix + 1;
    const product = prefix * next;
    const result = parseInt(product.toString() + '25');

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Ekadhikena Purvena',
        description: 'Square a number ending in 5',
        calculation: `${num}²`,
        result: { num },
        explanation: 'This Vedic method squares numbers ending in 5 in a single step!'
    }));

    steps.push(createStep({
        stepNumber: 2,
        type: StepType.CALCULATION,
        title: 'Take All Digits Except the Final 5',
        description: `Extract the prefix: ${str.slice(0, -1) || '0'}`,
        calculation: `Prefix = ${prefix}`,
        result: { prefix },
        explanation: 'Take all digits except the last digit (5).'
    }));

    steps.push(createStep({
        stepNumber: 3,
        type: StepType.CALCULATION,
        title: 'Add One to the Prefix',
        description: `Calculate ${prefix} + 1`,
        calculation: `${prefix} + 1 = ${next}`,
        result: { next },
        explanation: 'Add 1 to the prefix number. This is the "one more than" step.'
    }));

    steps.push(createStep({
        stepNumber: 4,
        type: StepType.MULTIPLY,
        title: 'Multiply Prefix by (Prefix + 1)',
        description: `Calculate ${prefix} × ${next}`,
        calculation: `${prefix} × ${next} = ${product}`,
        result: { product },
        explanation: 'Multiply the prefix by (prefix + 1). This is the only multiplication needed!'
    }));

    steps.push(createStep({
        stepNumber: 5,
        type: StepType.RESULT,
        title: 'Append 25',
        description: `Combine: ${product} + "25"`,
        calculation: `${product} followed by 25 = ${result}`,
        result: result,
        explanation: `Simply append "25" to the product. ${product}25 = ${result}.`
    }));

    steps.push(createStep({
        stepNumber: 6,
        type: StepType.INFO,
        title: 'Verification',
        description: 'Check the result',
        calculation: `${num} × ${num} = ${num * num}`,
        verification: { expected: num * num, correct: result === num * num },
        explanation: 'This trick always works because of the algebraic identity (10a + 5)² = 100a(a+1) + 25.'
    }));

    return createCalculationResult({
        method: 'vedicEkadhikena',
        methodName: 'Vedic Ekadhikena Purvena',
        num1: num,
        num2: num,
        steps,
        finalAnswer: result,
        timeComplexity: 'O(1)',
        recommendedUse: 'Squaring numbers ending in 5 (15², 25², 35², etc.)',
        alternative: 'Standard Multiplication for squaring other numbers',
        verification: { expected: num * num, correct: result === num * num }
    });
}

function calculatePair(num1, num2) {
    return calculate(num1 * num2);
}

function getExample() {
    return {
        num1: 25,
        num2: 25,
        description: 'Square 25: 2×3=6, append 25 → 625'
    };
}

function validateInput(num1, num2) {
    if (num1 !== num2) {
        return {
            valid: false,
            message: 'Ekadhikena is specifically for squaring. Use another method for general multiplication.'
        };
    }
    const lastDigit = Math.abs(num1).toString().slice(-1);
    if (lastDigit !== '5') {
        return {
            valid: false,
            message: 'Ekadhikena only works for numbers ending in 5 (15, 25, 35, 45, ...). Try a different method.'
        };
    }
    return {
        valid: true,
        message: 'Perfect for this Vedic trick!'
    };
}

const VedicEkadhikena = {
    METHOD_METADATA,
    calculate,
    calculatePair,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) { module.exports = VedicEkadhikena; }
global.VedicEkadhikena = VedicEkadhikena;

})(typeof window !== 'undefined' ? window : this);
