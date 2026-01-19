class ProgressManager {
    constructor() {
        this.loadStats();
        this.displayProgress();
        this.checkAchievements();
        this.setupEventListeners();
    }

    loadStats() {
        const savedStats = localStorage.getItem('mathGameStats');
        this.stats = savedStats ? JSON.parse(savedStats) : {
            totalStars: 0,
            bestStreak: 0,
            totalProblems: 0,
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
            achievements: []
        };
    }

    displayProgress() {
        document.getElementById('totalStars').textContent = this.stats.totalStars;
        document.getElementById('bestStreak').textContent = this.stats.bestStreak;
        document.getElementById('totalProblems').textContent = this.stats.totalProblems || 0;
        document.getElementById('achievementCount').textContent = this.stats.achievements ? this.stats.achievements.length : 0;

        const maxStars = 100;

        const additionPercent = Math.min((this.stats.additionStars / maxStars) * 100, 100);
        const subtractionPercent = Math.min((this.stats.subtractionStars / maxStars) * 100, 100);
        const multiplicationPercent = Math.min((this.stats.multiplicationStars / maxStars) * 100, 100);
        const divisionPercent = Math.min((this.stats.divisionStars / maxStars) * 100, 100);
        const funMathPercent = Math.min((this.stats.funMathStars / maxStars) * 100, 100);

        document.getElementById('additionFill').style.width = `${additionPercent}%`;
        document.getElementById('subtractionFill').style.width = `${subtractionPercent}%`;
        document.getElementById('multiplicationFill').style.width = `${multiplicationPercent}%`;
        document.getElementById('divisionFill').style.width = `${divisionPercent}%`;
        document.getElementById('funMathFill').style.width = `${funMathPercent}%`;

        document.getElementById('additionStars').textContent = this.stats.additionStars;
        document.getElementById('subtractionStars').textContent = this.stats.subtractionStars;
        document.getElementById('multiplicationStars').textContent = this.stats.multiplicationStars;
        document.getElementById('divisionStars').textContent = this.stats.divisionStars;
        document.getElementById('funMathStars').textContent = this.stats.funMathStars;

        document.getElementById('additionBest').textContent = this.stats.additionBest || 0;
        document.getElementById('subtractionBest').textContent = this.stats.subtractionBest || 0;
        document.getElementById('multiplicationBest').textContent = this.stats.multiplicationBest || 0;
        document.getElementById('divisionBest').textContent = this.stats.divisionBest || 0;
        document.getElementById('funMathBest').textContent = this.stats.funMathBest || 0;

        document.getElementById('additionLevel').textContent = this.stats.additionLevel || 1;
        document.getElementById('subtractionLevel').textContent = this.stats.subtractionLevel || 1;
        document.getElementById('multiplicationLevel').textContent = this.stats.multiplicationLevel || 1;
        document.getElementById('divisionLevel').textContent = this.stats.divisionLevel || 1;
        document.getElementById('funMathLevel').textContent = this.stats.funMathLevel || 1;

        document.getElementById('additionProblems').textContent = this.stats.additionProblems || 0;
        document.getElementById('subtractionProblems').textContent = this.stats.subtractionProblems || 0;
        document.getElementById('multiplicationProblems').textContent = this.stats.multiplicationProblems || 0;
        document.getElementById('divisionProblems').textContent = this.stats.divisionProblems || 0;
        document.getElementById('funMathProblems').textContent = this.stats.funMathProblems || 0;

        const lastPlayed = document.getElementById('lastPlayed');
        if (this.stats.lastPlayed) {
            const date = new Date(this.stats.lastPlayed);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) {
                lastPlayed.textContent = 'Just now';
            } else if (diffMins < 60) {
                lastPlayed.textContent = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
            } else if (diffHours < 24) {
                lastPlayed.textContent = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else if (diffDays < 7) {
                lastPlayed.textContent = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            } else {
                lastPlayed.textContent = date.toLocaleDateString();
            }
        } else {
            lastPlayed.textContent = 'Never';
        }
    }

    checkAchievements() {
        const achievements = [
            {
                id: 'first_star',
                icon: '⭐',
                title: 'First Star',
                description: 'Earn your first star!',
                unlocked: this.stats.totalStars >= 1
            },
            {
                id: 'star_10',
                icon: '🌟',
                title: 'Star Collector',
                description: 'Earn 10 stars!',
                unlocked: this.stats.totalStars >= 10
            },
            {
                id: 'star_50',
                icon: '✨',
                title: 'Star Master',
                description: 'Earn 50 stars!',
                unlocked: this.stats.totalStars >= 50
            },
            {
                id: 'streak_5',
                icon: '🔥',
                title: 'On Fire!',
                description: 'Get a 5-streak!',
                unlocked: this.stats.bestStreak >= 5
            },
            {
                id: 'streak_10',
                icon: '💥',
                title: 'Unstoppable!',
                description: 'Get a 10-streak!',
                unlocked: this.stats.bestStreak >= 10
            },
            {
                id: 'addition_expert',
                icon: '➕',
                title: 'Addition Expert',
                description: 'Complete 20 addition problems!',
                unlocked: this.stats.additionStars >= 20
            },
            {
                id: 'subtraction_expert',
                icon: '➖',
                title: 'Subtraction Expert',
                description: 'Complete 20 subtraction problems!',
                unlocked: this.stats.subtractionStars >= 20
            },
            {
                id: 'multiplication_expert',
                icon: '✖️',
                title: 'Multiplication Expert',
                description: 'Complete 20 multiplication problems!',
                unlocked: this.stats.multiplicationStars >= 20
            },
            {
                id: 'division_expert',
                icon: '➗',
                title: 'Division Expert',
                description: 'Complete 20 division problems!',
                unlocked: this.stats.divisionStars >= 20
            },
            {
                id: 'fun_math_master',
                icon: '🎲',
                title: 'Fun Math Master',
                description: 'Complete 20 fun math activities!',
                unlocked: this.stats.funMathStars >= 20
            },
            {
                id: 'math_ninja',
                icon: '🥷',
                title: 'Math Ninja',
                description: 'Complete 5 problems in each operation!',
                unlocked: this.stats.additionStars >= 5 &&
                          this.stats.subtractionStars >= 5 &&
                          this.stats.multiplicationStars >= 5 &&
                          this.stats.divisionStars >= 5
            },
            {
                id: 'dedicated_learner',
                icon: '📚',
                title: 'Dedicated Learner',
                description: 'Complete all operations!',
                unlocked: this.stats.additionStars >= 1 &&
                          this.stats.subtractionStars >= 1 &&
                          this.stats.multiplicationStars >= 1 &&
                          this.stats.divisionStars >= 1 &&
                          this.stats.funMathStars >= 1
            },
            {
                id: 'perfect_score',
                icon: '💯',
                title: 'Perfect Score',
                description: 'Get 100 stars in one category!',
                unlocked: this.stats.additionStars >= 100 ||
                          this.stats.subtractionStars >= 100 ||
                          this.stats.multiplicationStars >= 100 ||
                          this.stats.divisionStars >= 100 ||
                          this.stats.funMathStars >= 100
            }
        ];

        const container = document.getElementById('achievementsGrid');
        container.innerHTML = '';

        achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = `achievement-badge ${achievement.unlocked ? '' : 'locked'}`;
            badge.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;
            container.appendChild(badge);

            if (achievement.unlocked && !this.stats.achievements.includes(achievement.id)) {
                this.stats.achievements.push(achievement.id);
            }
        });

        this.saveStats();
    }

    setupEventListeners() {
        document.getElementById('resetProgress').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all your progress? This cannot be undone!')) {
                this.resetProgress();
            }
        });
    }

    resetProgress() {
        this.stats = {
            totalStars: 0,
            bestStreak: 0,
            totalProblems: 0,
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
            achievements: []
        };

        this.saveStats();
        this.displayProgress();
        this.checkAchievements();

        alert('Progress has been reset! Good luck on your math adventure! 🌟');
    }

    saveStats() {
        localStorage.setItem('mathGameStats', JSON.stringify(this.stats));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProgressManager();
});
