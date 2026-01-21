(function(global) {
'use strict';

const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'twosComplement',
    name: 'Two\'s Complement',
    category: MethodCategory.COMPUTER,
    difficulty: DifficultyLevel.ADVANCED,
    displayOrder: 2,
    origin: {
        culture: 'Universal (Computer Science)',
        timePeriod: '1940s-1950s',
        description: 'Standard method for representing signed integers in modern computers, enabling subtraction through addition using bit manipulation.'
    },
    whenToUse: [
        'Understanding computer arithmetic',
        'Working with binary numbers',
        'Learning how processors subtract',
        'Signed number representation'
    ],
    advantages: [
        'Eliminates need for separate subtraction circuits',
        'Single representation for zero',
        'Efficient hardware implementation',
        'Natural handling of signed numbers'
    ],
    disadvantages: [
        'Confusing for manual calculation',
        'Requires understanding of binary arithmetic',
        'Limited range for fixed bit widths'
    ],
    speedRating: 'fast',
    mathPrinciple: 'Subtraction becomes addition by negating the subtrahend (flip bits + 1) and adding',
    relatedMethods: ['standard']
});

function calculate(num1, num2) {
    const steps = [];
    
    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Two\'s Complement Subtraction',
        description: 'Convert subtraction to addition by negating the second number',
        calculation: `${num1} - ${num2} = ${num1} + (-${num2})`,
        explanation: 'Computers only have addition circuits, so they subtract by adding the negated value.'
    }));

    const bitWidth = 8;
    const num1Binary = toBinary(num1, bitWidth);
    const num2Binary = toBinary(num2, bitWidth);

    steps.push(createStep({
        stepNumber: 2,
        type: StepType.BINARY_OPERATION,
        title: 'Convert to Binary',
        description: 'Represent both numbers in binary',
        calculation: `${num1} = ${num1Binary}, ${num2} = ${num2Binary}`,
        result: { num1: num1Binary, num2: num2Binary },
        explanation: 'We use 8-bit representation for this example. Real computers use 32 or 64 bits.'
    }));

    const flippedNum2 = flipBits(num2Binary);

    steps.push(createStep({
        stepNumber: 3,
        type: StepType.BINARY_OPERATION,
        title: 'Flip All Bits',
        description: 'Invert each bit of the subtrahend (1\'s complement)',
        calculation: `Flip ${num2Binary} → ${flippedNum2}`,
        result: { flipped: flippedNum2 },
        explanation: 'Flipping 0 to 1 and 1 to 0 gives the 1\'s complement.'
    }));

    const onesComplement = flippedNum2;
    let twosComplement = '';
    let carry = 1;
    
    for (let i = flippedNum2.length - 1; i >= 0; i--) {
        const bit = parseInt(flippedNum2[i]);
        const sum = bit + carry;
        twosComplement = (sum % 2) + twosComplement;
        carry = Math.floor(sum / 2);
    }

    steps.push(createStep({
        stepNumber: 4,
        type: StepType.BINARY_OPERATION,
        title: 'Add 1 (2\'s Complement)',
        description: 'Add 1 to get the true negative representation',
        calculation: `${flippedNum2} + 1 = ${twosComplement}`,
        result: { twosComplement },
        explanation: 'Adding 1 to the 1\'s complement gives the 2\'s complement, which represents -2 in binary.'
    }));

    steps.push(createStep({
        stepNumber: 5,
        type: StepType.BINARY_OPERATION,
        title: 'Add to First Number',
        description: 'Add the two\'s complement to perform subtraction',
        calculation: `${num1Binary} + ${twosComplement}`,
        result: { num1: num1Binary, subtrahend: twosComplement },
        explanation: 'Now we simply add! This gives us the result as if we subtracted.'
    }));

    const result = num1 - num2;
    const resultBinary = toBinary(result, bitWidth);

    steps.push(createStep({
        stepNumber: 6,
        type: StepType.BINARY_OPERATION,
        title: 'Interpret Result',
        description: 'Convert binary result back to decimal',
        calculation: `${num1Binary} + ${twosComplement} = ${resultBinary} = ${result}`,
        result: { binary: resultBinary, decimal: result },
        explanation: `The binary result ${resultBinary} represents the decimal value ${result}.`
    }));

    if (result < 0) {
        steps.push(createStep({
            stepNumber: 7,
            type: StepType.INFO,
            title: 'Negative Result Handling',
            description: 'For negative results, interpret as 2\'s complement',
            calculation: `Result is negative: ${resultBinary} = -${Math.abs(result)}`,
            explanation: 'When the result has a leading 1 in signed interpretation, it represents a negative number.'
        }));
    }

    return createCalculationResult({
        method: 'twosComplement',
        methodName: 'Two\'s Complement Subtraction',
        num1,
        num2,
        steps,
        finalAnswer: result,
        timeComplexity: 'O(n)',
        recommendedUse: 'Understanding computer arithmetic and signed number representation',
        alternative: 'Standard Subtraction for hand calculation',
        verification: { expected: num1 - num2, correct: result === num1 - num2 }
    });
}

function toBinary(num, bitWidth) {
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    let binary = '';
    let temp = absNum;
    
    for (let i = 0; i < bitWidth; i++) {
        binary = (temp % 2) + binary;
        temp = Math.floor(temp / 2);
    }
    
    if (isNegative) {
        let flipped = '';
        for (let i = 0; i < binary.length; i++) {
            flipped += binary[i] === '0' ? '1' : '0';
        }
        let carry = 1;
        let result = '';
        for (let i = flipped.length - 1; i >= 0; i--) {
            const bit = parseInt(flipped[i]);
            const sum = bit + carry;
            result = (sum % 2) + result;
            carry = Math.floor(sum / 2);
        }
        binary = result;
    }
    
    return binary;
}

function flipBits(binary) {
    let result = '';
    for (let i = 0; i < binary.length; i++) {
        result += binary[i] === '0' ? '1' : '0';
    }
    return result;
}

function getExample() {
    return {
        num1: 15,
        num2: 3,
        description: 'Binary: 00001111 - 00000011, demonstrates subtraction via addition'
    };
}

function validateInput(num1, num2) {
    const bitWidth = 8;
    const minVal = -(Math.pow(2, bitWidth - 1));
    const maxVal = Math.pow(2, bitWidth - 1) - 1;
    const result = num1 - num2;
    
    if (result < minVal || result > maxVal) {
        return {
            valid: false,
            message: `Result ${result} is outside the representable range for ${bitWidth}-bit signed integers (${minVal} to ${maxVal})`
        };
    }
    return {
        valid: true,
        message: 'Two\'s complement is primarily a computer method, not practical for manual calculation.'
    };
}

const TwosComplement = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput,
    toBinary,
    flipBits
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TwosComplement;
}

global.TwosComplement = TwosComplement;

})(typeof window !== 'undefined' ? window : this);
