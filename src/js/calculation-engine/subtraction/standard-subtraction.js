(function(global) {
'use strict';

const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'standard',
    name: 'Standard Subtraction',
    category: MethodCategory.STANDARD,
    difficulty: DifficultyLevel.BEGINNER,
    displayOrder: 1,
    origin: {
        culture: 'Universal',
        timePeriod: 'Ancient - Refined through Medieval Period',
        description: 'The borrowing method taught in schools worldwide, developed from Hindu-Arabic numeral traditions.'
    },
    whenToUse: [
        'Any subtraction problem',
        'Learning subtraction basics',
        'Quick mental math',
        'Everyday calculations'
    ],
    advantages: [
        'Simple and intuitive',
        'Works for any numbers',
        'Easy to understand and teach',
        'Universally understood'
    ],
    disadvantages: [
        'Multiple borrows can be confusing',
        'Can be error-prone with many digits'
    ],
    speedRating: 'medium',
    mathPrinciple: 'Place value subtraction with borrowing when needed',
    relatedMethods: ['twosComplement']
});

function calculate(num1, num2) {
    const steps = [];
    const larger = Math.max(num1, num2);
    const smaller = Math.min(num1, num2);
    const resultSign = num1 >= num2 ? 1 : -1;
    
    const absLarger = Math.abs(larger);
    const absSmaller = Math.abs(smaller);
    const maxDigits = Math.abs(num1).toString().length;
    const n1Str = absLarger.toString().padStart(maxDigits, '0');
    const n2Str = absSmaller.toString().padStart(maxDigits, '0');

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INPUT,
        title: 'Set Up Problem',
        description: `Write numbers aligned by place value: ${num1} - ${num2}`,
        calculation: `${num1} - ${num2}`,
        result: { num1: n1Str, num2: n2Str },
        explanation: 'Align the numbers by their rightmost digits. Subtract smaller from larger.'
    }));

    let result = 0;
    const borrowStack = [];

    for (let i = maxDigits - 1; i >= 0; i--) {
        const digit1 = parseInt(n1Str[i]);
        const digit2 = parseInt(n2Str[i]);
        const placeValue = Math.pow(10, maxDigits - 1 - i);
        const placeName = ['ones', 'tens', 'hundreds', 'thousands'][maxDigits - 1 - i] || `10^${maxDigits - 1 - i}`;

        let currentDigit = digit1;
        let needsBorrow = false;

        if (currentDigit < digit2) {
            needsBorrow = true;
            
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.BORROW,
                title: `Borrow for ${placeName}`,
                description: `Cannot subtract ${digit2} from ${currentDigit}, need to borrow`,
                calculation: `${digit1} < ${digit2}, borrow 1 (worth 10)`,
                borrow: { from: i + 1, to: i },
                position: i,
                digit: digit1,
                explanation: `Borrow 1 from the ${placeName}'s place, which equals 10 in the current place.`
            }));

            currentDigit += 10;
            
            let j = i - 1;
            while (j >= 0 && n1Str[j] === '0') {
                borrowStack.push(j);
                steps.push(createStep({
                    stepNumber: steps.length + 1,
                    type: StepType.BORROW,
                    title: 'Chain of Borrowing',
                    description: `Digit at position ${j} is 0, need to borrow further`,
                    calculation: `0 → 9, continue borrowing`,
                    borrow: { from: j, to: j + 1 },
                    position: j,
                    digit: 0,
                    explanation: 'When a digit is 0, it becomes 9 after borrowing, and we continue to the next digit.'
                }));
                j--;
            }

            if (j >= 0) {
                const prevDigit = parseInt(n1Str[j]);
                borrowStack.push(j);
                steps.push(createStep({
                    stepNumber: steps.length + 1,
                    type: StepType.BORROW,
                    title: 'Complete Borrowing Chain',
                    description: `Reduce digit at position ${j} by 1`,
                    calculation: `${prevDigit} → ${prevDigit - 1}`,
                    borrow: { from: j, to: j, reduction: 1 },
                    position: j,
                    digit: prevDigit,
                    explanation: `The digit at position ${j} decreases by 1, completing the borrow chain.`
                }));
            }
        }

        const difference = currentDigit - digit2;
        result += difference * placeValue;

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.CALCULATION,
            title: `Subtract ${placeName}`,
            description: `Calculate difference at ${placeName} place`,
            calculation: `${currentDigit} - ${digit2} = ${difference}`,
            result: { digit: difference, placeValue },
            explanation: `The difference at the ${placeName} place is ${difference}.`
        }));
    }

    if (resultSign < 0) {
        result = -result;
    }

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Answer',
        description: 'Combine all digits for the result',
        calculation: `${num1} - ${num2} = ${result}`,
        result: result,
        explanation: `The difference of ${num1} minus ${num2} is ${result}.`
    }));

    return createCalculationResult({
        method: 'standard',
        methodName: 'Standard Subtraction',
        num1,
        num2,
        steps,
        finalAnswer: result,
        timeComplexity: 'O(n)',
        recommendedUse: 'General purpose subtraction for any numbers',
        alternative: 'Two\'s Complement for computer operations',
        verification: { expected: num1 - num2, correct: result === num1 - num2 }
    });
}

function getExample() {
    return {
        num1: 342,
        num2: 157,
        description: 'Two 3-digit numbers requiring multiple borrows'
    };
}

function validateInput(num1, num2) {
    return {
        valid: true,
        message: ''
    };
}

const StandardSubtraction = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StandardSubtraction;
}

global.StandardSubtraction = StandardSubtraction;

})(typeof window !== 'undefined' ? window : this);
