(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'synthetic',
    name: 'Synthetic Division',
    category: MethodCategory.SPECIALIZED,
    difficulty: DifficultyLevel.INTERMEDIATE,
    displayOrder: 5,
    origin: {
        culture: 'Western Mathematics',
        timePeriod: 'Early 20th Century',
        description: 'A streamlined form of polynomial long division, developed for efficiently dividing polynomials by linear factors. Widely used in algebra, precalculus, and engineering.'
    },
    whenToUse: [
        'Dividing polynomials by linear factors (x - c)',
        'Finding polynomial roots',
        'Evaluating polynomials at a point',
        'Algebra coursework'
    ],
    advantages: [
        'Much faster than polynomial long division',
        'Less error-prone',
        'Efficient for finding remainders',
        'Useful for checking if c is a root'
    ],
    disadvantages: [
        'Only works for linear divisors (x - c)',
        'Limited to algebra applications',
        'Not for numerical arithmetic'
    ],
    speedRating: 'very_fast',
    mathPrinciple: 'Shortcut polynomial division using coefficients only, eliminating variable notation',
    relatedMethods: ['longDivision']
});

function calculate(polynomialCoeffs, c) {
    const steps = [];
    
    const coefficients = polynomialCoeffs;
    const degree = coefficients.length - 1;
    
    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Synthetic Division',
        description: `Divide by (x - ${c})`,
        calculation: `Polynomial coefficients: ${coefficients.join(', ')}`,
        result: { coefficients, c },
        explanation: 'Synthetic division is a shortcut for dividing polynomials by linear factors (x - c).'
    }));

    steps.push(createStep({
        stepNumber: 2,
        type: StepType.VISUALIZATION,
        title: 'Set Up Synthetic Division',
        description: `Write coefficients and bring down first one`,
        calculation: `   ${coefficients.join('    ')}\n   ─────────────────`,
        visualization: {
            type: 'synthetic_setup',
            coefficients,
            c
        },
        explanation: `Write the coefficients in order: ${coefficients.join(', ')}. Leave space for the result.`
    }));

    const result = [];
    let carry = coefficients[0];
    result.push(carry);

    steps.push(createStep({
        stepNumber: 3,
        type: StepType.CALCULATION,
        title: 'Bring Down',
        description: 'Bring down the first coefficient',
        calculation: `Bring down ${coefficients[0]}`,
        result: { value: carry },
        position: 0,
        explanation: 'The first coefficient becomes the first coefficient of the quotient.'
    }));

    for (let i = 1; i < coefficients.length; i++) {
        const multiply = carry * c;
        
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.MULTIPLY,
            title: `Multiply by ${c}`,
            description: `Previous result × ${c}`,
            calculation: `${carry} × ${c} = ${multiply}`,
            result: { multiply, carry },
            position: i,
            explanation: `Multiply the previous result by ${c} and write below the next coefficient.`
        }));

        const add = multiply + coefficients[i];
        
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.ADD_DIAGONAL,
            title: 'Add to Next Coefficient',
            description: `Add to coefficient ${i}: ${multiply} + ${coefficients[i]}`,
            calculation: `${multiply} + ${coefficients[i]} = ${add}`,
            result: { value: add },
            position: i,
            explanation: `Add this to the next coefficient to get the next result.`
        }));

        carry = add;
        result.push(carry);
    }

    const quotient = result.slice(0, -1);
    const remainder = result[result.length - 1];

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.VISUALIZATION,
        title: 'Read Results',
        description: 'Quotient and remainder',
        calculation: `Quotient coefficients: ${quotient.join(', ')}, Remainder: ${remainder}`,
        result: { quotient, remainder },
        explanation: 'The last number is the remainder. The others are quotient coefficients.'
    }));

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.INFO,
        title: 'Build Quotient Polynomial',
        description: 'Convert coefficients to polynomial form',
        calculation: `Quotient: ${buildPolynomial(quotient)}`,
        result: { polynomial: buildPolynomial(quotient) },
        explanation: `The quotient is ${buildPolynomial(quotient)}.`
    }));

    const polynomialStr = buildPolynomial(coefficients);

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Result',
        description: `Divided by (x - ${c})`,
        calculation: `${polynomialStr} ÷ (x - ${c}) = ${buildPolynomial(quotient)} + ${remainder}/(x - ${c})`,
        result: { quotient, remainder },
        explanation: `Synthetic division by (x - ${c}) gives quotient ${buildPolynomial(quotient)} with remainder ${remainder}.`
    }));

    if (remainder === 0) {
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.INFO,
            title: 'Root Check',
            description: `Remainder is 0, so ${c} is a root!`,
            calculation: `P(${c}) = 0`,
            result: { isRoot: true },
            explanation: `Since the remainder is 0, ${c} is a root of the polynomial!`
        }));
    }

    return createCalculationResult({
        method: 'synthetic',
        methodName: 'Synthetic Division',
        num1: c,
        num2: coefficients[0],
        steps,
        finalAnswer: { quotient, remainder },
        timeComplexity: 'O(n)',
        recommendedUse: 'Dividing polynomials by linear factors (x - c)',
        alternative: 'Polynomial Long Division for non-linear divisors',
        verification: {
            expected: remainder,
            correct: evaluatePolynomial(coefficients, c) === remainder
        }
    });
}

function buildPolynomial(coeffs) {
    if (coeffs.length === 0) return '0';
    if (coeffs.length === 1) return coeffs[0].toString();
    
    let terms = [];
    for (let i = 0; i < coeffs.length; i++) {
        const power = coeffs.length - 1 - i;
        if (coeffs[i] === 0) continue;
        
        let term = '';
        if (power === 0) {
            term = coeffs[i].toString();
        } else {
            if (coeffs[i] === 1) {
                term = power === 1 ? 'x' : `x^${power}`;
            } else {
                term = power === 1 ? `${coeffs[i]}x` : `${coeffs[i]}x^${power}`;
            }
        }
        terms.push(term);
    }
    
    return terms.join(' + ').replace(/\+ -/g, '- ');
}

function evaluatePolynomial(coeffs, x) {
    let result = 0;
    for (let i = 0; i < coeffs.length; i++) {
        const power = coeffs.length - 1 - i;
        result += coeffs[i] * Math.pow(x, power);
    }
    return result;
}

function getExample() {
    return {
        coefficients: [1, 5, 3, -8],
        c: 2,
        description: 'Divide (x³ + 5x² + 3x - 8) by (x - 2) → Quotient: x² + 7x + 17, Remainder: 26'
    };
}

function validateInput(polynomialCoeffs, c) {
    if (!Array.isArray(polynomialCoeffs) || polynomialCoeffs.length < 1) {
        return { valid: false, message: 'Invalid polynomial coefficients.' };
    }
    return {
        valid: true,
        message: 'Synthetic division is specifically for polynomial division by linear factors (x - c).'
    };
}

const SyntheticDivision = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput,
    buildPolynomial
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyntheticDivision;
}
global.SyntheticDivision = SyntheticDivision;
})(typeof window !== 'undefined' ? window : this);
