(function(global) {
    'use strict';

    const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

    const METHOD_METADATA = createMethodMetadata({
        id: 'kahan',
        name: 'Kahan Summation',
        category: MethodCategory.COMPUTER,
        difficulty: DifficultyLevel.INTERMEDIATE,
        displayOrder: 2,
        origin: {
            culture: 'American (William Kahan)',
            timePeriod: '1965',
            description: 'Developed by computer scientist William Kahan to minimize rounding errors in floating-point arithmetic, crucial for scientific and financial calculations.'
        },
        whenToUse: [
            'Adding many decimal numbers',
            'Financial calculations where precision matters',
            'Scientific measurements with accumulated small values',
            'Any situation where rounding errors can accumulate'
        ],
        advantages: [
            'Reduces accumulated rounding errors',
            'Essential for accurate financial/scientific calculations',
            'Works with any number of inputs'
        ],
        disadvantages: [
            'More complex than standard addition',
            'Overkill for simple calculations',
            'Primarily designed for computer use'
        ],
        speedRating: 'medium',
        mathPrinciple: 'Tracks lost low-order bits to compensate for rounding errors in floating-point arithmetic',
        relatedMethods: ['standard']
    });

    function calculate(num1, num2) {
        const steps = [];
        const numbers = [num1, num2];
        
        steps.push(createStep({
            stepNumber: 1,
            type: StepType.INFO,
            title: 'Kahan Summation Algorithm',
            description: 'Error-correcting summation algorithm',
            calculation: `Sum = ${numbers.join(' + ')}`,
            explanation: 'Kahan summation compensates for floating-point rounding errors by tracking lost low-order bits.'
        }));

        let sum = 0;
        let compensation = 0;

        steps.push(createStep({
            stepNumber: 2,
            type: StepType.INPUT,
            title: 'Initialize Variables',
            description: 'Set up accumulator and compensation',
            calculation: 'sum = 0, compensation = 0',
            result: { sum, compensation },
            explanation: 'sum accumulates the running total, compensation tracks the error from rounding.'
        }));

        for (let i = 0; i < numbers.length; i++) {
            const num = numbers[i];
            
            const y = num - compensation;
            const t = sum + y;
            const newCompensation = (t - sum) - y;

            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.CALCULATION,
                title: `Add Number ${i + 1}: ${num}`,
                description: 'Adjust for compensation and add',
                calculation: `y = ${num} - ${compensation} = ${y}, t = ${sum} + ${y} = ${t}`,
                result: { y, t, newCompensation },
                explanation: 'Subtract the accumulated error from the new number, then add to the running sum.'
            }));

            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.INFO,
                title: 'Update Compensation',
                description: 'Calculate new compensation value',
                calculation: `compensation = (${t} - ${sum}) - ${y} = ${newCompensation}`,
                result: { compensation: newCompensation },
                explanation: 'The compensation captures the low-order bits lost due to rounding.'
            }));

            sum = t;
            compensation = newCompensation;
        }

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.RESULT,
            title: 'Final Sum',
            description: 'Return the compensated sum',
            calculation: `Sum = ${sum}`,
            result: sum,
            explanation: `The Kahan compensated sum of ${num1} and ${num2} is ${sum}.`
        }));

        const expected = num1 + num2;

        return createCalculationResult({
            method: 'kahan',
            methodName: 'Kahan Summation',
            num1,
            num2,
            steps,
            finalAnswer: sum,
            timeComplexity: 'O(n)',
            recommendedUse: 'Multiple decimal additions where precision is critical',
            alternative: 'Standard Addition for simple cases',
            verification: { expected, correct: Math.abs(sum - expected) < 0.0000001 }
        });
    }

    function calculateMultiple(numbers) {
        const steps = [];
        
        steps.push(createStep({
            stepNumber: 1,
            type: StepType.INFO,
            title: 'Kahan Summation for Multiple Numbers',
            description: `Adding ${numbers.length} numbers with error compensation`,
            calculation: numbers.join(' + '),
            explanation: 'This algorithm is especially valuable when adding many numbers, as errors can compound.'
        }));

        let sum = 0;
        let compensation = 0;

        for (let i = 0; i < numbers.length; i++) {
            const num = numbers[i];
            const y = num - compensation;
            const t = sum + y;
            const newCompensation = (t - sum) - y;

            steps.push(createStep({
                stepNumber: i + 2,
                type: StepType.CALCULATION,
                title: `Add ${num}`,
                description: 'Process with error compensation',
                calculation: `sum = ${sum}, y = ${num} - ${compensation} = ${y}, t = ${t}`,
                result: { sum: t, compensation: newCompensation },
                explanation: `After adding ${num} with compensation, the running sum is ${t}.`
            }));

            sum = t;
            compensation = newCompensation;
        }

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.RESULT,
            title: 'Final Compensated Sum',
            description: 'The error-corrected total',
            calculation: `Sum = ${sum}`,
            result: sum,
            explanation: 'The Kahan algorithm has minimized accumulated rounding errors.'
        }));

        return createCalculationResult({
            method: 'kahan',
            methodName: 'Kahan Summation (Multiple)',
            num1: numbers[0],
            num2: numbers[1],
            steps,
            finalAnswer: sum,
            timeComplexity: 'O(n)',
            recommendedUse: 'Adding 3+ decimal numbers with precision requirements',
            alternative: 'Standard addition for simple cases'
        });
    }

    function getExample() {
        return {
            num1: 0.1,
            num2: 0.2,
            description: 'Demonstrates precision with decimal addition (0.1 + 0.2 = 0.3)'
        };
    }

    function validateInput(num1, num2) {
        return {
            valid: true,
            message: 'Kahan summation works best with decimal numbers where precision matters'
        };
    }

    const KahanSummation = {
        METHOD_METADATA,
        calculate,
        calculateMultiple,
        getExample,
        validateInput
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = KahanSummation;
    }

    global.KahanSummation = KahanSummation;

})(typeof window !== 'undefined' ? window : this);
