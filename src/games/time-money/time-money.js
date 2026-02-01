class TimeMoneyGame extends BaseGame {
    constructor() {
        super('timeMoney');
        this.currentActivity = 'clock';
        this.coins = [
            { name: 'penny', value: 1, symbol: '🪙', color: '#b87333' },
            { name: 'nickel', value: 5, symbol: '🪙', color: '#c0c0c0' },
            { name: 'dime', value: 10, symbol: '🪙', color: '#c0c0c0' },
            { name: 'quarter', value: 25, symbol: '🪙', color: '#c0c0c0' }
        ];
        this.bills = [
            { name: 'one', value: 100, symbol: '💵', color: '#85bb65' },
            { name: 'five', value: 500, symbol: '💵', color: '#85bb65' }
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateActivity();
    }

    setupEventListeners() {
        document.querySelectorAll('.activity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentActivity = e.target.dataset.activity;
                this.generateActivity();
            });
        });

        const hintBtn = document.getElementById('hintBtn');
        const mascot = document.getElementById('mascot');
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
        if (mascot) {
            mascot.addEventListener('click', () => this.mascotClick());
        }
    }

    generateActivity() {
        this.usedHint = false;
        this.hintLevel = 0;
        
        const hintContent = document.getElementById('hintContent');
        const feedbackArea = document.getElementById('feedbackArea');
        
        if (hintContent) hintContent.textContent = '';
        if (feedbackArea) feedbackArea.innerHTML = '';

        switch(this.currentActivity) {
            case 'clock':
                this.generateClockActivity();
                break;
            case 'digital':
                this.generateDigitalTimeActivity();
                break;
            case 'count':
                this.generateCountMoneyActivity();
                break;
            case 'change':
                this.generateMakeChangeActivity();
                break;
            case 'word':
                this.generateMoneyWordProblem();
                break;
        }
    }

    generateClockActivity() {
        const hour = this.randomNumber(1, 12);
        const minuteOptions = [0, 15, 30, 45];
        const minute = minuteOptions[this.randomNumber(0, 3)];
        
        this.currentProblem = {
            type: 'clock',
            hour: hour,
            minute: minute,
            answer: this.formatTime(hour, minute)
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="time-money-game">
                <h2 class="activity-title">🕐 What time is it?</h2>
                <div class="activity-hint">Look at the clock hands!</div>
                <div class="clock-container">
                    <div class="analog-clock" id="analogClock"></div>
                </div>
                <div class="time-input-area">
                    <div class="time-inputs">
                        <input type="number" class="time-input" id="hourInput" min="1" max="12" placeholder="HH">
                        <span class="time-separator">:</span>
                        <input type="number" class="time-input" id="minuteInput" min="0" max="59" placeholder="MM">
                    </div>
                    <button class="submit-btn" id="submitTime">Check! ✓</button>
                </div>
            </div>
        `;

        this.drawAnalogClock(hour, minute);
        this.setupTimeHandlers();
    }

    drawAnalogClock(hour, minute) {
        const clock = document.getElementById('analogClock');
        const hourAngle = (hour % 12) * 30 + minute * 0.5;
        const minuteAngle = minute * 6;
        
        let html = `
            <div class="clock-face">
                <div class="clock-center"></div>
                <div class="hour-hand" style="transform: rotate(${hourAngle}deg)"></div>
                <div class="minute-hand" style="transform: rotate(${minuteAngle}deg)"></div>
                <div class="clock-numbers">
                    <span class="clock-num" style="top: 5%; left: 50%; transform: translateX(-50%)">12</span>
                    <span class="clock-num" style="top: 50%; right: 5%; transform: translateY(-50%)">3</span>
                    <span class="clock-num" style="bottom: 5%; left: 50%; transform: translateX(-50%)">6</span>
                    <span class="clock-num" style="top: 50%; left: 5%; transform: translateY(-50%)">9</span>
                </div>
            </div>
        `;
        
        clock.innerHTML = html;
    }

    generateDigitalTimeActivity() {
        const hour = this.randomNumber(1, 12);
        const minute = this.randomNumber(0, 59);
        const timeStr = this.formatTime(hour, minute);
        
        this.currentProblem = {
            type: 'digital',
            hour: hour,
            minute: minute,
            answer: timeStr
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="time-money-game">
                <h2 class="activity-title">⌚ Set the time!</h2>
                <div class="activity-hint">Move the clock hands to show ${timeStr}</div>
                <div class="clock-container">
                    <div class="analog-clock interactive" id="interactiveClock">
                        <div class="clock-face">
                            <div class="clock-center"></div>
                            <div class="hour-hand" id="userHourHand" style="transform: rotate(0deg)"></div>
                            <div class="minute-hand" id="userMinuteHand" style="transform: rotate(0deg)"></div>
                            <div class="clock-numbers">
                                <span class="clock-num" style="top: 5%; left: 50%; transform: translateX(-50%)">12</span>
                                <span class="clock-num" style="top: 50%; right: 5%; transform: translateY(-50%)">3</span>
                                <span class="clock-num" style="bottom: 5%; left: 50%; transform: translateX(-50%)">6</span>
                                <span class="clock-num" style="top: 50%; left: 5%; transform: translateY(-50%)">9</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="time-controls">
                    <div class="hand-control">
                        <label>Hour Hand:</label>
                        <input type="range" id="hourSlider" min="0" max="360" value="0" step="30">
                    </div>
                    <div class="hand-control">
                        <label>Minute Hand:</label>
                        <input type="range" id="minuteSlider" min="0" max="360" value="0" step="6">
                    </div>
                </div>
                <button class="submit-btn" id="submitClock">Check! ✓</button>
            </div>
        `;

        this.setupInteractiveClock();
    }

    setupInteractiveClock() {
        const hourSlider = document.getElementById('hourSlider');
        const minuteSlider = document.getElementById('minuteSlider');
        const hourHand = document.getElementById('userHourHand');
        const minuteHand = document.getElementById('userMinuteHand');

        hourSlider.addEventListener('input', (e) => {
            hourHand.style.transform = `rotate(${e.target.value}deg)`;
        });

        minuteSlider.addEventListener('input', (e) => {
            minuteHand.style.transform = `rotate(${e.target.value}deg)`;
        });

        document.getElementById('submitClock').addEventListener('click', () => {
            const hourAngle = parseInt(hourSlider.value);
            const minuteAngle = parseInt(minuteSlider.value);
            
            const userHour = Math.round(hourAngle / 30) % 12 || 12;
            const userMinute = Math.round(minuteAngle / 6) % 60;
            
            if (userHour === this.currentProblem.hour && userMinute === this.currentProblem.minute) {
                this.handleCorrectAnswer();
            } else {
                this.handleIncorrectAnswer();
            }
        });
    }

    generateCountMoneyActivity() {
        const numCoins = this.randomNumber(2, 5);
        const selectedCoins = [];
        let totalValue = 0;

        for (let i = 0; i < numCoins; i++) {
            const coin = this.coins[this.randomNumber(0, this.coins.length - 1)];
            selectedCoins.push(coin);
            totalValue += coin.value;
        }

        this.currentProblem = {
            type: 'count',
            coins: selectedCoins,
            answer: totalValue
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="time-money-game">
                <h2 class="activity-title">💰 Count the money!</h2>
                <div class="activity-hint">Add up all the coins!</div>
                <div class="coins-container" id="coinsDisplay"></div>
                <div class="money-input-area">
                    <span class="dollar-sign">$</span>
                    <input type="number" class="money-input" id="moneyInput" min="0" step="0.01" placeholder="0.00">
                    <button class="submit-btn" id="submitMoney">Check! ✓</button>
                </div>
            </div>
        `;

        this.displayCoins(selectedCoins);
        this.setupMoneyHandlers();
    }

    displayCoins(coins) {
        const container = document.getElementById('coinsDisplay');
        let html = '<div class="coins-row">';
        
        coins.forEach(coin => {
            html += `
                <div class="coin" style="background: ${coin.color}">
                    <span class="coin-value">${coin.value}¢</span>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    generateMakeChangeActivity() {
        const itemPrice = this.randomNumber(25, 95);
        const payment = 100;
        const change = payment - itemPrice;

        this.currentProblem = {
            type: 'change',
            price: itemPrice,
            payment: payment,
            answer: change
        };

        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="time-money-game">
                <h2 class="activity-title">💵 Make the change!</h2>
                <div class="activity-hint">How much change should you get back?</div>
                <div class="transaction-display">
                    <div class="transaction-item">
                        <span class="transaction-label">Item costs:</span>
                        <span class="transaction-amount">$${(itemPrice / 100).toFixed(2)}</span>
                    </div>
                    <div class="transaction-item">
                        <span class="transaction-label">You paid:</span>
                        <span class="transaction-amount">$${(payment / 100).toFixed(2)}</span>
                    </div>
                </div>
                <div class="money-input-area">
                    <span class="dollar-sign">$</span>
                    <input type="number" class="money-input" id="changeInput" min="0" step="0.01" placeholder="0.00">
                    <button class="submit-btn" id="submitChange">Check! ✓</button>
                </div>
            </div>
        `;

        this.setupMoneyHandlers();
    }

    generateMoneyWordProblem() {
        const scenarios = [
            {
                text: "You have 3 quarters and 2 dimes. How much money do you have?",
                answer: 95
            },
            {
                text: "An apple costs 75¢. You give the cashier $1. How much change do you get?",
                answer: 25
            },
            {
                text: "You have 2 nickels and 4 pennies. How many cents do you have?",
                answer: 14
            },
            {
                text: "A toy costs $2.50. You have 2 quarters and 5 dimes. Do you have enough money?",
                answer: 100,
                yesNo: true
            }
        ];

        const scenario = scenarios[this.randomNumber(0, scenarios.length - 1)];
        
        this.currentProblem = {
            type: 'word',
            text: scenario.text,
            answer: scenario.answer,
            yesNo: scenario.yesNo || false
        };

        const display = document.getElementById('activityDisplay');
        
        if (scenario.yesNo) {
            display.innerHTML = `
                <div class="time-money-game">
                    <h2 class="activity-title">📝 Money Word Problem</h2>
                    <div class="word-problem-text">${scenario.text}</div>
                    <div class="yes-no-buttons">
                        <button class="yes-no-btn" data-answer="yes">Yes ✓</button>
                        <button class="yes-no-btn" data-answer="no">No ✗</button>
                    </div>
                </div>
            `;

            document.querySelectorAll('.yes-no-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const userAnswer = btn.dataset.answer;
                    const hasEnough = scenario.answer >= 250;
                    const correct = (userAnswer === 'yes' && hasEnough) || (userAnswer === 'no' && !hasEnough);
                    
                    if (correct) {
                        this.handleCorrectAnswer();
                    } else {
                        this.handleIncorrectAnswer();
                    }
                });
            });
        } else {
            display.innerHTML = `
                <div class="time-money-game">
                    <h2 class="activity-title">📝 Money Word Problem</h2>
                    <div class="word-problem-text">${scenario.text}</div>
                    <div class="money-input-area">
                        <input type="number" class="money-input cents" id="wordProblemInput" min="0" placeholder="cents">
                        <span class="cents-label">cents</span>
                        <button class="submit-btn" id="submitWord">Check! ✓</button>
                    </div>
                </div>
            `;

            this.setupMoneyHandlers();
        }
    }

    setupTimeHandlers() {
        const submitBtn = document.getElementById('submitTime');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.checkTimeAnswer());
        }

        const inputs = document.querySelectorAll('.time-input');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkTimeAnswer();
                }
            });
        });
    }

    setupMoneyHandlers() {
        const submitBtn = document.getElementById('submitMoney') || 
                         document.getElementById('submitChange') || 
                         document.getElementById('submitWord');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.checkMoneyAnswer());
        }

        const input = document.getElementById('moneyInput') || 
                     document.getElementById('changeInput') || 
                     document.getElementById('wordProblemInput');
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkMoneyAnswer();
                }
            });
        }
    }

    checkTimeAnswer() {
        const problem = this.currentProblem;
        const hourInput = document.getElementById('hourInput');
        const minuteInput = document.getElementById('minuteInput');
        
        const userHour = parseInt(hourInput.value);
        const userMinute = parseInt(minuteInput.value);
        
        if (userHour === problem.hour && userMinute === problem.minute) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    checkMoneyAnswer() {
        const problem = this.currentProblem;
        const input = document.getElementById('moneyInput') || 
                     document.getElementById('changeInput') || 
                     document.getElementById('wordProblemInput');
        
        const userAnswer = Math.round(parseFloat(input.value) * 100);
        
        if (userAnswer === problem.answer) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    formatTime(hour, minute) {
        return `${hour}:${minute.toString().padStart(2, '0')}`;
    }

    showHint() {
        this.hintLevel++;
        this.playTone(700, 0.15);

        const maxHints = 3;
        if (this.hintLevel > maxHints) {
            this.hintLevel = maxHints;
        }

        document.getElementById('hintCounter').textContent = `${this.hintLevel}/${maxHints}`;

        const mascot = document.getElementById('mascot');
        mascot.classList.add('talking');
        setTimeout(() => mascot.classList.remove('talking'), 500);

        let hintMessage = '';
        const problem = this.currentProblem;

        switch(problem.type) {
            case 'clock':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 The short hand (hour) points to ${problem.hour}!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `⏰ The long hand (minute) shows ${problem.minute} minutes!`;
                } else {
                    hintMessage = `✅ The time is ${this.formatTime(problem.hour, problem.minute)}!`;
                }
                break;
            case 'digital':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Move the hour hand to point at ${problem.hour}!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `⏰ Move the minute hand to ${problem.minute} minutes!`;
                } else {
                    hintMessage = `✅ Hour hand: ${problem.hour * 30}°, Minute hand: ${problem.minute * 6}°`;
                }
                break;
            case 'count':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Count each coin's value!`;
                } else if (this.hintLevel === 2) {
                    const values = problem.coins.map(c => c.value);
                    hintMessage = `🪙 You have: ${values.join('¢ + ')}¢`;
                } else {
                    hintMessage = `✅ Total: ${problem.answer}¢ = $${(problem.answer / 100).toFixed(2)}`;
                }
                break;
            case 'change':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Subtract: $${(problem.payment / 100).toFixed(2)} - $${(problem.price / 100).toFixed(2)}`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `💵 ${problem.payment}¢ - ${problem.price}¢ = ?`;
                } else {
                    hintMessage = `✅ Change: ${problem.answer}¢ = $${(problem.answer / 100).toFixed(2)}`;
                }
                break;
            case 'word':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Read the problem carefully!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `📝 Look for the numbers in the problem!`;
                } else {
                    hintMessage = `✅ Answer: ${problem.answer}¢`;
                }
                break;
        }

        document.getElementById('hintContent').innerHTML = hintMessage;
        document.getElementById('hintContent').style.animation = 'none';
        setTimeout(() => {
            document.getElementById('hintContent').style.animation = 'fadeIn 0.5s ease-out';
        }, 10);

        if (this.hintLevel === 1) {
            this.stars += 1;
            this.updateStats();
            this.saveStats();
        }

        this.showFeedback(this.getRandomEncouragement(), 'correct');
    }

    mascotClick() {
        const mascot = document.getElementById('mascot');
        const messages = [
            '⏰ Time is money!',
            '💰 Count your coins carefully!',
            '🕐 The short hand is the hour!',
            '🪙 Practice makes perfect!',
            '💵 Money skills are important!',
            '⏱️ The long hand is the minute!',
            '🎯 You can do it!',
            '⭐ Keep practicing!'
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('hintContent').textContent = message;

        mascot.style.transform = 'scale(1.3) rotate(360deg)';
        mascot.style.transition = 'transform 0.5s ease';
        this.playTone(900, 0.1);
        this.playTone(1100, 0.1);

        setTimeout(() => {
            mascot.style.transform = 'scale(1) rotate(0deg)';
        }, 500);
    }

    handleCorrectAnswer() {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus;

        this.updateDailyStats(bonus);
        this.updateStats();
        this.saveStats();
        this.checkAchievements();
        this.checkDailyChallenges();
        this.showFeedback(`Great job! ${this.getCelebrationEmoji()}`, 'correct');
        this.playSuccessSound();

        if (this.streak % 5 === 0) {
            this.showCelebration();
        }

        setTimeout(() => {
            this.generateActivity();
        }, 2000);
    }

    handleIncorrectAnswer(userAnswer) {
        this.streak = 0;
        this.trackIncorrectAnswer();
        this.updateStats();
        this.saveStats();

        let message = `Oops! Try again! 💪`;
        
        if (this.currentProblem.type === 'clock' || this.currentProblem.type === 'digital') {
            message = `Oops! Remember: short hand = hour, long hand = minute!`;
        } else if (this.currentProblem.type === 'count') {
            message = `Oops! Count each coin carefully!`;
        } else if (this.currentProblem.type === 'change') {
            message = `Oops! Subtract the price from what you paid!`;
        } else if (this.currentProblem.type === 'word') {
            message = `Oops! Read the problem again carefully!`;
        }

        this.showFeedback(message, 'incorrect');
        this.playErrorSound();
        
        // Clear time/money inputs
        const timeInputs = document.querySelectorAll('.time-input, .money-input');
        timeInputs.forEach(input => {
            if (input) input.value = '';
        });
        const firstInput = document.getElementById('hourInput') || document.getElementById('moneyInput');
        if (firstInput) firstInput.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TimeMoneyGame();
});