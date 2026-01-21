(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'russianPeasant',
    name: 'Russian Peasant Multiplication',
    category: MethodCategory.ANCIENT,
    difficulty: DifficultyLevel.ELEMENTARY,
    displayOrder: 6,
    origin: {
        culture: 'Ancient Egyptian / Russian',
        timePeriod: 'Ancient Egyptian (1650 BCE) - Documented in Rhind Papyrus',
        description: 'Also called "Ethiopian multiplication" or "古老的乘法". Used by Russian peasants because it requires no multiplication tables - just doubling and halving. This is exactly how computers multiply in binary!'
    },
    whenToUse: [
        'Mental math with no multiplication tables',
        'Understanding binary multiplication',
        'Teaching how computers multiply',
        'Situations with only addition available'
    ],
    advantages: [
        'Only requires doubling and halving',
        'No multiplication tables needed',
        'Reveals the binary nature of multiplication',
        'Computers use this same algorithm!'
    ],
    disadvantages: [
        'More steps than standard multiplication',
        'Requires tracking many rows',
        'Not optimal for very large numbers'
    ],
    speedRating: 'medium',
    mathPrinciple: 'Based on binary decomposition - multiplying by powers of 2 (doubling) and adding selected results',
    relatedMethods: ['gradeSchool', 'karatsuba']
});

function calculate(num1, num2) {
    const steps = [];
    const n1 = Math.abs(num1);
    const n2 = Math.abs(num2);
    const isNegative = (num1 < 0) !== (num2 < 0);

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Russian Peasant Multiplication',
        description: 'Doubling and halving method (ancient Egyptian)',
        calculation: `${num1} × ${num2}`,
        result: { num1: n1, num2: n2 },
        explanation: 'This method uses only doubling and halving - no multiplication tables needed! This is exactly how computer processors multiply.'
    }));

    let left = n1;
    let right = n2;
    const table = [];
    
    steps.push(createStep({
        stepNumber: 2,
        type: StepType.VISUALIZATION,
        title: 'Create Doubling Table',
        description: 'Double the left, halve the right until right reaches 0',
        calculation: 'Left | Right',
        visualization: {
            type: 'peasant_table',
            headers: ['Left (doubles)', 'Right (halves)', 'Keep?']
        },
        explanation: 'Create two columns. Keep doubling the left, halving the right (dropping remainders).'
    }));

    let row = 0;
    while (right > 0) {
        const isOdd = right % 2 === 1;
        const prevLeft = left;
        
        table.push({ left, right, isOdd, row });
        
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.CALCULATION,
            title: `Row ${row + 1}`,
            description: `${left} | ${right} ${isOdd ? '(ODD ✓)' : '(EVEN)'}`,
            calculation: `${left} | ${right}`,
            result: { left, right, isOdd },
            position: row,
            explanation: isOdd 
                ? `${right} is odd - mark this row, we\'ll add ${left} to the result.`
                : `${right} is even - skip this row.`
        }));

        left = left * 2;
        right = Math.floor(right / 2);
        row++;
    }

    steps.push(createStep({
        stepNumber: steps.length + 1,
        title: 'Mark Odd Rows',
        description: 'Select rows where right column is odd',
        calculation: 'Keep rows with ODD right value',
        result: { oddRows: table.filter(r => r.isOdd).map(r => r.left) },
        explanation: 'Mark every row where the right number is odd. These left values will be summed.'
    }));

    const oddLeftValues = table.filter(r => r.isOdd).map(r => r.left);
    let sum = 0;
    
    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.CALCULATION,
        title: 'Sum Marked Values',
        description: `Add all marked left values: ${oddLeftValues.join(' + ')}`,
        calculation: oddLeftValues.join(' + '),
        result: { oddLeftValues },
        explanation: 'Add together all the left values from marked rows.'
    }));

    for (let i = 0; i < oddLeftValues.length; i++) {
        sum += oddLeftValues[i];
        
        if (i < oddLeftValues.length - 1) {
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.CALCULATION,
                title: `Add ${oddLeftValues[i]}`,
                description: `Running total: ${sum}`,
                calculation: `${sum - oddLeftValues[i]} + ${oddLeftValues[i]} = ${sum}`,
                result: { runningTotal: sum },
                explanation: `After adding ${oddLeftValues[i]}, the running total is ${sum}.`
            }));
        }
    }

    if (isNegative) {
        sum = -sum;
    }

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.INFO,
        title: 'Why It Works',
        description: 'Connection to binary decomposition',
        calculation: `${n2} = ${table.filter(r => r.isOdd).map(r => r.right).join(' + ')} (binary decomposition)`,
        explanation: `This works because ${n2} can be written as a sum of powers of 2. We\'re essentially computing: ${n1}×(${oddLeftValues.map((_, i) => Math.pow(2, i)).filter((_, i) => table[i]?.isOdd).join(' + ')})`
    }));

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Answer',
        description: 'Sum of marked values',
        calculation: `${num1} × ${num2} = ${sum}`,
        result: sum,
        explanation: `The Russian Peasant multiplication of ${num1} and ${num2} equals ${sum}.`
    }));

    return createCalculationResult({
        method: 'russianPeasant',
        methodName: 'Russian Peasant Multiplication',
        num1,
        num2,
        steps,
        finalAnswer: sum,
        timeComplexity: 'O(log n)',
        recommendedUse: 'Mental math without multiplication tables; understanding computer multiplication',
        alternative: 'Grade School Multiplication for faster calculation',
        verification: { expected: n1 * n2, correct: sum === n1 * n2 }
    });
}

function getExample() {
    return {
        num1: 25,
        num2: 13,
        description: 'Demonstrates doubling/halving: 25×13 = 325'
    };
}

function validateInput(num1, num2) {
    if (num1 > 1000000 || num2 > 1000000) {
        return {
            valid: false,
            message: 'Numbers too large. Consider Karatsuba algorithm for very large numbers.'
        };
    }
    return {
        valid: true,
        message: 'Russian Peasant works for any size numbers but is most educational for 2-4 digit numbers.'
    };
}

const RussianPeasant = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) { module.exports = RussianPeasant; }
global.RussianPeasant = RussianPeasant;

})(typeof window !== 'undefined' ? window : this);
