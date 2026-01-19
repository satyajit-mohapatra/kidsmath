class BaseGame {
    constructor(operation) {
        this.operation = operation;
        this.currentLevel = 1;
        this.stars = 0;
        this.streak = 0;
        this.currentProblem = null;
        this.usedHint = false;
        this.hintLevel = 0;

        this.emojis = ['🌟', '🎈', '🎪', '🎯', '🎨', '🎭', '🎪', '🎪'];
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];

        this.loadStats();
    }

    loadStats() {
        const savedStats = localStorage.getItem('mathGameStats');
        this.globalStats = savedStats ? JSON.parse(savedStats) : {
            totalStars: 0,
            bestStreak: 0,
            totalProblems: 0,
            correctProblems: 0,
            additionStars: 0,
            subtractionStars: 0,
            multiplicationStars: 0,
            divisionStars: 0,
            funMathStars: 0,
            additionBest: 0,
            subtractionBest: 0,
            multiplicationBest: 0,
            divisionBest: 0,
            funMathBest: 0,
            additionLevel: 1,
            subtractionLevel: 1,
            multiplicationLevel: 1,
            divisionLevel: 1,
            funMathLevel: 1,
            additionProblems: 0,
            subtractionProblems: 0,
            multiplicationProblems: 0,
            divisionProblems: 0,
            funMathProblems: 0,
            lastPlayed: null,
            sessionHistory: [],
            achievements: [],
            createdAt: new Date().toISOString()
        };

        this.stars = this.globalStats[this.operation + 'Stars'] || 0;
        this.updateStats();
    }

    saveStats() {
        this.globalStats[this.operation + 'Stars'] = this.stars;
        this.globalStats[this.operation + 'Best'] = Math.max(
            this.globalStats[this.operation + 'Best'] || 0,
            this.streak
        );
        this.globalStats[this.operation + 'Level'] = this.currentLevel;
        this.globalStats[this.operation + 'Problems'] = (this.globalStats[this.operation + 'Problems'] || 0) + 1;
        this.globalStats.totalStars = Math.max(this.globalStats.totalStars, this.stars);
        this.globalStats.bestStreak = Math.max(this.globalStats.bestStreak, this.streak);
        this.globalStats.lastPlayed = new Date().toISOString();
        this.globalStats.totalProblems = (this.globalStats.totalProblems || 0) + 1;

        this.addToSessionHistory('correct');

        localStorage.setItem('mathGameStats', JSON.stringify(this.globalStats));
    }

    addToSessionHistory(result) {
        const session = {
            operation: this.operation,
            level: this.currentLevel,
            result: result,
            stars: this.stars,
            streak: this.streak,
            timestamp: new Date().toISOString()
        };

        this.globalStats.sessionHistory = this.globalStats.sessionHistory || [];
        this.globalStats.sessionHistory.push(session);

        if (this.globalStats.sessionHistory.length > 100) {
            this.globalStats.sessionHistory = this.globalStats.sessionHistory.slice(-100);
        }
    }

    trackIncorrectAnswer() {
        this.globalStats.totalProblems = (this.globalStats.totalProblems || 0) + 1;
        this.globalStats[this.operation + 'Problems'] = (this.globalStats[this.operation + 'Problems'] || 0) + 1;
        this.globalStats.lastPlayed = new Date().toISOString();
        this.addToSessionHistory('incorrect');
        localStorage.setItem('mathGameStats', JSON.stringify(this.globalStats));
    }

    updateStats() {
        const starsElement = document.getElementById('stars');
        const streakElement = document.getElementById('streak');
        if (starsElement) starsElement.textContent = `⭐ ${this.stars}`;
        if (streakElement) streakElement.textContent = `🔥 ${this.streak}`;
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getCelebrationEmoji() {
        const emojis = ['🎉', '👏', '🌟', '✨', '💫', '🎊', '🏆', '👍'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    showCelebration() {
        const container = document.getElementById('celebration');

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';

                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

                container.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }

        this.showFeedback(`🎉 Amazing! ${this.streak} in a row! 🎉`, 'correct');
    }

    showFeedback(message, type) {
        const feedbackArea = document.getElementById('feedbackArea');
        feedbackArea.innerHTML = `
            <div class="feedback-message feedback-${type}">
                ${message}
            </div>
        `;
    }

    getRandomEncouragement() {
        const encouragements = [
            'You can do it! 💪',
            'Keep trying! 🌈',
            'Almost there! 🎯',
            'You\'re doing great! ⭐',
            'Don\'t give up! 🚀',
            'Believe in yourself! ✨',
            'One step at a time! 🎈',
            'Mistakes help us learn! 🌟'
        ];
        return encouragements[Math.floor(Math.random() * encouragements.length)];
    }

    handleCorrectAnswer() {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus;

        this.updateStats();
        this.saveStats();
        this.showFeedback(`Great job! ${this.getCelebrationEmoji()}`, 'correct');
        this.playSuccessSound();

        if (this.streak % 5 === 0) {
            this.showCelebration();
        }

        setTimeout(() => {
            this.generateProblem();
        }, 2000);
    }

    handleIncorrectAnswer(userAnswer) {
        this.streak = 0;
        this.trackIncorrectAnswer();
        this.updateStats();
        this.saveStats();

        const diff = Math.abs(userAnswer - this.currentProblem.answer);
        let message = `Oops! Try again! 💪`;

        if (diff <= 2) {
            message = `So close! ${userAnswer > this.currentProblem.answer ? 'Try a little smaller!' : 'Try a little bigger!'}`;
        } else if (diff <= 5) {
            message = `You're getting warmer! 🌡️`;
        }

        this.showFeedback(message, 'incorrect');
        this.playErrorSound();

        const answerInput = document.getElementById('answerInput');
        const columnContainer = document.getElementById('columnAnswerContainer');

        if (columnContainer && columnContainer.classList.contains('active')) {
            const inputs = columnContainer.querySelectorAll('.column-answer-input');
            inputs.forEach(input => {
                if (input.value === '' || input.disabled) return;
                input.select();
            });
        } else if (answerInput) {
            answerInput.select();
        }
    }

    playClickSound() {
        this.playTone(800, 0.1);
    }

    playSuccessSound() {
        this.playTone(523, 0.1);
        setTimeout(() => this.playTone(659, 0.1), 100);
        setTimeout(() => this.playTone(784, 0.2), 200);
    }

    playErrorSound() {
        this.playTone(200, 0.2);
        setTimeout(() => this.playTone(150, 0.2), 200);
    }

    playTone(frequency, duration) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
        }
    }

    setupLevelButtons() {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLevel = parseInt(e.target.dataset.level);
                this.generateProblem();
            });
        });
    }

    setupAnswerHandlers() {
        const submitBtn = document.getElementById('submitBtn');
        const answerInput = document.getElementById('answerInput');

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.checkAnswer());
        }

        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer();
                }
            });
        }
    }
}
