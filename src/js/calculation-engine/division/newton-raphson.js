(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'newtonRaphson',
    name: 'Newton-Raphson Division',
    category: MethodCategory.COMPUTER,
    difficulty: DifficultyLevel.EXPERT,
    displayOrder: 4,
    origin: {
        culture: 'Universal (Computer Science)',
        timePeriod: '1950s-1970s',
        description: 'Uses Newton\'s method to find reciprocals iteratively. Since multiplication is faster than division for large numbers, converting division to multiplication gives significant speedup.'
    },
    whenToUse: [
        'Dividing very large numbers',
        'Cryptographic calculations',
        'Scientific computing with high precision',
        'When fast multiplication algorithms are available'
    ],
    advantages: [
        'Faster than traditional division for large numbers',
        'Leverages fast multiplication',
        'Precision doubles each iteration',
        'Used in modern processors'
    ],
    disadvantages: [
        'Complex to implement',
        'Requires good initial guess',
        'Not for manual calculation',
        'Overhead not worth it for small numbers'
    ],
    speedRating: 'fast',
    mathPrinciple: 'Find 1/D by iterating x_{n+1} = x_n × (2 - D × x_n), then multiply by numerator',
    relatedMethods: ['longDivision', 'karatsuba']
});

function calculate(dividend, divisor, precision = 6) {
    const steps = [];
    
    if (divisor === 0) {
        throw new Error('Division by zero is not allowed');
    }

    const absDividend = Math.abs(dividend);
    const absDivisor = Math.abs(divisor);
    const isNegative = (dividend < 0) !== (divisor < 0);

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Newton-Raphson Division',
        description: 'Division via reciprocal approximation',
        calculation: `${dividend} ÷ ${divisor}`,
        result: { dividend: absDividend, divisor: absDivisor, precision },
        explanation: 'Newton-Raphson finds 1/divisor through iteration, then multiplies by dividend. Fast for large numbers!'
    }));

    const dNormalized = absDivisor;
    const scale = Math.pow(10, absDivisor.toString().length);
    const dScaled = absDivisor / scale;

    steps.push(createStep({
        stepNumber: 2,
        type: StepType.CALCULATION,
        title: 'Normalize',
        description: 'Scale divisor to [0.5, 1)',
        calculation: `${absDivisor} / ${scale} = ${dScaled}`,
        result: { dScaled, scale },
        explanation: 'Normalize divisor to range [0.5, 1) for faster convergence.'
    }));

    let x = 2 - dScaled;

    steps.push(createStep({
        stepNumber: 3,
        type: StepType.CALCULATION,
        title: 'Initial Guess',
        description: 'x₀ = 2 - D',
        calculation: `x₀ = 2 - ${dScaled} = ${x}`,
        result: { x, iteration: 0 },
        explanation: 'Initial guess: x₀ = 2 - D. This is always in the correct range.'
    }));

    for (let i = 0; i < precision; i++) {
        const prevX = x;
        const dTimesX = dScaled * x;
        const twoMinus = 2 - dTimesX;
        x = x * twoMinus;

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.CALCULATION,
            title: `Iteration ${i + 1}`,
            description: 'Apply Newton-Raphson formula',
            calculation: `x${i + 1} = ${prevX} × (2 - ${dScaled} × ${prevX}) = ${prevX} × ${twoMinus.toFixed(6)} = ${x.toFixed(6)}`,
            result: { x, iteration: i + 1, prevX, twoMinus },
            explanation: `Iteration ${i + 1}: x = ${x.toFixed(6)}. Precision roughly doubles each iteration.`
        }));
    }

    const reciprocal = x * scale;

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.CALCULATION,
        title: 'Scale Reciprocal',
        description: 'Scale back to original magnitude',
        calculation: `1/${absDivisor} ≈ ${x} × ${scale} = ${reciprocal}`,
        result: { reciprocal },
        explanation: 'Scale the reciprocal back to the original magnitude.'
    }));

    const quotient = absDividend * reciprocal;
    const finalQuotient = isNegative ? -quotient : quotient;
    const roundedQuotient = Math.round(finalQuotient);

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.MULTIPLY,
        title: 'Compute Quotient',
        description: 'Multiply dividend by reciprocal',
        calculation: `${absDividend} × ${reciprocal.toFixed(6)} ≈ ${quotient.toFixed(6)}`,
        result: { quotient: quotient.toFixed(6) },
        explanation: `Multiply the dividend by the reciprocal approximation.`
    }));

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Result',
        description: 'Approximate quotient',
        calculation: `${dividend} ÷ ${divisor} ≈ ${finalQuotient.toFixed(6)}`,
        result: finalQuotient,
        explanation: `The Newton-Raphson method gives approximately ${finalQuotient.toFixed(6)}.`
    }));

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.INFO,
        title: 'Comparison',
        description: 'Check against actual division',
        calculation: `Actual: ${dividend} ÷ ${divisor} = ${(dividend / divisor).toFixed(6)}`,
        result: { 
            actual: dividend / divisor,
            approximation: finalQuotient,
            error: Math.abs(finalQuotient - dividend / divisor)
        },
        explanation: 'The Newton-Raphson approximation is very close to the actual value!'
    }));

    return createCalculationResult({
        method: 'newtonRaphson',
        methodName: 'Newton-Raphson Division',
        num1: dividend,
        num2: divisor,
        divisor,
        dividend,
        steps,
        finalAnswer: finalQuotient,
        timeComplexity: 'O(M(n) × log(precision))',
        recommendedUse: 'Large number division in software; cryptographic calculations',
        alternative: 'Long Division for small numbers or manual calculation',
        verification: { 
            expected: dividend / divisor, 
            correct: Math.abs(finalQuotient - dividend / divisor) < 0.0001 
        }
    });
}

function getExample() {
    return {
        dividend: 1000,
        divisor: 17,
        description: 'Newton-Raphson: 1000 ÷ 17 ≈ 58.8235 (iteration-based)'
    };
}

function validateInput(dividend, divisor) {
    if (divisor === 0) {
        return { valid: false, message: 'Division by zero is not allowed.' };
    }
    return {
        valid: true,
        message: 'Newton-Raphson division is primarily for software implementations with large numbers.'
    };
}

const NewtonRaphson = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewtonRaphson;
}
global.NewtonRaphson = NewtonRaphson;
})(typeof window !== 'undefined' ? window : this);
