(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'lattice',
    name: 'Lattice Multiplication',
    category: MethodCategory.ANCIENT,
    difficulty: DifficultyLevel.ELEMENTARY,
    displayOrder: 5,
    origin: {
        culture: 'Medieval Islamic World / Medieval Europe',
        timePeriod: '13th-14th Century CE',
        description: 'Also known as "gelosia" multiplication, developed in the medieval Islamic world and later used in Europe. Popular in some modern elementary schools.'
    },
    whenToUse: [
        'Visual learners who prefer organized grids',
        'Teaching multiplication structure',
        'Students who struggle with carrying',
        'Any multiplication problem'
    ],
    advantages: [
        'Very visual and organized',
        'Reduces carrying errors',
        'Clear structure for partial products',
        'Good for teaching multiplication concepts'
    ],
    disadvantages: [
        'Requires drawing a grid',
        'Slower than other methods',
        'Takes more space',
        'Complex for large numbers'
    ],
    speedRating: 'slow',
    mathPrinciple: 'Create a grid where each cell holds a partial product (tens/ones), then sum along diagonals',
    relatedMethods: ['gradeSchool', 'russianPeasant']
});

function calculate(num1, num2) {
    const steps = [];
    const n1 = Math.abs(num1);
    const n2 = Math.abs(num2);
    const isNegative = (num1 < 0) !== (num2 < 0);

    const str1 = n1.toString();
    const str2 = n2.toString();
    const rows = str1.length;
    const cols = str2.length;
    const grid = [];

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.VISUALIZATION,
        title: 'Create Lattice Grid',
        description: `Create a ${rows}×${cols} grid for multiplication`,
        calculation: `  ${str1}\n× ${str2}`,
        visualization: {
            type: 'lattice_setup',
            rows: str1.split('').map(Number),
            cols: str2.split('').map(Number),
            dimensions: { rows, cols }
        },
        explanation: `Draw a ${rows}×${cols} grid. Write ${str1} across the top and ${str2} down the right side.`
    }));

    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            const d1 = parseInt(str1[i]);
            const d2 = parseInt(str2[j]);
            const product = d1 * d2;
            const tens = Math.floor(product / 10);
            const ones = product % 10;
            
            grid[i][j] = { tens, ones, product, d1, d2 };

            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.PARTIAL_PRODUCT,
                title: `Fill Cell [${i},${j}]`,
                description: `Calculate ${d1} × ${d2}`,
                calculation: `${d1} × ${d2} = ${product}`,
                result: { tens, ones, product },
                position: { row: i, col: j },
                explanation: `Write ${tens}/${ones} (tens above diagonal, ones below).`
            }));
        }
    }

    const diagonalSums = [];
    for (let d = 0; d < rows + cols - 1; d++) {
        let sum = 0;
        for (let i = 0; i < rows; i++) {
            const j = d - i;
            if (j >= 0 && j < cols) {
                sum += grid[i][j].ones;
            }
        }

        for (let i = Math.max(0, d - cols + 1); i <= Math.min(rows - 1, d); i++) {
            const j = d - i;
            if (j < cols) {
                const cell = grid[i][j];
                if (j < cols - 1 && i > 0) {
                    sum += cell.tens;
                }
            }
        }

        diagonalSums.push(sum);
    }

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.INFO,
        title: 'Add Along Diagonals',
        description: 'Sum numbers along diagonals from bottom-right to top-left',
        calculation: `Diagonal sums: ${diagonalSums.join(', ')}`,
        result: { diagonalSums },
        visualization: {
            type: 'lattice_diagonals',
            grid: grid.map(row => row.map(c => `${c.tens}/${c.ones}`)),
            diagonalSums
        },
        explanation: 'Starting from the bottom-right diagonal, add all numbers in each diagonal. Handle carries to the next diagonal.'
    }));

    let result = 0;
    let carry = 0;
    
    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.CALCULATION,
        title: 'Combine Diagonal Sums',
        description: 'Read result from diagonals, right to left',
        calculation: 'Process diagonals with carries',
        explanation: 'Read the digits from right to left, carrying as needed.'
    }));

    for (let d = 0; d < diagonalSums.length; d++) {
        const sum = diagonalSums[d] + carry;
        const digit = sum % 10;
        carry = Math.floor(sum / 10);
        result += digit * Math.pow(10, d);

        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.CALCULATION,
            title: `Diagonal ${d + 1}`,
            description: `Sum: ${diagonalSums[d]} + carry ${carry > 0 ? carry : 0}`,
            calculation: `${diagonalSums[d]} + ${d > 0 ? carry : 0} = ${sum}, digit: ${digit}`,
            result: { digit, carry },
            position: d,
            explanation: d === 0 
                ? `Rightmost diagonal sum is ${sum}. Write ${digit}, carry ${Math.floor(sum / 10)}.`
                : `After adding previous carry, digit is ${digit}.`
        }));
    }

    if (carry > 0) {
        result += carry * Math.pow(10, diagonalSums.length);
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.CALCULATION,
            title: 'Final Carry',
            description: `Add remaining carry: ${carry}`,
            calculation: `carry ${carry} becomes leftmost digit`,
            result: { digit: carry, position: diagonalSums.length },
            explanation: `The final carry of ${carry} becomes the highest place value digit.`
        }));
    }

    if (isNegative) {
        result = -result;
    }

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Final Answer',
        description: 'Read result from left to right',
        calculation: `${num1} × ${num2} = ${result}`,
        result: result,
        explanation: `The lattice multiplication of ${num1} and ${num2} equals ${result}.`
    }));

    return createCalculationResult({
        method: 'lattice',
        methodName: 'Lattice Multiplication',
        num1,
        num2,
        steps,
        finalAnswer: result,
        timeComplexity: 'O(n × m)',
        recommendedUse: 'Visual learners and teaching multiplication concepts',
        alternative: 'Grade School Multiplication for faster calculation',
        verification: { expected: n1 * n2, correct: result === n1 * n2 }
    });
}

function getExample() {
    return {
        num1: 23,
        num2: 45,
        description: '2×2 lattice multiplication: 23×45 = 1035'
    };
}

function validateInput(num1, num2) {
    const digits = Math.max(num1.toString().length, num2.toString().length);
    if (digits > 6) {
        return {
            valid: false,
            message: 'Lattice becomes impractical for numbers with more than 6 digits. Try Russian Peasant or Karatsuba.'
        };
    }
    return {
        valid: true,
        message: 'Lattice multiplication works best for 2-4 digit numbers.'
    };
}

const LatticeMultiplication = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) { module.exports = LatticeMultiplication; }
global.LatticeMultiplication = LatticeMultiplication;

})(typeof window !== 'undefined' ? window : this);
