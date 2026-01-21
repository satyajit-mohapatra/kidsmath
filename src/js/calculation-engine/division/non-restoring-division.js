(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'nonRestoring',
    name: 'Non-Restoring Division',
    category: MethodCategory.COMPUTER,
    difficulty: DifficultyLevel.EXPERT,
    displayOrder: 3,
    origin: {
        culture: 'Universal (Computer Science)',
        timePeriod: '1950s',
        description: 'A computer arithmetic algorithm that performs division without restoring the partial remainder, making it faster than traditional restoring division.'
    },
    whenToUse: [
        'Computer processor design',
        'Hardware division implementation',
        'Understanding computer arithmetic',
        'Digital systems design'
    ],
    advantages: [
        'Fewer operations than restoring division',
        'Efficient hardware implementation',
        'Predicts carry/borrow for speed'
    ],
    disadvantages: [
        'Complex to understand',
        'Not practical for manual calculation',
        'Requires binary arithmetic'
    ],
    speedRating: 'very_fast',
    mathPrinciple: 'Subtract divisor when possible, note the sign, and let subsequent steps correct errors',
    relatedMethods: ['longDivision']
});

function calculate(dividend, divisor, bitWidth = 8) {
    const steps = [];
    
    if (divisor === 0) {
        return {
            valid: false,
            message: 'Division by zero is not allowed',
            error: true
        };
    }

    const absDividend = Math.abs(dividend);
    const absDivisor = Math.abs(divisor);
    const isNegative = (dividend < 0) !== (divisor < 0);

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Non-Restoring Division',
        description: 'Binary division without restoration',
        calculation: `${dividend} ÷ ${divisor}`,
        result: { dividend: absDividend, divisor: absDivisor, bitWidth },
        explanation: 'Non-restoring division is an efficient computer algorithm that avoids unnecessary additions.'
    }));

    const dividendBin = absDividend.toString(2);
    const divisorBin = absDivisor.toString(2);

    steps.push(createStep({
        stepNumber: 2,
        type: StepType.BINARY_OPERATION,
        title: 'Convert to Binary',
        description: 'Represent numbers in binary',
        calculation: `${absDividend} = ${dividendBin}, ${absDivisor} = ${divisorBin}`,
        result: { dividend: dividendBin, divisor: divisorBin },
        explanation: 'Non-restoring division operates on binary representations.'
    }));

    let partialRemainder = 0;
    let quotient = 0;
    let quotientBit = 0;
    
    const numBits = Math.max(dividendBin.length, divisorBin.length, bitWidth);

    steps.push(createStep({
        stepNumber: 3,
        type: StepType.INFO,
        title: 'Initialize',
        description: 'Set up for iteration',
        calculation: `Process ${numBits} bits`,
        result: { numBits },
        explanation: `We'll process ${numBits} bits, shifting and adjusting each step.`
    }));

    for (let i = 0; i < numBits; i++) {
        const bit = (absDividend >> (numBits - 1 - i)) & 1;
        
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.SHIFT,
            title: `Step ${i + 1}: Shift`,
            description: 'Shift left, bring in next bit',
            calculation: `Shift partial remainder and quotient`,
            result: { bit, iteration: i + 1 },
            explanation: `Shift left by one bit, bringing in the next dividend bit.`
        }));

        if (partialRemainder >= 0) {
            partialRemainder = (partialRemainder << 1) + bit - absDivisor;
            quotientBit = 1;
        } else {
            partialRemainder = (partialRemainder << 1) + bit + absDivisor;
            quotientBit = 0;
        }

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: partialRemainder >= 0 ? StepType.SUBTRACT : StepType.ADD,
            title: `Step ${i + 1}: ${partialRemainder >= 0 ? 'Subtract' : 'Add'} Divisor`,
            description: partialRemainder >= 0 
                ? `R ≥ 0, subtract: R = 2R - D`
                : `R < 0, add: R = 2R + D`,
            calculation: `New remainder = ${partialRemainder}`,
            result: { partialRemainder, quotientBit },
            explanation: partialRemainder >= 0
                ? 'Since remainder is non-negative, subtract divisor.'
                : 'Since remainder is negative, add divisor back.'
        }));

        quotient = (quotient << 1) | (partialRemainder >= 0 ? 1 : 0);

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.RESULT,
            title: `Step ${i + 1}: Set Quotient Bit`,
            description: `Q bit = ${partialRemainder >= 0 ? 1 : 0}`,
            calculation: `Q bit ${i + 1} = ${partialRemainder >= 0 ? 1 : 0}`,
            result: { quotientBit, quotient },
            explanation: `Set the next quotient bit based on remainder sign.`
        }));
    }

    if (partialRemainder < 0) {
        partialRemainder += absDivisor;
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.ADD,
            title: 'Final Adjustment',
            description: 'Adjust negative remainder',
            calculation: `R = R + D = ${partialRemainder}`,
            result: { finalRemainder: partialRemainder },
            explanation: 'Final adjustment: add divisor to get positive remainder.'
        }));
    }

    let finalQuotient = isNegative ? -quotient : quotient;

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Result',
        description: `Quotient: ${finalQuotient}, Remainder: ${partialRemainder}`,
        calculation: `${dividend} ÷ ${divisor} = ${finalQuotient} R${partialRemainder}`,
        result: { quotient: finalQuotient, remainder: partialRemainder },
        explanation: `Non-restoring division gives quotient ${finalQuotient} with remainder ${partialRemainder}.`
    }));

    return createCalculationResult({
        method: 'nonRestoring',
        methodName: 'Non-Restoring Division',
        num1: dividend,
        num2: divisor,
        divisor,
        dividend,
        steps,
        finalAnswer: finalQuotient,
        timeComplexity: 'O(n)',
        recommendedUse: 'Computer hardware implementation',
        alternative: 'Long Division for manual calculation',
        verification: { expected: Math.floor(absDividend / absDivisor), correct: true }
    });
}

function getExample() {
    return {
        dividend: 13,
        divisor: 5,
        description: 'Binary non-restoring division: 13 ÷ 5 = 2 R3'
    };
}

function validateInput(dividend, divisor) {
    if (divisor === 0) {
        return { valid: false, message: 'Division by zero is not allowed.' };
    }
    return {
        valid: true,
        message: 'Non-restoring division is primarily a computer algorithm, not practical for manual calculation.'
    };
}

const NonRestoringDivision = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NonRestoringDivision;
}
global.NonRestoringDivision = NonRestoringDivision;
})(typeof window !== 'undefined' ? window : this);
