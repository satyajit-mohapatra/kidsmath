(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'vedicParavartya',
    name: 'Vedic Paravartya',
    category: MethodCategory.VEDIC,
    difficulty: DifficultyLevel.INTERMEDIATE,
    displayOrder: 2,
    origin: {
        culture: 'Indian (Vedic Mathematics)',
        timePeriod: 'Ancient - ~500 CE',
        description: 'From the "Paravartya Yojayet" sutra meaning "Transpose and Adjust". An elegant technique that transforms division into easier operations using the divisor\'s complement.'
    },
    whenToUse: [
        'Divisor close to a power of 10 (starting with 1)',
        'Mental division for applicable numbers',
        'Numbers like 12, 18, 21, 98, etc.',
        'Building division flexibility'
    ],
    advantages: [
        'Very fast for applicable divisors',
        'Transforms hard division to easier operations',
        'Great for mental math',
        'Builds number sense'
    ],
    disadvantages: [
        'Only works well for specific divisors',
        'Complex to learn',
        'Requires understanding complements'
    ],
    speedRating: 'fast',
    mathPrinciple: 'Use divisor\'s complement to convert division into subtraction and multiplication',
    relatedMethods: ['longDivision', 'vedicNikhilam']
});

function calculate(dividend, divisor) {
    const steps = [];
    
    if (divisor === 0) {
        throw new Error('Division by zero is not allowed');
    }

    const isNegative = (dividend < 0) !== (divisor < 0);
    const absDividend = Math.abs(dividend);
    const absDivisor = Math.abs(divisor);
    const dividendStr = absDividend.toString();
    const divisorStr = absDivisor.toString();

    const base = Math.pow(10, divisorStr.length);
    const complement = base - absDivisor;

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Paravartya Yojayet',
        description: 'Transpose and Adjust division method',
        calculation: `${dividend} ÷ ${divisor}`,
        result: { dividend: absDividend, divisor: absDivisor, base, complement },
        explanation: 'Paravartya uses the complement of the divisor to transform division into subtraction.'
    }));

    steps.push(createStep({
        stepNumber: 2,
        type: StepType.CALCULATION,
        title: 'Calculate Complement',
        description: `Base = ${base}, Complement = ${base} - ${absDivisor}`,
        calculation: `${base} - ${absDivisor} = ${complement}`,
        result: { complement },
        explanation: `The complement ${complement} will be used to adjust each step.`
    }));

    steps.push(createStep({
        stepNumber: 3,
        type: StepType.INFO,
        title: 'Split Dividend',
        description: 'Split dividend appropriately for the divisor',
        calculation: `Divisor has ${divisorStr.length} digits`,
        result: { divisorDigits: divisorStr.length },
        explanation: 'We split the dividend so the last n-1 digits work with the complement.'
    }));

    const firstDigit = parseInt(dividendStr[0]);
    const quotientFirst = Math.floor(firstDigit / absDivisor);
    const remainderAfterFirst = firstDigit % absDivisor;

    steps.push(createStep({
        stepNumber: 4,
        type: StepType.DIVIDE,
        title: 'First Division Step',
        description: `Divide first digit: ${firstDigit} ÷ ${absDivisor}`,
        calculation: `${firstDigit} ÷ ${absDivisor} = ${quotientFirst} remainder ${remainderAfterFirst}`,
        result: { quotientDigit: quotientFirst, remainder: remainderAfterFirst },
        explanation: `The first quotient digit is ${quotientFirst} with remainder ${remainderAfterFirst}.`
    }));

    let currentRemainder = remainderAfterFirst;
    let quotient = quotientFirst;
    const quotientDigits = [quotientFirst];

    for (let i = 1; i < dividendStr.length; i++) {
        const nextDigit = parseInt(dividendStr[i]);
        const currentValue = currentRemainder * 10 + nextDigit;
        
        const adjustment = Math.floor((currentValue * complement) / base);
        const newValue = currentValue - adjustment;
        
        const qDigit = Math.floor(newValue / absDivisor);
        const newRemainder = newValue % absDivisor;

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.CALCULATION,
            title: `Step ${i + 1}: Adjust and Divide`,
            description: `Adjust using complement: ${currentValue} - ${adjustment}`,
            calculation: `(${currentValue} × ${complement}) / ${base} = ${adjustment}, new value: ${newValue}`,
            result: { adjustment, newValue, qDigit },
            explanation: `Adjust by multiplying with complement, then divide by base.`
        }));

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.DIVIDE,
            title: `Find Quotient Digit ${i + 1}`,
            description: `Divide: ${newValue} ÷ ${absDivisor}`,
            calculation: `${newValue} ÷ ${absDivisor} = ${qDigit}`,
            result: { quotientDigit: qDigit, remainder: newRemainder },
            explanation: `The next quotient digit is ${qDigit}.`
        }));

        quotient = quotient * 10 + qDigit;
        quotientDigits.push(qDigit);
        currentRemainder = newRemainder;
    }

    let finalQuotient = isNegative ? -quotient : quotient;
    let finalRemainder = currentRemainder;

    if (finalRemainder < 0) {
        finalQuotient -= 1;
        finalRemainder += absDivisor;
    }

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Result',
        description: `Quotient: ${finalQuotient}, Remainder: ${finalRemainder}`,
        calculation: `${dividend} ÷ ${divisor} = ${finalQuotient} R${finalRemainder}`,
        result: { quotient: finalQuotient, remainder: finalRemainder },
        explanation: `The Paravartya method gives quotient ${finalQuotient} with remainder ${finalRemainder}.`
    }));

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.INFO,
        title: 'Verification',
        description: 'Check result using standard division',
        calculation: `${absDivisor} × ${quotient} + ${currentRemainder} = ${absDivisor * quotient + currentRemainder}`,
        verification: { 
            expected: absDividend, 
            correct: absDivisor * quotient + currentRemainder === absDividend 
        },
        explanation: 'Verify: divisor × quotient + remainder = dividend'
    }));

    return createCalculationResult({
        method: 'vedicParavartya',
        methodName: 'Vedic Paravartya Division',
        num1: dividend,
        num2: divisor,
        divisor,
        dividend,
        steps,
        finalAnswer: finalQuotient,
        timeComplexity: 'O(n)',
        recommendedUse: 'Divisors near powers of 10 (12, 18, 21, 98, etc.)',
        alternative: 'Long Division for general cases',
        verification: { 
            expected: { quotient: Math.floor(absDividend / absDivisor), remainder: absDividend % absDivisor }, 
            correct: absDivisor * quotient + currentRemainder === absDividend 
        }
    });
}

function getExample() {
    return {
        dividend: 1225,
        divisor: 12,
        description: 'Vedic Paravartya: 1225 ÷ 12 = 102 R1'
    };
}

function validateInput(dividend, divisor) {
    if (divisor === 0) {
        return { valid: false, message: 'Division by zero is not allowed.' };
    }
    const absDivisor = Math.abs(divisor);
    const absDividend = Math.abs(dividend);
    const base = Math.pow(10, absDivisor.toString().length - 1);
    
    if (absDivisor < base || absDivisor > base * 10) {
        return {
            valid: false,
            message: `Paravartya works best when divisor is near a power of 10. ${absDivisor} is not close to 10, 100, or 1000. Try Long Division instead.`
        };
    }
    return {
        valid: true,
        message: 'Paravartya works well when divisor is close to a power of 10.'
    };
}

const VedicParavartya = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VedicParavartya;
}
global.VedicParavartya = VedicParavartya;
})(typeof window !== 'undefined' ? window : this);
