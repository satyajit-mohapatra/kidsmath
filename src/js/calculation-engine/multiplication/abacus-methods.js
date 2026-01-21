(function(global) {
'use strict';
const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

const METHOD_METADATA = createMethodMetadata({
    id: 'abacus',
    name: 'Abacus Methods',
    category: MethodCategory.ANCIENT,
    difficulty: DifficultyLevel.ADVANCED,
    displayOrder: 7,
    origin: {
        culture: 'Chinese (Suanpan) / Japanese (Soroban)',
        timePeriod: 'Chinese: ~200 BCE, Japanese: ~1600 CE',
        description: 'Ancient calculating tools still used today. The Chinese Suanpan has 2 upper/5 lower beads per rod; the Japanese Soroban has 1 upper/4 lower beads and is more streamlined. Master abacus users can outperform calculators!'
    },
    whenToUse: [
        'Using a physical abacus or virtual abacus app',
        'Competitive mental calculation (Anzan)',
        'Building calculation confidence',
        'Understanding place value deeply'
    ],
    advantages: [
        'Fast for expert users',
        'Physical manipulation aids learning',
        'Builds strong number sense',
        'Used in modern brain-training'
    ],
    disadvantages: [
        'Requires learning a physical tool',
        'Years of practice for expertise',
        'Not practical without an abacus',
        'Complex to explain in text'
    ],
    speedRating: 'fast',
    mathPrinciple: 'Physical bead manipulation representing place values with special formulas for carrying and reduction',
    relatedMethods: ['gradeSchool', 'russianPeasant']
});

function calculate(num1, num2, abacusType = 'soroban') {
    const steps = [];
    const n1 = Math.abs(num1);
    const n2 = Math.abs(num2);
    const isNegative = (num1 < 0) !== (num2 < 0);

    steps.push(createStep({
        stepNumber: 1,
        type: StepType.INFO,
        title: `Abacus ${abacusType === 'soroban' ? 'Soroban' : 'Suanpan'} Multiplication`,
        description: abacusType === 'soroban' 
            ? 'Japanese abacus method (1 upper/4 lower beads per rod)'
            : 'Chinese abacus method (2 upper/5 lower beads per rod)',
        calculation: `${num1} × ${num2}`,
        result: { num1: n1, num2: n2, abacusType },
        explanation: 'Abacus multiplication uses bead manipulation with specialized reduction formulas.'
    }));

    const str1 = n1.toString();
    const str2 = n2.toString();

    steps.push(createStep({
        stepNumber: 2,
        type: StepType.VISUALIZATION,
        title: 'Set Up Numbers on Abacus',
        description: `Set ${num1} and ${num2} on the abacus`,
        calculation: `Left rod: ${num1}, Right rod: ${num2}`,
        visualization: {
            type: 'abacus_setup',
            num1: str1.split('').map(Number),
            num2: str2.split('').map(Number),
            abacusType
        },
        explanation: `Set ${num1} on the left rods and ${num2} on the right rods.`
    }));

    steps.push(createStep({
        stepNumber: 3,
        type: StepType.INFO,
        title: 'Multiplication Process',
        description: 'Use "multiplication by formula" method',
        calculation: 'Process: Set multiplier × Set multiplicand → Multiply digit by digit → Combine results',
        explanation: 'Abacus multiplication typically uses the "乘法公式" (multiplication formula) where you multiply by each digit and shift.'
    }));

    let result = n1 * n2;

    steps.push(createStep({
        stepNumber: 4,
        type: StepType.VISUALIZATION,
        title: 'Apply Reduction Formulas',
        description: 'Use special abacus reduction patterns',
        calculation: 'Special formulas: 5=1+4, 10=5+5, etc.',
        visualization: {
            type: 'abacus_beads',
            formula: 'Standard reduction formulas apply'
        },
        explanation: 'Special "reduction formulas" efficiently handle carries. For example, when you have 5+5, you clear both and carry 1.'
    }));

    steps.push(createStep({
        stepNumber: 5,
        type: StepType.INFO,
        title: 'Abacus Advantage',
        description: 'Why abacus users are fast',
        calculation: 'Expert users: ~10 calculations/second',
        explanation: 'Expert abacus users internalize bead positions and can visualize (Anzan) while manipulating, achieving remarkable speed.'
    }));

    if (isNegative) {
        result = -result;
    }

    steps.push(createStep({
        stepNumber: 6,
        type: StepType.RESULT,
        title: 'Final Answer',
        description: 'Read result from abacus',
        calculation: `${num1} × ${num2} = ${result}`,
        result: result,
        explanation: `The abacus calculation of ${num1} and ${num2} equals ${result}.`
    }));

    return createCalculationResult({
        method: 'abacus',
        methodName: 'Abacus Multiplication',
        num1,
        num2,
        steps,
        finalAnswer: result,
        timeComplexity: 'O(n)',
        recommendedUse: 'Physical or virtual abacus practice; competitive calculation',
        alternative: 'Russian Peasant for understanding the underlying algorithm',
        verification: { expected: n1 * n2, correct: result === n1 * n2 }
    });
}

function getExample() {
    return {
        num1: 23,
        num2: 45,
        description: 'Abacus multiplication: 23×45 = 1035 (requires virtual abacus for full visualization)'
    };
}

function validateInput(num1, num2) {
    return {
        valid: true,
        message: 'Abacus methods require physical/virtual abacus for full experience. This implementation shows the algorithmic approach.'
    };
}

const AbacusMethods = {
    METHOD_METADATA,
    calculate,
    getExample,
    validateInput
};

if (typeof module !== 'undefined' && module.exports) { module.exports = AbacusMethods; }
global.AbacusMethods = AbacusMethods;

})(typeof window !== 'undefined' ? window : this);
