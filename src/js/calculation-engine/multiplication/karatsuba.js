(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'karatsuba',
    name: 'Karatsuba Algorithm',
    category: MethodCategory.COMPUTER,
    difficulty: DifficultyLevel.EXPERT,
    displayOrder: 8,
    origin: {
        culture: 'Russian (Anatoly Karatsuba)',
        timePeriod: '1960',
        description: 'First fast multiplication algorithm (sub-quadratic), discovered by Russian mathematician Anatoly Karatsuba. Revolutionized computer arithmetic by reducing multiplication complexity from O(n²) to O(n^1.585).'
    },
    whenToUse: [
        'Multiplying numbers with 100+ digits',
        'Cryptography (RSA uses 2048-bit numbers)',
        'Scientific computing with large numbers',
        'Understanding fast multiplication algorithms'
    ],
    advantages: [
        'Much faster than grade school for large numbers',
        'Reduced from O(n²) to O(n^1.585)',
        'Foundation for even faster algorithms',
        'Used in practical computer implementations'
    ],
    disadvantages: [
        'Overkill for small numbers',
        'Complex to implement correctly',
        'Requires recursive calls',
        'Not practical for manual calculation'
    ],
    speedRating: 'fast',
    mathPrinciple: 'Divide numbers into halves, compute 3 products instead of 4 using the identity: (a·b) = (a1·10^(n/2) + a0)(b1·10^(n/2) + b0)',
    relatedMethods: ['gradeSchool', 'russianPeasant']
});

function calculate(num1, num2) {
    const steps = [];
    const n1 = Math.abs(num1);
    const n2 = Math.abs(num2);
    const isNegative = (num1 < 0) !== (num2 < 0);

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Karatsuba Algorithm',
        description: 'Fast multiplication by divide and conquer',
        calculation: `${num1} × ${num2}`,
        result: { num1: n1, num2: n2 },
        explanation: 'Karatsuba reduces 4 multiplications to 3 by using a clever algebraic identity. This is much faster for large numbers!'
    }));

    const result = karatsubaRecursive(n1, n2, steps, 1);

    if (isNegative) {
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.INFO,
            title: 'Handle Negative Sign',
            description: 'One negative input → negative result',
            calculation: `(${num1}) × (${num2}) = -${result}`,
            result: -result,
            explanation: 'With different signs, the product is negative.'
        }));
    }

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Answer',
        description: 'Karatsuba algorithm result',
        calculation: `${num1} × ${num2} = ${isNegative ? -result : result}`,
        result: isNegative ? -result : result,
        explanation: `The Karatsuba algorithm computed the product as ${isNegative ? -result : result}.`
    }));

    return createCalculationResult({
        method: 'karatsuba',
        methodName: 'Karatsuba Algorithm',
        num1,
        num2,
        steps,
        finalAnswer: isNegative ? -result : result,
        timeComplexity: 'O(n^1.585)',
        recommendedUse: 'Numbers with 100+ digits; computer implementations',
        alternative: 'Grade School Multiplication for small numbers',
        verification: { expected: n1 * n2, correct: (isNegative ? -result : result) === num1 * num2 }
    });
}

function karatsubaRecursive(x, y, steps, depth) {
    if (x < 10 || y < 10) {
        if (depth === 1) {
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.INFO,
                title: 'Base Case',
                description: 'Small numbers - use standard multiplication',
                calculation: `${x} × ${y} = ${x * y}`,
                result: x * y,
                explanation: 'When numbers are single digits, Karatsuba falls back to standard multiplication.'
            }));
        }
        return x * y;
    }

    const n = Math.max(x.toString().length, y.toString().length);
    const m = Math.ceil(n / 2);

    const xStr = x.toString().padStart(n, '0');
    const yStr = y.toString().padStart(n, '0');

    const x1 = parseInt(xStr.substring(0, n - m));
    const x0 = parseInt(xStr.substring(n - m));
    const y1 = parseInt(yStr.substring(0, n - m));
    const y0 = parseInt(yStr.substring(n - m));

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.CALCULATION,
        title: `Level ${depth}: Split Numbers`,
        description: `Split ${x}×${y} into 2-digit parts`,
        calculation: `${x} = ${x1}×10^${m} + ${x0}, ${y} = ${y1}×10^${m} + ${y0}`,
        result: { x1, x0, y1, y0, m },
        explanation: `Split both numbers into high (${x1}, ${y1}) and low (${x0}, ${y0}) parts.`
    }));

    const z0 = karatsubaRecursive(x0, y0, steps, depth + 1);
    const z2 = karatsubaRecursive(x1, y1, steps, depth + 1);
    const z1 = karatsubaRecursive(x0 + x1, y0 + y1, steps, depth + 1);
    const z1Adjusted = z1 - z0 - z2;

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.CALCULATION,
        title: `Level ${depth}: Combine Results`,
        description: 'Use Karatsuba identity: z1 = (x0+x1)(y0+y1) - z0 - z2',
        calculation: `z1 = ${x0 + x1}×${y0 + y1} - ${z0} - ${z2} = ${z1Adjusted}`,
        result: { z0, z1: z1Adjusted, z2 },
        explanation: 'This clever identity lets us compute 4 products using only 3 recursive calls!'
    }));

    const result = z2 * Math.pow(10, 2 * m) + z1Adjusted * Math.pow(10, m) + z0;

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.CALCULATION,
        title: `Level ${depth}: Final Combination`,
        description: 'Combine: z2×10^(2m) + z1×10^m + z0',
        calculation: `${z2}×10^${2*m} + ${z1Adjusted}×10^${m} + ${z0} = ${result}`,
        result: result,
        explanation: 'Combine the three products with appropriate place value shifts.'
    }));

    return result;
}

function getExample() {
    return {
        num1: 56,
        num2: 78,
        description: 'Karatsuba multiplication: 56×78 = 4368 (divide & conquer demo)'
    };
}

function validateInput(num1, num2) {
    return {
        valid: true,
        message: 'Karatsuba algorithm demonstrates fast multiplication. Try it with these numbers!'
    };
}

const Karatsuba = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput,
    karatsubaRecursive
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Karatsuba; }
global.Karatsuba = Karatsuba;

})(typeof window !== 'undefined' ? window : this);
