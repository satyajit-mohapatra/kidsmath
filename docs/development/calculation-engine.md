# Calculation Engine - Developer Guide

## Overview

The Calculation Engine is a modular system for generating step-by-step mathematical calculations. It's designed to:

1. Provide educational, interactive math problem solutions
2. Support multiple calculation methods per operation
3. Generate detailed steps with explanations
4. Work in browser environments without a build system

## Architecture

```
src/js/calculation-engine/
├── index.js                    # Main entry point, exports CalculationEngine
├── step-data.js                # Core data structures and helpers
├── addition/
│   ├── standard-addition.js
│   ├── kahan-summation.js
│   └── carry-lookahead.js
├── subtraction/
│   ├── standard-subtraction.js
│   └── twos-complement.js
├── multiplication/
│   ├── grade-school-multiplication.js
│   ├── vedic-nikhilam.js
│   ├── vedic-urdhva-tiryak.js
│   ├── vedic-ekadhikena.js
│   ├── lattice-multiplication.js
│   ├── russian-peasant.js
│   ├── abacus-methods.js
│   └── karatsuba.js
├── division/
│   ├── long-division.js
│   ├── vedic-paravartya.js
│   ├── synthetic-division.js
│   ├── non-restoring-division.js
│   └── newton-raphson.js
└── visualization/
    ├── grid-renderer.js
    ├── column-renderer.js
    └── binary-renderer.js
```

## Browser Compatibility

The calculation engine uses an IIFE (Immediately Invoked Function Expression) pattern to work in browsers without a bundler:

```javascript
(function(global) {
    'use strict';

    // Dependencies from global scope
    const { StepType, MethodCategory, ... } = global;

    // Module implementation
    function calculate(num1, num2) {
        // ... implementation
    }

    const ModuleName = {
        METHOD_METADATA,
        calculate,
        getExample,
        validateInput
    };

    // Export for both Node.js and browser
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ModuleName;
    }

    global.ModuleName = ModuleName;

})(typeof window !== 'undefined' ? window : this);
```

## Loading Order

In HTML files, scripts must load in this order:

1. `step-data.js` (core utilities)
2. Method files (addition → subtraction → multiplication → division)
3. `index.js` (assembles CalculationEngine)
4. `algorithm-game.js` (game logic)
5. Page-specific game script

## Core Data Structures

### Step Types (`StepType`)

```javascript
const StepType = {
    INPUT: 'input',           // Problem setup
    CALCULATION: 'calculation', // Math operation
    CARRY: 'carry',           // Carry in addition
    BORROW: 'borrow',         // Borrow in subtraction
    PARTIAL_PRODUCT: 'partial_product', // Multiplication partials
    ADD_DIAGONAL: 'add_diagonal', // Lattice diagonal addition
    SHIFT: 'shift',           // Shift operations
    DIVIDE: 'divide',         // Division step
    MULTIPLY: 'multiply',     // Multiplication in division
    SUBTRACT: 'subtract',     // Subtraction in division
    BRING_DOWN: 'bring_down', // Bring down digit
    REMAINDER: 'remainder',   // Final remainder
    RESULT: 'result',         // Final answer
    ANIMATION: 'animation',   // Animation frame
    BINARY_OPERATION: 'binary_operation', // Binary math
    VISUALIZATION: 'visualization', // Visual aid
    INFO: 'info'              // Informational text
};
```

### Method Categories (`MethodCategory`)

```javascript
const MethodCategory = {
    STANDARD: 'standard',     // Traditional school methods
    VEDIC: 'vedic',           // Ancient Indian techniques
    ANCIENT: 'ancient',       // Historical methods
    COMPUTER: 'computer',     // Computer science methods
    SPECIALIZED: 'specialized' // Domain-specific methods
};
```

### Difficulty Levels (`DifficultyLevel`)

```javascript
const DifficultyLevel = {
    BEGINNER: 1,      // ⭐
    ELEMENTARY: 2,    // ⭐⭐
    INTERMEDIATE: 3,  // ⭐⭐⭐
    ADVANCED: 4,      // ⭐⭐⭐⭐
    EXPERT: 5         // ⭐⭐⭐⭐⭐
};
```

## Creating a New Method

### 1. Create the Method File

Create a new file in the appropriate directory, e.g., `multiplication/new-method.js`:

```javascript
(function(global) {
    'use strict';

    const { StepType, MethodCategory, DifficultyLevel, createStep, createMethodMetadata, createCalculationResult } = global;

    const METHOD_METADATA = createMethodMetadata({
        id: 'newMethod',
        name: 'New Method Name',
        category: MethodCategory.STANDARD,
        difficulty: DifficultyLevel.BEGINNER,
        displayOrder: 1,
        origin: {
            culture: 'Culture/Region',
            timePeriod: 'Time period',
            description: 'Brief description of the method'
        },
        whenToUse: [
            'When to use this method'
        ],
        advantages: [
            'Key advantages'
        ],
        disadvantages: [
            'Potential drawbacks'
        ],
        speedRating: 'medium', // instant, very_fast, fast, medium, slow
        mathPrinciple: 'Brief description of the math principle',
        relatedMethods: ['relatedMethod1', 'relatedMethod2']
    });

    function calculate(num1, num2) {
        const steps = [];

        // Step 1: Set up the problem
        steps.push(createStep({
            stepNumber: 1,
            type: StepType.INPUT,
            title: 'Set Up Problem',
            description: 'Describe the setup',
            calculation: `${num1} op ${num2}`,
            explanation: 'Explain the setup'
        }));

        // Step 2: Calculation steps
        steps.push(createStep({
            stepNumber: 2,
            type: StepType.CALCULATION,
            title: 'Calculate',
            description: 'What to do',
            calculation: 'The math expression',
            result: { /* result data */ },
            explanation: 'Why this works'
        }));

        // ... more steps as needed

        // Final step: Result
        steps.push(createStep({
            stepNumber: steps.length + 1,
            type: StepType.RESULT,
            title: 'Final Answer',
            description: 'Combine results',
            calculation: `${num1} op ${num2} = ${result}`,
            result: result,
            explanation: `The answer is ${result}`
        }));

        return createCalculationResult({
            method: 'newMethod',
            methodName: 'New Method Name',
            num1,
            num2,
            steps,
            finalAnswer: result,
            timeComplexity: 'O(n)', // or O(log n), O(1), etc.
            recommendedUse: 'When to use this method',
            alternative: 'Alternative method',
            verification: { expected: /* expected result */, correct: /* boolean */ }
        });
    }

    function getExample() {
        return {
            num1: 10,
            num2: 20,
            description: 'Brief description of why this example works well'
        };
    }

    function validateInput(num1, num2) {
        // Return { valid: boolean, message: string }
        return {
            valid: true,
            message: ''
        };
    }

    const NewMethod = {
        METHOD_METADATA,
        calculate,
        getExample,
        validateInput
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = NewMethod;
    }

    global.NewMethod = NewMethod;

})(typeof window !== 'undefined' ? window : this);
```

### 2. Register in index.js

Add your method to the appropriate section in `index.js`:

```javascript
const MultiplicationMethods = {
    gradeSchool: global.GradeSchoolMultiplication,
    vedicNikhilam: global.VedicNikhilam,
    // ... existing methods
    newMethod: global.NewMethod  // Add here
};
```

### 3. Update the Game Logic

If needed, update `algorithm-game.js` to include your method:

```javascript
this.operations = {
    multiplication: {
        name: 'Multiplication',
        icon: '×',
        methods: ['gradeSchool', 'vedicNikhilam', /* ... */ 'newMethod']
    }
};
```

## Step Data Structure

### createStep() Options

```javascript
createStep({
    stepNumber: 1,           // Required: Step number
    type: StepType.INPUT,    // Required: Type of step
    title: 'Title',          // Required: Step title
    description: '...',      // Required: Brief description
    calculation: '...',      // Required: Math expression
    result: { /* data */ },  // Optional: Result data
    carry: 1,                // Optional: Carry value
    borrow: 1,               // Optional: Borrow value
    partialProduct: 12,      // Optional: Partial product
    position: 2,             // Optional: Position index
    digit: 5,                // Optional: Digit value
    bits: [1, 0, 1],         // Optional: Binary bits
    explanation: '...',      // Optional: Educational explanation
    visualization: { /* */ }, // Optional: Visualization data
    animationHint: '...'     // Optional: Animation hint
});
```

### createCalculationResult() Options

```javascript
createCalculationResult({
    method: 'methodId',      // Required: Method identifier
    methodName: 'Name',      // Required: Display name
    num1: 10,                // Required: First input
    num2: 20,                // Required: Second input
    steps: [],               // Required: Array of steps
    finalAnswer: 30,         // Required: Final result
    timeComplexity: 'O(n)',  // Optional: Algorithm complexity
    recommendedUse: '...',   // Optional: When to use
    alternative: '...',      // Optional: Alternative method
    verification: {          // Optional: Verification data
        expected: 30,
        correct: true
    }
});
```

## Visualization System

Visualizations are rendered based on step data. Each step can include a `visualization` property:

```javascript
steps.push(createStep({
    stepNumber: 1,
    type: StepType.VISUALIZATION,
    title: 'Visual Representation',
    visualization: {
        type: 'grid',
        data: { /* grid data */ }
    }
}));
```

Available visualization types:
- `grid` - Grid-based displays (lattice multiplication)
- `column` - Columnar representations
- `binary` - Binary number displays

## Testing Checklist

When creating or modifying a method:

- [ ] Handles edge cases (zero, negative numbers, decimals)
- [ ] All steps have proper explanations
- [ ] Final answer is mathematically correct
- [ ] Verification object confirms correctness
- [ ] getExample() returns valid numbers for the method
- [ ] validateInput() handles invalid inputs appropriately
- [ ] Step numbers are sequential
- [ ] All step types are appropriate for the operation

## Performance Considerations

- Avoid deep recursion for large numbers
- Use appropriate data structures for the algorithm
- Consider adding memoization for repeated calculations
- The visualization system can be CPU-intensive - consider lazy loading

## Browser Limitations

- JavaScript numbers are IEEE 754 doubles (precision limits around 2^53)
- Very large numbers may lose precision
- Some computer science methods (Karatsuba, Carry Lookahead) are primarily educational for browser use
