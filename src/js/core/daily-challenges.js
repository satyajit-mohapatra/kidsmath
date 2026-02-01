class DailyChallenges {
    constructor() {
        this.challenges = this.defineChallenges();
        this.completedChallenges = this.loadCompletedChallenges();
        this.currentDate = new Date().toDateString();
        this.checkAndResetDaily();
    }

    defineChallenges() {
        return {
            streak_3: {
                id: 'streak_3',
                name: 'Triple Threat',
                description: 'Get a streak of 3 correct answers',
                icon: '🔥',
                reward: 5,
                requirement: 3,
                category: 'streak',
                difficulty: 'easy'
            },
            streak_5: {
                id: 'streak_5',
                name: 'High Five',
                description: 'Get a streak of 5 correct answers',
                icon: '🖐️',
                reward: 10,
                requirement: 5,
                category: 'streak',
                difficulty: 'medium'
            },
            streak_10: {
                id: 'streak_10',
                name: 'Perfect Ten',
                description: 'Get a streak of 10 correct answers',
                icon: '💯',
                reward: 20,
                requirement: 10,
                category: 'streak',
                difficulty: 'hard'
            },
            problems_5: {
                id: 'problems_5',
                name: 'Quick Learner',
                description: 'Solve 5 problems today',
                icon: '📝',
                reward: 5,
                requirement: 5,
                category: 'problems',
                difficulty: 'easy'
            },
            problems_10: {
                id: 'problems_10',
                name: 'Math Marathon',
                description: 'Solve 10 problems today',
                icon: '🏃',
                reward: 10,
                requirement: 10,
                category: 'problems',
                difficulty: 'medium'
            },
            problems_20: {
                id: 'problems_20',
                name: 'Math Master',
                description: 'Solve 20 problems today',
                icon: '🏆',
                reward: 25,
                requirement: 20,
                category: 'problems',
                difficulty: 'hard'
            },
            stars_10: {
                id: 'stars_10',
                name: 'Star Hunter',
                description: 'Earn 10 stars today',
                icon: '⭐',
                reward: 5,
                requirement: 10,
                category: 'stars',
                difficulty: 'easy'
            },
            stars_25: {
                id: 'stars_25',
                name: 'Star Collector',
                description: 'Earn 25 stars today',
                icon: '🌟',
                reward: 15,
                requirement: 25,
                category: 'stars',
                difficulty: 'medium'
            },
            no_hints_5: {
                id: 'no_hints_5',
                name: 'Independent Thinker',
                description: 'Solve 5 problems without hints',
                icon: '💡',
                reward: 10,
                requirement: 5,
                category: 'no_hints',
                difficulty: 'medium'
            },
            all_operations: {
                id: 'all_operations',
                name: 'Well Rounded',
                description: 'Play all 4 math operations today',
                icon: '🎯',
                reward: 15,
                requirement: 4,
                category: 'variety',
                difficulty: 'medium'
            },
            speed_demon: {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Solve 3 problems in under 10 seconds each',
                icon: '⚡',
                reward: 10,
                requirement: 3,
                category: 'speed',
                difficulty: 'hard'
            },
            early_bird: {
                id: 'early_bird',
                name: 'Early Bird',
                description: 'Play before 9 AM',
                icon: '🌅',
                reward: 5,
                requirement: 1,
                category: 'time',
                difficulty: 'easy',
                checkType: 'timeOfDay',
                beforeHour: 9
            },
            night_owl: {
                id: 'night_owl',
                name: 'Night Owl',
                description: 'Play after 7 PM',
                icon: '🌙',
                reward: 5,
                requirement: 1,
                category: 'time',
                difficulty: 'easy',
                checkType: 'timeOfDay',
                afterHour: 19
            }
        };
    }

    loadCompletedChallenges() {
        try {
            const saved = localStorage.getItem('dailyChallenges');
            if (saved) {
                const data = JSON.parse(saved);
                if (data && data.date === this.currentDate) {
                    return Array.isArray(data.completed) ? data.completed : [];
                }
            }
        } catch (e) {
            console.error('Error loading daily challenges:', e);
        }
        return [];
    }

    saveCompletedChallenges() {
        try {
            const data = {
                date: this.currentDate,
                completed: this.completedChallenges,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('dailyChallenges', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving daily challenges:', e);
        }
    }

    checkAndResetDaily() {
        try {
            const saved = localStorage.getItem('dailyChallenges');
            if (saved) {
                const data = JSON.parse(saved);
                if (data && data.date !== this.currentDate) {
                    this.completedChallenges = [];
                    this.saveCompletedChallenges();
                }
            }
        } catch (e) {
            console.error('Error checking daily challenges:', e);
        }
    }

    getTodaysChallenges() {
        const allChallenges = Object.values(this.challenges);
        const easy = allChallenges.filter(c => c.difficulty === 'easy');
        const medium = allChallenges.filter(c => c.difficulty === 'medium');
        const hard = allChallenges.filter(c => c.difficulty === 'hard');

        const seed = this.getDaySeed();
        
        return [
            this.selectChallenge(easy, seed),
            this.selectChallenge(medium, seed + 1),
            this.selectChallenge(hard, seed + 2)
        ].filter(Boolean);
    }

    getDaySeed() {
        const date = new Date();
        return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    }

    selectChallenge(challenges, seed) {
        if (challenges.length === 0) return null;
        const index = seed % challenges.length;
        return challenges[index];
    }

    checkChallengeCompletion(challengeId, stats) {
        if (this.completedChallenges.includes(challengeId)) return false;

        const challenge = this.challenges[challengeId];
        if (!challenge) return false;

        let completed = false;

        switch (challenge.category) {
            case 'streak':
                if (stats.dailyStreak >= challenge.requirement) {
                    completed = true;
                }
                break;
            case 'problems':
                if (stats.dailyProblems >= challenge.requirement) {
                    completed = true;
                }
                break;
            case 'stars':
                if (stats.dailyStars >= challenge.requirement) {
                    completed = true;
                }
                break;
            case 'no_hints':
                if (stats.dailyProblemsWithoutHints >= challenge.requirement) {
                    completed = true;
                }
                break;
            case 'variety':
                const gamesPlayed = ['addition', 'subtraction', 'multiplication', 'division']
                    .filter(game => (stats[`daily${this.capitalize(game)}Problems`] || 0) > 0).length;
                if (gamesPlayed >= challenge.requirement) {
                    completed = true;
                }
                break;
            case 'speed':
                if (stats.dailyFastProblems >= challenge.requirement) {
                    completed = true;
                }
                break;
            case 'time':
                if (challenge.checkType === 'timeOfDay') {
                    const hour = new Date().getHours();
                    if (challenge.beforeHour !== undefined && hour < challenge.beforeHour) {
                        completed = true;
                    }
                    if (challenge.afterHour !== undefined && hour >= challenge.afterHour) {
                        completed = true;
                    }
                }
                break;
        }

        if (completed) {
            this.completedChallenges.push(challengeId);
            this.saveCompletedChallenges();
            return true;
        }

        return false;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getChallengeProgress(challenge, stats) {
        let current = 0;
        let target = challenge.requirement;

        switch (challenge.category) {
            case 'streak':
                current = stats.dailyStreak || 0;
                break;
            case 'problems':
                current = stats.dailyProblems || 0;
                break;
            case 'stars':
                current = stats.dailyStars || 0;
                break;
            case 'no_hints':
                current = stats.dailyProblemsWithoutHints || 0;
                break;
            case 'variety':
                current = ['addition', 'subtraction', 'multiplication', 'division']
                    .filter(game => (stats[`daily${this.capitalize(game)}Problems`] || 0) > 0).length;
                break;
            case 'speed':
                current = stats.dailyFastProblems || 0;
                break;
            case 'time':
                current = 1;
                break;
        }

        return { current, target, percentage: Math.min(100, (current / target) * 100) };
    }

    showChallengeCompleteNotification(challenge) {
        const notification = document.createElement('div');
        notification.className = 'challenge-notification';
        notification.innerHTML = `
            <div class="challenge-icon">${challenge.icon}</div>
            <div class="challenge-info">
                <div class="challenge-title">Daily Challenge Complete!</div>
                <div class="challenge-name">${challenge.name}</div>
                <div class="challenge-reward">+${challenge.reward} ⭐ bonus stars!</div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            max-width: 350px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    getTotalRewards() {
        return this.completedChallenges.reduce((total, challengeId) => {
            const challenge = this.challenges[challengeId];
            return total + (challenge ? challenge.reward : 0);
        }, 0);
    }

    getCompletedCount() {
        return this.completedChallenges.length;
    }

    getTodaysDate() {
        return this.currentDate;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DailyChallenges;
}