(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'gradeSchool',
    name: 'Grade School Multiplication',
    category: MethodCategory.STANDARD,
    difficulty: DifficultyLevel.ELEMENTARY,
    displayOrder: 1,
    origin: {
        culture: 'Universal',
        timePeriod: 'Ancient - Refined through Medieval Europe',
        description: 'The standard partial products method taught in schools worldwide, developed from Hindu-Arabic arithmetic traditions.'
    },
    whenToUse: [
        'Any multiplication problem',
        'Learning multiplication basics',
        'General purpose calculations',
        'When other methods aren\'t applicable'
    ],
    advantages: [
        'Works for any numbers',
        'Easy to understand and verify',
        'Universally taught and understood',
        'Good for building intuition'
    ],
    disadvantages: [
        'Can be slow for large numbers',
        'Many partial products to keep track of',
        'Requires good multiplication table knowledge'
    ],
    speedRating: 'slow',
    mathPrinciple: 'Distributive property: a × b = sum of (a × each digit of b, shifted)',
    relatedMethods: ['lattice', 'russianPeasant', 'karatsuba']
});

function calculate(num1, num2) {
    const steps = [];
    const n1 = Math.abs(num1);
    const n2 = Math.abs(num2);
    const isNegative = (num1 < 0) !== (num2 < 0);
    
    const str1 = n1.toString();
    const str2 = n2.toString();
    const partialProducts = [];

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INPUT,
        title: 'Set Up Problem',
        description: `Write numbers for multiplication: ${num1} × ${num2}`,
        calculation: `${num1} × ${num2}`,
        result: { num1: str1, num2: str2 },
        explanation: 'Set up the multiplication with the larger number on top.'
    }));

    for (let i = str2.length - 1; i >= 0; i--) {
        const digit = parseInt(str2[i]);
        let partialProduct = 0;
        let carry = 0;
        const currentPP = [];
        
        for (let j = str1.length - 1; j >= 0; j--) {
            const digit1 = parseInt(str1[j]);
            const product = digit1 * digit + carry;
            const ones = product % 10;
            carry = Math.floor(product / 10);
            currentPP.unshift({ digit: ones, position: str1.length - 1 - j });
            partialProduct = ones * Math.pow(10, str1.length - 1 - j) + partialProduct;
        }

        if (carry > 0) {
            partialProduct += carry * Math.pow(10, str1.length);
        }

        const shiftAmount = str2.length - 1 - i;
        
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.PARTIAL_PRODUCT,
            title: `Multiply by ${digit} (${str2[str2.length - 1 - i]}s place)`,
            description: `Calculate partial product: ${digit} × ${str1}`,
            calculation: `${digit} × ${str1} = ${partialProduct}`,
            partialProduct: { value: partialProduct, shift: shiftAmount },
            result: { partialProduct, digit, base: str1 },
            explanation: `Multiplying by ${digit} in the ${['ones', 'tens', 'hundreds', 'thousands'][shiftAmount] || `10^${shiftAmount}`} place.`
        }));

        if (shiftAmount > 0) {
            const placeNames = ['ones', 'tens', 'hundreds', 'thousands'];
            const placeName = shiftAmount < placeNames.length ? placeNames[shiftAmount] : `10^${shiftAmount}`;
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.SHIFT,
                title: 'Shift for Place Value',
                description: `Shift left by ${shiftAmount} position(s)`,
                calculation: `Move ${shiftAmount} place(s) to the left`,
                result: { shiftedValue: partialProduct * Math.pow(10, shiftAmount), shift: shiftAmount },
                explanation: `The ${placeName} digit creates a number that needs to be shifted.`
            }));
            partialProduct *= Math.pow(10, shiftAmount);
        }

        partialProducts.push(partialProduct);
    }

    let sum = 0;
    let runningTotal = 0;
    
    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.CALCULATION,
        title: 'Add Partial Products',
        description: 'Sum all partial products to get final answer',
        calculation: partialProducts.join(' + '),
        result: { partialProducts },
        explanation: 'Add together all the partial products to get the final result.'
    }));

    for (let i = 0; i < partialProducts.length; i++) {
        runningTotal += partialProducts[i];
        
        if (i < partialProducts.length - 1) {
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.CALCULATION,
                title: `Running Total ${i + 1}`,
                description: `Add partial product ${i + 1}`,
                calculation: `Previous: ${sum} + ${partialProducts[i]} = ${runningTotal}`,
                result: { runningTotal },
                explanation: `After adding partial product ${i + 1}, the running total is ${runningTotal}.`
            }));
        }
        sum = runningTotal;
    }

    if (isNegative) {
        sum = -sum;
    }

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Answer',
        description: 'Combine all partial products',
        calculation: `${num1} × ${num2} = ${sum}`,
        result: sum,
        explanation: `The product of ${num1} and ${num2} is ${sum}.`
    }));

    return createCalculationResult({
        method: 'gradeSchool',
        methodName: 'Grade School Multiplication',
        num1,
        num2,
        steps,
        finalAnswer: sum,
        timeComplexity: 'O(n × m)',
        recommendedUse: 'General purpose multiplication for any numbers',
        alternative: 'Vedic Nikhilam for numbers near powers of 10',
        verification: { expected: num1 * num2, correct: sum === num1 * num2 }
    });
}

function getExample() {
    return {
        num1: 35,
        num2: 12,
        description: 'Two 2-digit numbers demonstrating partial products'
    };
}

function validateInput(num1, num2) {
    return {
        valid: true,
        message: ''
    };
}

const GradeSchoolMultiplication = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) { module.exports = GradeSchoolMultiplication; }
global.GradeSchoolMultiplication = GradeSchoolMultiplication;

})(typeof window !== 'undefined' ? window : this);
