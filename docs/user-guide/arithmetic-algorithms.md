# Arithmetic Algorithms - User Guide

Welcome to Arithmetic Algorithms! This tool helps you learn different ways to perform mathematical calculations, from traditional school methods to ancient techniques from around the world.

## Getting Started

### Choosing an Operation

At the top of the page, select which type of math problem you want to practice:

- **Addition** (+) - Combining numbers
- **Subtraction** (-) - Taking away numbers
- **Multiplication** (×) - Groups of numbers
- **Division** (÷) - Sharing equally

### Choosing a Method

Each operation offers multiple calculation methods. Click on a method to learn how it works:

| Difficulty | Description |
|------------|-------------|
| ⭐ | Beginner - Great for starting out |
| ⭐⭐ | Elementary - Some experience helpful |
| ⭐⭐⭐ | Intermediate - Requires practice |
| ⭐⭐⭐⭐ | Advanced - Complex concepts |
| ⭐⭐⭐⭐⭐ | Expert - Most challenging |

**Advanced methods** (⭐⭐⭐ and above) are marked with a badge and are best for older children or those wanting extra challenge.

---

## Available Methods

### Addition Methods

#### Standard Addition ⭐
The traditional method taught in schools worldwide.

**When to use:**
- Any addition problem
- Learning addition for the first time
- Quick calculations on paper

**Example:** 247 + 185

---

#### Kahan Summation ⭐⭐⭐
An error-correcting algorithm that minimizes rounding errors in decimal addition.

**When to use:**
- Adding many decimal numbers
- Financial calculations where precision matters
- Scientific measurements

**Example:** 0.1 + 0.2 (demonstrates precision)

**Note:** This is primarily a computer algorithm, but helps understand precision!

---

#### Carry Lookahead ⭐⭐⭐⭐⭐
A computer hardware method for extremely fast parallel calculation.

**When to use:**
- Learning how computers add efficiently
- Understanding computer architecture
- **Not practical for hand calculation**

**Example:** 13 + 7 (binary: 1101 + 0111)

---

### Subtraction Methods

#### Standard Subtraction ⭐
The column-based subtraction method taught in schools.

**When to use:**
- Any subtraction problem
- Learning subtraction basics
- Everyday calculations

**Example:** 432 - 187

---

#### Two's Complement ⭐⭐⭐⭐
The method computers use to handle negative numbers.

**When to use:**
- Understanding binary arithmetic
- Learning how computers handle signed numbers
- Computer science exploration

**Example:** 100 - 50 (demonstrates binary subtraction)

---

### Multiplication Methods

#### Grade School Multiplication ⭐
The traditional partial-products method.

**When to use:**
- General multiplication
- Learning the basics
- Any numbers

**Example:** 23 × 45

---

#### Vedic Nikhilam ⭐⭐⭐
Ancient Indian technique for numbers near powers of 10.

**When to use:**
- Numbers like 97, 96, 104, 103
- Mental math tricks
- Calculations near 100, 1000

**Example:** 97 × 96 (both near 100)

**Why it's special:** For 97×96, instead of multiplying directly:
- 97 is 3 below 100, 96 is 4 below 100
- Subtract one number from the other's base: 97 - 4 = 93
- Multiply the deficiencies: 3 × 4 = 12
- Result: 9312

---

#### Vedic Urdhva Tiryak ⭐⭐⭐
"Vertical and Crosswise" - a lightning-fast mental math method.

**When to use:**
- 2-4 digit numbers
- Mental math competitions
- Impressing friends with speed!

**Example:** 23 × 45

**How it works:**
```
    2   3
  × 4   5
  -----
  10   15  (2×5 + 3×4 = 22, write 2, carry 2...wait, let the steps guide you!)
```

---

#### Vedic Ekadhikena ⭐⭐
The "One More Than the One Before" method for squaring numbers ending in 5.

**When to use:**
- Squaring 15, 25, 35, 45...
- Mental math magic
- Quick calculations

**Example:** 25²

**The trick:**
1. Take the number before 5: 2
2. Add 1: 2 + 1 = 3
3. Multiply: 2 × 3 = 6
4. Append 25: 625

**Answer:** 25² = 625

---

#### Lattice Multiplication ⭐⭐
A beautiful grid-based visual method from medieval times.

**When to use:**
- Visual learners
- Teaching multiplication structure
- Organized approach to large numbers

**Example:** 23 × 45

Draw a grid with diagonals, fill in products, add along diagonals!

---

#### Russian Peasant ⭐⭐
Ancient Egyptian method using only doubling and halving.

**When to use:**
- No multiplication tables available
- Understanding binary
- Computer-like thinking

**Example:** 18 × 25

1. Write numbers at top of two columns
2. Halve left column (ignore remainders)
3. Double right column
4. Cross out rows where left number is even
5. Add remaining right numbers

---

#### Abacus Methods ⭐⭐⭐⭐
Traditional bead-based calculation techniques.

**When to use:**
- Learning abacus mental math
- Understanding place value
- Japanese/Soroban tradition

---

#### Karatsuba ⭐⭐⭐⭐⭐
Modern fast multiplication using recursive decomposition.

**When to use:**
- Very large numbers
- Understanding algorithm efficiency
- Computer science students

**Note:** Not practical for hand calculation with small numbers!

---

### Division Methods

#### Long Division ⭐⭐
The classic step-by-step division method.

**When to use:**
- General division
- Learning basics
- Finding remainders

**Example:** 847 ÷ 7

---

#### Vedic Paravartya ⭐⭐⭐⭐
"Transpose and Adjust" - Vedic method for division.

**When to use:**
- Divisors near powers of 10
- Mental division tricks
- Numbers like 12, 21, 98

**Example:** 1000 ÷ 8 (transpose method)

---

#### Synthetic Division ⭐⭐⭐
Shortcut method for polynomial division.

**When to use:**
- Algebra class
- Finding roots of polynomials
- Calculus preparation

**Example:** (x² + 5x + 6) ÷ (x + 2)

---

#### Non-Restoring Division ⭐⭐⭐⭐⭐
Computer algorithm for binary division.

**When to use:**
- Computer architecture study
- Binary arithmetic understanding
- Hardware design

---

#### Newton-Raphson ⭐⭐⭐⭐⭐
Iterative method using approximation and refinement.

**When to use:**
- Finding square roots
- Computer calculations
- Approximation techniques

---

## Step-by-Step Learning

The Arithmetic Algorithms tool provides interactive step-by-step guides:

1. **Navigation Buttons** - Use "Previous" and "Next" to move through steps
2. **Play Steps** - Watch the solution animate automatically
3. **Reset** - Start the problem over from the beginning
4. **Speed Control** - Adjust animation speed (1-5)

## Tips for Parents & Teachers

### Starting Out
Begin with **Standard Addition/Subtraction** methods to build confidence.

### Introducing Vedic Math
Start with **Ekadhikena** (squaring 5s) as it's easy to learn and impressive!

### Understanding Computer Methods
The computer methods (Carry Lookahead, Two's Complement, etc.) are great for:
- Explaining "how computers do math"
- STEM education
- Children interested in programming

### Advanced Challenges
For advanced students, try:
- Karatsuba multiplication
- Newton-Raphson division
- Polynomial synthetic division

## Example Presets

Each method includes curated example problems that demonstrate its unique strengths:

- Use the **dropdown menu** to select an example
- Examples are chosen to showcase the method's advantages
- Try different methods on the same numbers to compare!

---

## Scoring & Progress

- Earn **stars** for correct answers
- Build **streaks** by getting multiple correct in a row
- Track **methods learned** as you explore different techniques
- Progress saves automatically!

---

## Need Help?

- Click **"💡 Need a hint?"** for suggestions
- Click the **mascot** 🦊 for encouragement
- Use **"📖 How does this method work?"** for detailed explanations
- Try the **example presets** to see the method in action
