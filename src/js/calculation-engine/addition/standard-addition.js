(function(global) {
    'use strict';

    const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

    const METHOD_METADATA = createMethodMetadata({
        id: 'standard',
        name: 'Standard Addition',
        category: MethodCategory.STANDARD,
        difficulty: DifficultyLevel.BEGINNER,
        displayOrder: 1,
        origin: {
            culture: 'Universal',
            timePeriod: 'Ancient - Refined through Medieval Period',
            description: 'The column-based addition method taught in schools worldwide, developed from ancient Egyptian and Hindu-Arabic numeral systems.'
        },
        whenToUse: [
            'Any addition problem',
            'Learning addition for the first time',
            'Quick calculations on paper',
            'Building foundational math skills'
        ],
        advantages: [
            'Simple and intuitive',
            'Works for any numbers',
            'Easy to verify',
            'Universally understood'
        ],
        disadvantages: [
            'Can be slow for many numbers',
            'Requires careful column alignment'
        ],
        speedRating: 'medium',
        mathPrinciple: 'Place value addition with carry propagation',
        relatedMethods: ['kahan', 'carryLookahead']
    });

    function calculate(num1, num2) {
        const steps = [];
        const n1 = Math.abs(num1);
        const n2 = Math.abs(num2);
        const isNegative = (num1 < 0) || (num2 < 0);
        
        let result = 0;
        let carry = 0;
        const maxDigits = Math.max(n1.toString().length, n2.toString().length);
        const num1Str = n1.toString().padStart(maxDigits, '0');
        const num2Str = n2.toString().padStart(maxDigits, '0');

        steps.push(createStep({
            stepNumber: 1,
            type: StepType.INPUT,
            title: 'Set Up Problem',
            description: `Write numbers aligned by place value`,
            calculation: `${num1} + ${num2}`,
            result: { num1: num1Str, num2: num2Str },
            explanation: 'Align the numbers by their rightmost digits (ones place).'
        }));

        for (let i = maxDigits - 1; i >= 0; i--) {
            const digit1 = parseInt(num1Str[i]);
            const digit2 = parseInt(num2Str[i]);
            const placeValue = Math.pow(10, maxDigits - 1 - i);
            const placeName = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'][maxDigits - 1 - i] || `10^${maxDigits - 1 - i}`;

            const columnSum = digit1 + digit2 + carry;
            const onesDigit = columnSum % 10;
            const newCarry = Math.floor(columnSum / 10);

            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.CALCULATION,
                title: `Add ${placeName}`,
                description: `Add the digits in the ${placeName} place`,
                calculation: `${digit1} + ${digit2}${carry > 0 ? ` + ${carry} (carry)` : ''} = ${columnSum}`,
                result: { digit: onesDigit, placeValue },
                carry: carry,
                explanation: columnSum >= 10 
                    ? `Sum is ${columnSum}, which is 10 or greater. Write ${onesDigit} and carry ${newCarry} to next column.`
                    : `Sum is ${columnSum}, no carry needed.`
            }));

            if (newCarry > 0) {
                steps.push(createStep({
                    stepNumber: steps.length + 1,
                    type: StepType.CARRY,
                    title: 'Carry Forward',
                    description: `Carry ${newCarry} to the next column`,
                    calculation: `carry = ${newCarry}`,
                    carry: newCarry,
                    position: i - 1,
                    explanation: 'Add the carried value to the next column to the left.'
                }));
            }

            result += onesDigit * placeValue;
            carry = newCarry;
        }

        if (carry > 0) {
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.CALCULATION,
                title: 'Final Carry',
                description: 'Add the final carry',
                calculation: `carry ${carry} becomes the leftmost digit`,
                result: { digit: carry },
                explanation: `The remaining carry of ${carry} becomes the highest place value digit.`
            }));
            result += carry * Math.pow(10, maxDigits);
        }

        if (isNegative) {
            result = -result;
        }

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.RESULT,
            title: 'Final Answer',
            description: 'Combine all digits for the result',
            calculation: `${num1} + ${num2} = ${result}`,
            result: result,
            explanation: `The sum of ${num1} and ${num2} is ${result}.`
        }));

        return createCalculationResult({
            method: 'standard',
            methodName: 'Standard Addition',
            num1,
            num2,
            steps,
            finalAnswer: result,
            timeComplexity: 'O(n)',
            recommendedUse: 'General purpose addition for any numbers',
            alternative: 'Kahan Summation for precise decimal addition',
            verification: { expected: num1 + num2, correct: result === num1 + num2 }
        });
    }

    function getExample() {
        return {
            num1: 247,
            num2: 185,
            description: 'Two 3-digit numbers with carries in multiple columns'
        };
    }

    function validateInput(num1, num2) {
        return {
            valid: true,
            message: ''
        };
    }

    const StandardAddition = {
        METHOD_METADATA,
        calculate,
        getExample,
        validateInput
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = StandardAddition;
    }

    global.StandardAddition = StandardAddition;

})(typeof window !== 'undefined' ? window : this);
