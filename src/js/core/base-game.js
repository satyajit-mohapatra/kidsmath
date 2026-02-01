class BaseGame {
    constructor(operation) {
        this.operation = operation;
        this.currentLevel = 1;
        this.stars = 0;
        this.streak = 0;
        this.currentProblem = null;
        this.usedHint = false;
        this.hintLevel = 0;
        this.soundEnabled = true;

        this.emojis = ['🌟', '🎈', '🎪', '🎯', '🎨', '🎭', '🎪', '🎪'];
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];

        this.loadStats();
        this.loadSoundPreference();
        this.loadAccessibilityPreferences();
        this.setupSoundToggle();
        this.setupAccessibilityToggles();
        this.setupDailyChallenges();
        this.dailyStats = this.initializeDailyStats();
    }

    initializeDailyStats() {
        const today = new Date().toDateString();
        try {
            const savedDailyStats = localStorage.getItem('dailyStats');
            
            if (savedDailyStats) {
                const stats = JSON.parse(savedDailyStats);
                if (stats && stats.date === today) {
                    return stats;
                }
            }
        } catch (e) {
            console.error('Error loading daily stats:', e);
        }
        
        const newStats = {
            date: today,
            dailyStreak: 0,
            dailyProblems: 0,
            dailyStars: 0,
            dailyProblemsWithoutHints: 0,
            dailyFastProblems: 0,
            dailyAdditionProblems: 0,
            dailySubtractionProblems: 0,
            dailyMultiplicationProblems: 0,
            dailyDivisionProblems: 0,
            lastProblemTime: null
        };
        
        try {
            localStorage.setItem('dailyStats', JSON.stringify(newStats));
        } catch (e) {
            console.error('Error saving daily stats:', e);
        }
        return newStats;
    }

    saveDailyStats() {
        try {
            localStorage.setItem('dailyStats', JSON.stringify(this.dailyStats));
        } catch (e) {
            console.error('Error saving daily stats:', e);
        }
    }

    setupDailyChallenges() {
        if (typeof DailyChallenges !== 'undefined') {
            this.dailyChallenges = new DailyChallenges();
        }
    }

    loadAccessibilityPreferences() {
        const savedHighContrast = localStorage.getItem('mathGameHighContrast');
        const savedReducedMotion = localStorage.getItem('mathGameReducedMotion');
        
        if (savedHighContrast === 'true') {
            document.body.classList.add('high-contrast');
        }
        
        if (savedReducedMotion === 'true') {
            document.body.classList.add('reduced-motion');
        }
    }

    saveAccessibilityPreferences() {
        localStorage.setItem('mathGameHighContrast', document.body.classList.contains('high-contrast').toString());
        localStorage.setItem('mathGameReducedMotion', document.body.classList.contains('reduced-motion').toString());
    }

    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        this.saveAccessibilityPreferences();
        this.updateAccessibilityToggleButtons();
        return document.body.classList.contains('high-contrast');
    }

    toggleReducedMotion() {
        document.body.classList.toggle('reduced-motion');
        this.saveAccessibilityPreferences();
        this.updateAccessibilityToggleButtons();
        return document.body.classList.contains('reduced-motion');
    }

    setupAccessibilityToggles() {
        const highContrastBtn = document.getElementById('highContrastBtn');
        const reducedMotionBtn = document.getElementById('reducedMotionBtn');
        
        if (highContrastBtn) {
            highContrastBtn.addEventListener('click', () => this.toggleHighContrast());
        }
        
        if (reducedMotionBtn) {
            reducedMotionBtn.addEventListener('click', () => this.toggleReducedMotion());
        }
        
        this.updateAccessibilityToggleButtons();
    }

    updateAccessibilityToggleButtons() {
        const highContrastBtn = document.getElementById('highContrastBtn');
        const reducedMotionBtn = document.getElementById('reducedMotionBtn');
        
        if (highContrastBtn) {
            const isHighContrast = document.body.classList.contains('high-contrast');
            highContrastBtn.textContent = isHighContrast ? '🔲' : '⬜';
            highContrastBtn.title = isHighContrast ? 'High Contrast On (Click to Disable)' : 'High Contrast Off (Click to Enable)';
            highContrastBtn.classList.toggle('active', isHighContrast);
        }
        
        if (reducedMotionBtn) {
            const isReducedMotion = document.body.classList.contains('reduced-motion');
            reducedMotionBtn.textContent = isReducedMotion ? '⏹️' : '▶️';
            reducedMotionBtn.title = isReducedMotion ? 'Reduced Motion On (Click to Disable)' : 'Reduced Motion Off (Click to Enable)';
            reducedMotionBtn.classList.toggle('active', isReducedMotion);
        }
    }

    loadSoundPreference() {
        const savedSound = localStorage.getItem('mathGameSoundEnabled');
        if (savedSound !== null) {
            this.soundEnabled = savedSound === 'true';
        }
    }

    saveSoundPreference() {
        try {
            localStorage.setItem('mathGameSoundEnabled', this.soundEnabled.toString());
        } catch (e) {
            console.error('Error saving sound preference:', e);
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSoundPreference();
        this.updateSoundToggleButton();
        return this.soundEnabled;
    }

    setupSoundToggle() {
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        if (soundToggleBtn) {
            soundToggleBtn.addEventListener('click', () => this.toggleSound());
            this.updateSoundToggleButton();
        }

        const helpBtn = document.getElementById('helpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showKeyboardShortcuts());
        }
    }

    showKeyboardShortcuts() {
        const modal = document.getElementById('shortcutsModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    updateSoundToggleButton() {
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        if (soundToggleBtn) {
            soundToggleBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
            soundToggleBtn.title = this.soundEnabled ? 'Sound On (Click to Mute)' : 'Sound Off (Click to Unmute)';
            soundToggleBtn.classList.toggle('sound-off', !this.soundEnabled);
        }
    }

    loadStats() {
        try {
            const savedStats = localStorage.getItem('mathGameStats');
            if (savedStats) {
                const parsed = JSON.parse(savedStats);
                if (parsed && typeof parsed === 'object') {
                    this.globalStats = parsed;
                    return;
                }
            }
        } catch (e) {
            console.error('Error loading stats:', e);
        }
        
        this.globalStats = {
            totalStars: 0,
            bestStreak: 0,
            totalProblems: 0,
            correctProblems: 0,
            additionStars: 0,
            subtractionStars: 0,
            multiplicationStars: 0,
            divisionStars: 0,
            funMathStars: 0,
            socialSkillsStars: 0,
            advancedMathStars: 0,
            fractionsStars: 0,
            timeMoneyStars: 0,
            additionBest: 0,
            subtractionBest: 0,
            multiplicationBest: 0,
            divisionBest: 0,
            funMathBest: 0,
            socialSkillsBest: 0,
            advancedMathBest: 0,
            fractionsBest: 0,
            timeMoneyBest: 0,
            additionLevel: 1,
            subtractionLevel: 1,
            multiplicationLevel: 1,
            divisionLevel: 1,
            funMathLevel: 1,
            socialSkillsLevel: 1,
            advancedMathLevel: 1,
            fractionsLevel: 1,
            timeMoneyLevel: 1,
            additionProblems: 0,
            subtractionProblems: 0,
            multiplicationProblems: 0,
            divisionProblems: 0,
            funMathProblems: 0,
            socialSkillsProblems: 0,
            advancedMathProblems: 0,
            fractionsProblems: 0,
            timeMoneyProblems: 0,
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

        try {
            localStorage.setItem('mathGameStats', JSON.stringify(this.globalStats));
        } catch (e) {
            console.error('Error saving stats:', e);
        }
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
        try {
            localStorage.setItem('mathGameStats', JSON.stringify(this.globalStats));
        } catch (e) {
            console.error('Error saving stats:', e);
        }
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
        if (!container) return;

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
        if (!feedbackArea) return;
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
            this.generateProblem();
        }, 2000);
    }

    updateDailyStats(starsEarned) {
        const now = new Date();
        const today = now.toDateString();
        
        if (this.dailyStats.date !== today) {
            this.dailyStats = this.initializeDailyStats();
        }
        
        this.dailyStats.dailyStreak = this.streak;
        this.dailyStats.dailyProblems++;
        this.dailyStats.dailyStars += starsEarned;
        
        if (!this.usedHint) {
            this.dailyStats.dailyProblemsWithoutHints++;
        }
        
        if (this.dailyStats.lastProblemTime) {
            const timeDiff = now - new Date(this.dailyStats.lastProblemTime);
            if (timeDiff < 10000) {
                this.dailyStats.dailyFastProblems++;
            }
        }
        
        const gameKey = `daily${this.operation.charAt(0).toUpperCase() + this.operation.slice(1)}Problems`;
        this.dailyStats[gameKey] = (this.dailyStats[gameKey] || 0) + 1;
        
        this.dailyStats.lastProblemTime = now.toISOString();
        this.saveDailyStats();
    }

    checkDailyChallenges() {
        if (!this.dailyChallenges) return;
        
        const todaysChallenges = this.dailyChallenges.getTodaysChallenges();
        
        todaysChallenges.forEach(challenge => {
            if (this.dailyChallenges.checkChallengeCompletion(challenge.id, this.dailyStats)) {
                this.dailyChallenges.showChallengeCompleteNotification(challenge);
                this.stars += challenge.reward;
                this.updateStats();
                this.saveStats();
            }
        });
    }

    checkAchievements() {
        if (typeof AchievementSystem === 'undefined') return;
        
        if (!this.achievementSystem) {
            this.achievementSystem = new AchievementSystem();
        }
        
        const newlyUnlocked = this.achievementSystem.checkAchievements(this.globalStats, this.operation);
        
        newlyUnlocked.forEach(achievement => {
            this.achievementSystem.showAchievementNotification(achievement);
        });
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
        if (!this.soundEnabled) return;
        
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

        this.setupKeyboardShortcuts();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    const hintBtn = document.getElementById('hintBtn');
                    if (hintBtn && !hintBtn.disabled) {
                        hintBtn.click();
                    }
                    break;
                case 'Enter':
                    if (e.target.tagName !== 'INPUT') {
                        this.checkAnswer();
                    }
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                    const levelBtn = document.querySelector(`.level-btn[data-level="${e.key}"]`);
                    if (levelBtn) {
                        levelBtn.click();
                    }
                    break;
                case 'm':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleSound();
                    }
                    break;
                case 'h':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleHighContrast();
                    }
                    break;
                case 'r':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleReducedMotion();
                    }
                    break;
            }
        });
    }

    showLoading(message = 'Loading...') {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        const problemDisplay = document.querySelector('.problem-display');
        
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        if (loadingOverlay) {
            loadingOverlay.classList.add('show');
        }
        
        if (problemDisplay) {
            problemDisplay.classList.add('loading');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const problemDisplay = document.querySelector('.problem-display');
        
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
        }
        
        if (problemDisplay) {
            problemDisplay.classList.remove('loading');
        }
    }

    validateNumber(value, min = null, max = null) {
        const num = parseFloat(value);
        if (isNaN(num)) return null;
        if (min !== null && num < min) return null;
        if (max !== null && num > max) return null;
        return num;
    }

    validateInteger(value, min = null, max = null) {
        const num = parseInt(value);
        if (isNaN(num)) return null;
        if (min !== null && num < min) return null;
        if (max !== null && num > max) return null;
        return num;
    }
}
