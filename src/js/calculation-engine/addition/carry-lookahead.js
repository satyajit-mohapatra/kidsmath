(function(global) {
    'use strict';

    const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

    const METHOD_METADATA = createMethodMetadata({
        id: 'carryLookahead',
        name: 'Carry Lookahead',
        category: MethodCategory.COMPUTER,
        difficulty: DifficultyLevel.EXPERT,
        displayOrder: 3,
        origin: {
            culture: 'American',
            timePeriod: '1950s-1960s',
            description: 'Developed for computer hardware design to enable parallel carry calculation, dramatically speeding up processor addition units.'
        },
        whenToUse: [
            'Computer processor design',
            'Hardware optimization for large numbers',
            'Understanding how computers add efficiently',
            'Learning computer architecture'
        ],
        advantages: [
            'Enables parallel (simultaneous) carry calculation',
            'Much faster than sequential carry propagation',
            'Essential for high-performance processors'
        ],
        disadvantages: [
            'Overly complex for hand calculation',
            'Not practical for mental or paper math',
            'Requires understanding of binary logic'
        ],
        speedRating: 'very_fast',
        mathPrinciple: 'Generates and propagates carry signals in parallel rather than sequentially',
        relatedMethods: ['standard', 'kahan']
    });

    function calculate(num1, num2) {
        const steps = [];
        const n1 = Math.abs(num1);
        const n2 = Math.abs(num2);
        const isNegative = (num1 < 0) || (num2 < 0);
        
        const num1Bits = toBinaryString(n1);
        const num2Bits = toBinaryString(n2);
        const maxBits = Math.max(num1Bits.length, num2Bits.length);
        const paddedNum1 = num1Bits.padStart(maxBits, '0');
        const paddedNum2 = num2Bits.padStart(maxBits, '0');

        steps.push(createStep({
            stepNumber: 1,
            type: StepType.BINARY_OPERATION,
            title: 'Convert to Binary',
            description: 'Represent numbers in binary for bit-level operations',
            calculation: `${num1} = ${paddedNum1}, ${num2} = ${paddedNum2}`,
            result: { num1: paddedNum1, num2: paddedNum2 },
            explanation: 'Carry lookahead works at the binary bit level for maximum efficiency.'
        }));

        const generate = [];
        const propagate = [];
        const carries = [];
        const sum = [];

        for (let i = 0; i < maxBits; i++) {
            const a = parseInt(paddedNum1[maxBits - 1 - i]);
            const b = parseInt(paddedNum2[maxBits - 1 - i]);
            
            generate.push(a & b);
            propagate.push(a ^ b);
        }

        steps.push(createStep({
            stepNumber: 2,
            type: StepType.INFO,
            title: 'Calculate Generate/Propagate Signals',
            description: 'For each bit position, determine carry behavior',
            calculation: `Generate: ${generate.join(', ')}, Propagate: ${propagate.join(', ')}`,
            result: { generate, propagate },
            explanation: 'Generate = 1 means this position produces a carry. Propagate = 1 means this position forwards an incoming carry.'
        }));

        carries.push(generate[0] | (propagate[0] & 0));
        sum.push(propagate[0] ^ carries[0]);

        for (let i = 1; i < maxBits; i++) {
            let carryExpr = generate[i].toString();
            let carryCalc = generate[i];
            
            for (let j = 0; j < i; j++) {
                let term = propagate[i];
                for (let k = 0; k < j; k++) {
                    term = term & propagate[i - 1 - k];
                }
                const genTerm = generate[i - 1 - j];
                if (j === 0) {
                    carryExpr = `${generate[i]} | (${propagate[i]} & C_in)`;
                    carryCalc = generate[i] | (propagate[i] & carries[0]);
                } else {
                    carryExpr += ` | (${propagate.slice(0, i).join(' & ')} & C_in)`;
                }
            }
            
            carries.push(carryCalc);
            sum.push(propagate[i] ^ carries[i]);
        }

        steps.push(createStep({
            stepNumber: 3,
            type: StepType.BINARY_OPERATION,
            title: 'Calculate Carries in Parallel',
            description: 'Compute all carry values simultaneously',
            calculation: `C[0] = ${carries[0]}, C[1] = ${carries[1]}, ...`,
            result: { carries },
            explanation: 'Unlike standard addition, carry lookahead calculates all carries at once using parallel logic.'
        }));

        steps.push(createStep({
            stepNumber: 4,
            type: StepType.INFO,
            title: 'Compute Sum Bits',
            description: 'Each sum bit = propagate XOR carry_in',
            calculation: `Sum = ${sum.join(', ')}`,
            result: { sumBits: sum },
            explanation: 'With carries known, each sum bit is simply propagate XOR carry_in.'
        }));

        const resultBinary = sum.reverse().join('');
        const result = parseInt(resultBinary, 2);

        steps.push(createStep({
            stepNumber: 5,
            type: StepType.RESULT,
            title: 'Convert to Decimal',
            description: 'Binary result back to decimal',
            calculation: `${paddedNum1} + ${paddedNum2} = ${resultBinary} = ${result}`,
            result: result,
            explanation: `The carry lookahead addition of ${num1} and ${num2} yields ${result} in decimal.`
        }));

        if (isNegative) {
            steps.push(createStep({
                stepNumber: 6,
                type: StepType.INFO,
                title: 'Negative Number Handling',
                description: 'Note: Full negative number support requires two\'s complement representation',
                explanation: 'In practice, computers use two\'s complement for signed arithmetic.'
            }));
        }

        return createCalculationResult({
            method: 'carryLookahead',
            methodName: 'Carry Lookahead Addition',
            num1,
            num2,
            steps,
            finalAnswer: isNegative ? -result : result,
            timeComplexity: 'O(log n)',
            recommendedUse: 'Computer hardware design; not practical for manual calculation',
            alternative: 'Standard Addition for hand calculation',
            verification: { expected: num1 + num2, correct: (isNegative ? -result : result) === num1 + num2 }
        });
    }

    function toBinaryString(num) {
        if (num === 0) return '0';
        let binary = '';
        while (num > 0) {
            binary = (num % 2) + binary;
            num = Math.floor(num / 2);
        }
        return binary;
    }

    function getExample() {
        return {
            num1: 13,
            num2: 7,
            description: 'Binary: 1101 + 0111, demonstrates parallel carry calculation'
        };
    }

    function validateInput(num1, num2) {
        if (num1 < 0 || num2 < 0) {
            return {
                valid: false,
                message: 'Carry lookahead is typically used for unsigned integers. Use Two\'s Complement Subtraction for signed operations.'
            };
        }
        return {
            valid: true,
            message: 'Carry lookahead is primarily a computer algorithm, not practical for manual calculation.'
        };
    }

    const CarryLookahead = {
        METHOD_METADATA,
        calculate,
        getExample,
        validateInput,
        toBinaryString
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CarryLookahead;
    }

    global.CarryLookahead = CarryLookahead;

})(typeof window !== 'undefined' ? window : this);
