(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'vedicUrdhvaTiryak',
    name: 'Vedic Urdhva Tiryak',
    category: MethodCategory.VEDIC,
    difficulty: DifficultyLevel.INTERMEDIATE,
    displayOrder: 3,
    origin: {
        culture: 'Indian (Vedic Mathematics)',
        timePeriod: 'Ancient - ~500 CE',
        description: 'From the "Urdhva Tiryak" sutra meaning "Vertically and Crosswise", one of the most versatile Vedic multiplication techniques.'
    },
    whenToUse: [
        'Any two-digit or three-digit multiplication',
        'Mental math for medium-sized numbers',
        'When Nikhilam isn\'t applicable',
        'Building mathematical flexibility'
    ],
    advantages: [
        'Works for any size numbers',
        'Left-to-right calculation',
        'Organized column structure',
        'Good for mental calculation'
    ],
    disadvantages: [
        'Requires practice to master',
        'Complex for very large numbers',
        'Multiple crosswise calculations'
    ],
    speedRating: 'medium',
    mathPrinciple: 'Calculate diagonally from right to left, accumulating crosswise products and carries',
    relatedMethods: ['gradeSchool', 'vedicNikhilam', 'lattice']
});

function calculate(num1, num2) {
    const steps = [];
    const n1 = Math.abs(num1);
    const n2 = Math.abs(num2);
    const isNegative = (num1 < 0) !== (num2 < 0);

    const str1 = n1.toString();
    const str2 = n2.toString();
    const len1 = str1.length;
    const len2 = str2.length;
    const result = [];

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: 'Urdhva Tiryak Method',
        description: 'Vertical and Crosswise multiplication',
        calculation: `${num1} × ${num2}`,
        result: { num1: str1, num2: str2 },
        explanation: 'Work from right to left, calculating vertical products and crosswise sums for each diagonal.'
    }));

    steps.push(createStep({
        stepNumber: 2,
        type: StepType.VISUALIZATION,
        title: 'Number Setup',
        description: 'Write numbers for crosswise calculation',
        calculation: `  ${str1}\n× ${str2}`,
        visualization: {
            type: 'urdhva_setup',
            num1: str1,
            num2: str2
        },
        explanation: 'We will work diagonally, starting from the rightmost digit positions.'
    }));

    const totalPositions = len1 + len2 - 1;

    for (let i = totalPositions - 1; i >= 0; i--) {
        let sum = 0;
        let products = [];
        let positions = [];

        for (let j = 0; j < len1; j++) {
            const k = i - j;
            if (k >= 0 && k < len2) {
                const d1 = parseInt(str1[j]);
                const d2 = parseInt(str2[k]);
                const product = d1 * d2;
                sum += product;
                products.push({ d1, d2, product, pos1: j, pos2: k });
                positions.push({ j, k });
            }
        }

        const carry = Math.floor(sum / 10);
        const digit = sum % 10;
        const place = totalPositions - 1 - i;

        if (products.length === 1) {
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.MULTIPLY,
                title: `Position ${place}: Vertical`,
                description: `Multiply the single digit pair`,
                calculation: `${products[0].d1} × ${products[0].d2} = ${products[0].product}`,
                result: { digit, carry },
                position: i,
                explanation: 'Only one digit pair contributes to this position.'
            }));
        } else {
            let calcStr = products.map(p => `${p.d1}×${p.d2}`).join(' + ');
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.CALCULATION,
                title: `Position ${place}: Crosswise`,
                description: `Add crosswise products: ${calcStr}`,
                calculation: `${calcStr} = ${sum}`,
                result: { digit, carry, sum },
                position: i,
                digits: positions.map(p => ({ d1: str1[p.j], d2: str2[p.k] })),
                explanation: `Sum of crosswise products at position ${place} is ${sum}. Write ${digit}, carry ${carry}.`
            }));
        }

        if (carry > 0) {
            steps.push(createStep({
                stepNumber: steps.length + 1,
                type: StepType.CARRY,
                title: 'Carry Forward',
                description: `Carry ${carry} to next position`,
                carry: carry,
                position: i - 1,
                explanation: 'Add the carry to the next (left) position calculation.'
            }));
        }

        result.unshift({ digit, carry });
    }

    let finalResult = 0;
    let num = result.filter(r => r.digit !== undefined || r.carry !== undefined);
    
    for (let i = num.length - 1; i >= 0; i--) {
        if (num[i].digit !== undefined) {
            finalResult = finalResult * 10 + num[i].digit;
        }
    }

    if (isNegative) {
        finalResult = -finalResult;
    }

    steps.push(createStep({
        stepNumber: steps.length + 1,
        type: StepType.RESULT,
        title: 'Combine Results',
        description: 'Read the digits from left to right',
        calculation: `${num1} × ${num2} = ${finalResult}`,
        result: finalResult,
        explanation: `The Urdhva Tiryak method gives the product: ${finalResult}.`
    }));

    return createCalculationResult({
        method: 'vedicUrdhvaTiryak',
        methodName: 'Vedic Urdhva Tiryak Multiplication',
        num1,
        num2,
        steps,
        finalAnswer: finalResult,
        timeComplexity: 'O(n)',
        recommendedUse: 'General mental multiplication for 2-4 digit numbers',
        alternative: 'Grade School Multiplication for beginners',
        verification: { expected: n1 * n2, correct: finalResult === n1 * n2 }
    });
}

function getExample() {
    return {
        num1: 32,
        num2: 14,
        description: 'Demonstrates crosswise multiplication: 32×14 = 448'
    };
}

function validateInput(num1, num2) {
    const len = Math.max(num1.toString().length, num2.toString().length);
    if (len > 10) {
        return {
            valid: false,
            message: 'Numbers too large for practical Urdhva Tiryak. Consider Karatsuba algorithm.'
        };
    }
    return {
        valid: true,
        message: 'Urdhva Tiryak works for any size numbers but is most efficient for 2-4 digit numbers.'
    };
}

const VedicUrdhvaTiryak = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) { module.exports = VedicUrdhvaTiryak; }
global.VedicUrdhvaTiryak = VedicUrdhvaTiryak;

})(typeof window !== 'undefined' ? window : this);
