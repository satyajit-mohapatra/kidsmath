(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'vedicNikhilam',
    name: 'Vedic Nikhilam',
    category: MethodCategory.VEDIC,
    difficulty: DifficultyLevel.INTERMEDIATE,
    displayOrder: 2,
    origin: {
        culture: 'Indian (Vedic Mathematics)',
        timePeriod: 'Ancient - ~500 CE',
        description: 'From the ancient Vedic mathematical sutras of India, specifically the "Nikhilam Navatashcaramam Dashatah" sutra meaning "All from 9 and the last from 10".'
    },
    whenToUse: [
        'Numbers close to powers of 10 (10, 100, 1000, etc.)',
        'Mental math competitions',
        'Quick estimates and calculations',
        'Numbers in the 90s, 190s, 990s, etc.'
    ],
    advantages: [
        'Extremely fast for applicable numbers',
        'Reduces multiplications to subtractions',
        'Great for mental math',
        'Builds number sense'
    ],
    disadvantages: [
        'Only works well for numbers near powers of 10',
        'Less efficient for random numbers',
        'Requires practice for fluency'
    ],
    speedRating: 'fast',
    mathPrinciple: 'Instead of multiplying large numbers, subtract small deficits from base and multiply deficits together',
    relatedMethods: ['gradeSchool', 'vedicUrdhvaTiryak']
});

function calculate(num1, num2) {
    const steps = [];
    const n1 = Math.abs(num1);
    const n2 = Math.abs(num2);
    const isNegative = (num1 < 0) !== (num2 < 0);

    const base = findNearestBase(n1, n2);
    const deficit1 = base - n1;
    const deficit2 = base - n2;
    const isExcess1 = deficit1 < 0;
    const isExcess2 = deficit2 < 0;
    const absDeficit1 = Math.abs(deficit1);
    const absDeficit2 = Math.abs(deficit2);

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Choose Base',
        description: `Find the nearest power of 10: ${base}`,
        calculation: `Base = ${base}`,
        result: { base },
        explanation: `Both numbers are close to ${base}. The base is the nearest power of 10.`
    }));

    steps.push(createStep({
        stepNumber: 2,
        type: StepType.CALCULATION,
        title: 'Calculate Deficits/Excess',
        description: 'Find how far each number is from the base',
        calculation: `${n1} from ${base} = ${deficit1}, ${n2} from ${base} = ${deficit2}`,
        result: { deficit1, deficit2 },
        explanation: deficit1 >= 0 
            ? `${n1} is ${deficit1} below ${base} (deficit of ${deficit1})`
            : `${n1} is ${absDeficit1} above ${base} (excess of ${deficit1})`
    }));

    let leftPart;
    if (isExcess1 && isExcess2) {
        leftPart = n1 + absDeficit2;
    } else if (!isExcess1 && !isExcess2) {
        leftPart = n1 - absDeficit2;
    } else {
        leftPart = n1 + deficit2;
    }

    steps.push(createStep({
        stepNumber: 3,
        type: StepType.CALCULATION,
        title: 'Cross Subtract/Add',
        description: isExcess1 || isExcess2 
            ? 'Add the excess to the other number'
            : 'Subtract the deficit from the other number',
        calculation: `${n1} ${isExcess1 || isExcess2 ? '+' : '-'} (${Math.abs(deficit2)}) = ${leftPart}`,
        result: { leftPart },
        explanation: 'This is the "left part" of the answer. Cross subtract/add one deficit from the other number.'
    }));

    const rightPart = absDeficit1 * absDeficit2;
    const rightPartStr = rightPart.toString().padStart(base.toString().length - 1, '0');

    steps.push(createStep({
        stepNumber: 4,
        type: StepType.CALCULATION,
        title: 'Multiply Deficits',
        description: 'Multiply the two deficits together',
        calculation: `${absDeficit1} × ${absDeficit2} = ${rightPart}`,
        result: { rightPart },
        explanation: 'This is the "right part" of the answer. The number of digits equals the number of zeros in the base minus 1.'
    }));

    let result;
    if (rightPartStr.length <= (base.toString().length - 1)) {
        result = leftPart * base + rightPart;
    } else {
        const carry = Math.floor(rightPart / base);
        const finalRight = rightPart % base;
        result = (leftPart + carry) * base + finalRight;
        steps.push(createStep({
            stepNumber: 5,
            type: StepType.CALCULATION,
            title: 'Handle Overflow',
            description: 'Right part exceeds base digits, carry to left part',
            calculation: `${rightPart} = ${carry} × ${base} + ${finalRight}`,
            carry: carry,
            explanation: `Since ${rightPart} needs more than ${base.toString().length - 1} digits, we carry ${carry} to the left part.`
        }));
    }

    if (isNegative) {
        result = -result;
    }

    steps.push(createStep({
        stepNumber: 6,
        type: StepType.RESULT,
        title: 'Combine Parts',
        description: `Left part: ${leftPart}, Right part: ${rightPartStr}`,
        calculation: `${leftPart} | ${rightPartStr} = ${result}`,
        result: result,
        explanation: `Combining the left part (${leftPart}) with the right part (${rightPartStr}) gives the final answer: ${result}.`
    }));

    steps.push(createStep({
        stepNumber: 7,
        type: StepType.INFO,
        title: 'Verification',
        description: 'Check the result',
        calculation: `${n1} × ${n2} = ${Math.abs(result)}`,
        verification: { expected: n1 * n2, correct: Math.abs(result) === n1 * n2 },
        explanation: 'This Vedic method gives the same result as standard multiplication!'
    }));

    return createCalculationResult({
        method: 'vedicNikhilam',
        methodName: 'Vedic Nikhilam Multiplication',
        num1,
        num2,
        steps,
        finalAnswer: result,
        timeComplexity: 'O(1)',
        recommendedUse: 'Numbers near powers of 10 (97×96, 103×107, etc.)',
        alternative: 'Grade School Multiplication for general numbers',
        verification: { expected: n1 * n2, correct: Math.abs(result) === n1 * n2 }
    });
}

function findNearestBase(n1, n2) {
    const max = Math.max(n1, n2);
    const numDigits = max.toString().length;
    let base = 1;
    for (let i = 0; i < numDigits; i++) {
        base *= 10;
    }
    return base;
}

function getExample() {
    return {
        num1: 97,
        num2: 96,
        description: 'Both numbers near 100, perfect for Nikhilam: 97×96 = 9312'
    };
}

function validateInput(num1, num2) {
    const base = findNearestBase(Math.abs(num1), Math.abs(num2));
    const deficit1 = Math.abs(base - Math.abs(num1));
    const deficit2 = Math.abs(base - Math.abs(num2));
    const threshold = base * 0.1;

    if (deficit1 > threshold || deficit2 > threshold) {
        return {
            valid: false,
            message: `Numbers are not close enough to base ${base}. Nikhilam works best when numbers are within 10% of the base. Try Standard Multiplication instead.`
        };
    }
    return {
        valid: true,
        message: 'Nikhilam works best when both numbers are close to the same power of 10.'
    };
}

const VedicNikhilam = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput,
    findNearestBase
};

if (typeof module !== 'undefined' && module.exports) { module.exports = VedicNikhilam; }
global.VedicNikhilam = VedicNikhilam;

})(typeof window !== 'undefined' ? window : this);
