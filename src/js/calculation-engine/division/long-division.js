(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'longDivision',
    name: 'Long Division',
    category: MethodCategory.STANDARD,
    difficulty: DifficultyLevel.ELEMENTARY,
    displayOrder: 1,
    origin: {
        culture: 'Universal',
        timePeriod: 'Ancient - Refined in Medieval Europe',
        description: 'The standard step-by-step division method taught in schools worldwide, developed from Hindu-Arabic arithmetic traditions.'
    },
    whenToUse: [
        'Any division problem',
        'Learning division fundamentals',
        'Finding exact quotients and remainders',
        'General purpose calculations'
    ],
    advantages: [
        'Works for any numbers',
        'Clear step-by-step process',
        'Shows quotient and remainder',
        'Universally understood'
    ],
    disadvantages: [
        'Estimation can be challenging',
        'Many steps for large numbers',
        'Error-prone without practice'
    ],
    speedRating: 'medium',
    mathPrinciple: 'Repeated subtraction through digit-by-digit quotient estimation',
    relatedMethods: ['vedicParavartya', 'synthetic']
});

function calculate(dividend, divisor) {
    const steps = [];
    
    if (divisor === 0) {
        throw new Error('Division by zero is not allowed');
    }

    const isNegative = (dividend < 0) !== (divisor < 0);
    const absDividend = Math.abs(dividend);
    const absDivisor = Math.abs(divisor);
    const quotientStr = absDividend.toString();
    const divisorStr = absDivisor.toString();

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INPUT,
        title: 'Set Up Long Division',
        description: `${dividend} ÷ ${divisor}`,
        calculation: `${absDividend} ÷ ${absDivisor}`,
        result: { dividend: absDividend, divisor: absDivisor },
        explanation: 'Set up the division problem with the divisor outside and dividend inside the division bracket.'
    }));

    let current = 0;
    let quotient = 0;
    let remainder = 0;
    const workingDigits = [];
    let tempDividend = '';

    for (let i = 0; i < quotientStr.length; i++) {
        tempDividend += quotientStr[i];
        const currentVal = parseInt(tempDividend);
        
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.BRING_DOWN,
            title: `Step ${i + 1}: Bring Down Digit`,
            description: `Current value: ${currentVal}`,
            calculation: `Bring down ${quotientStr[i]}: ${tempDividend}`,
            result: { currentValue: currentVal, digit: parseInt(quotientStr[i]) },
            position: i,
            explanation: `We consider ${currentVal} to see how many times ${absDivisor} goes into it.`
        }));

        if (currentVal < absDivisor && i < quotientStr.length - 1) {
            quotient = quotient * 10;
            workingDigits.push({ dividend: currentVal, quotientDigit: 0, product: 0, remainder: currentVal });
            
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.DIVIDE,
                title: `Estimate Quotient Digit`,
                description: `${absDivisor} > ${currentVal}, quotient digit is 0`,
                calculation: `${absDivisor} > ${currentVal}, try next digit`,
                result: { quotientDigit: 0 },
                explanation: `${absDivisor} doesn't go into ${currentVal}, so the quotient digit is 0.`
            }));
            continue;
        }

        const qDigit = Math.floor(currentVal / absDivisor);
        const product = qDigit * absDivisor;
        const newRemainder = currentVal - product;

        quotient = quotient * 10 + qDigit;
        workingDigits.push({ dividend: currentVal, quotientDigit: qDigit, product, remainder: newRemainder });

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.DIVIDE,
            title: `Find Quotient Digit`,
            description: `How many times does ${absDivisor} go into ${currentVal}?`,
            calculation: `${currentVal} ÷ ${absDivisor} = ${qDigit}`,
            result: { quotientDigit: qDigit },
            explanation: `${absDivisor} × ${qDigit} = ${product}, which is the largest multiple not exceeding ${currentVal}.`
        }));

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.MULTIPLY,
            title: `Multiply Divisor by Quotient Digit`,
            description: `Calculate ${absDivisor} × ${qDigit}`,
            calculation: `${absDivisor} × ${qDigit} = ${product}`,
            result: { product },
            explanation: `This is the amount we'll subtract from ${currentVal}.`
        }));

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.SUBTRACT,
            title: 'Subtract',
            description: `Subtract product from current value`,
            calculation: `${currentVal} - ${product} = ${newRemainder}`,
            result: { remainder: newRemainder },
            explanation: `After subtracting, we have a remainder of ${newRemainder}.`
        }));

        tempDividend = newRemainder.toString();
    }

    remainder = parseInt(tempDividend) || 0;

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Result',
        description: `Quotient: ${quotient}, Remainder: ${remainder}`,
        calculation: `${absDividend} ÷ ${absDivisor} = ${quotient} R${remainder}`,
        result: { quotient, remainder },
        explanation: `The division of ${absDividend} by ${absDivisor} gives quotient ${quotient} with remainder ${remainder}.`
    }));

    if (remainder === 0) {
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.INFO,
            title: 'Exact Division',
            description: 'Remainder is 0',
            calculation: `${absDividend} ÷ ${absDivisor} = ${isNegative ? -quotient : quotient}`,
            result: isNegative ? -quotient : quotient,
            explanation: `${absDivisor} divides ${absDividend} evenly!`
        }));
    }

    return createCalculationResult({
        method: 'longDivision',
        methodName: 'Long Division',
        num1: dividend,
        num2: divisor,
        divisor,
        dividend,
        steps,
        finalAnswer: isNegative ? -quotient : quotient,
        timeComplexity: 'O(n)',
        recommendedUse: 'General purpose division for any numbers',
        alternative: 'Vedic Paravartya for numbers near powers of 10',
        verification: { expected: { quotient: Math.floor(absDividend / absDivisor), remainder: absDividend % absDivisor }, correct: true }
    });
}

function getExample() {
    return {
        dividend: 456,
        divisor: 12,
        description: 'Classic long division: 456 ÷ 12 = 38'
    };
}

function validateInput(dividend, divisor) {
    if (divisor === 0) {
        return { valid: false, message: 'Division by zero is not allowed.' };
    }
    return { valid: true, message: '' };
}

const LongDivision = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LongDivision;
}
global.LongDivision = LongDivision;
})(typeof window !== 'undefined' ? window : this);
