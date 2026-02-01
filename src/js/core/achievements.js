class AchievementSystem {
    constructor() {
        this.achievements = this.defineAchievements();
        this.unlockedAchievements = this.loadUnlockedAchievements();
    }

    defineAchievements() {
        return {
            // Streak Achievements
            streak_5: {
                id: 'streak_5',
                name: 'On Fire!',
                description: 'Get a streak of 5 correct answers',
                icon: '🔥',
                color: '#ff6b6b',
                requirement: 5,
                category: 'streak'
            },
            streak_10: {
                id: 'streak_10',
                name: 'Unstoppable!',
                description: 'Get a streak of 10 correct answers',
                icon: '⚡',
                color: '#ffd93d',
                requirement: 10,
                category: 'streak'
            },
            streak_25: {
                id: 'streak_25',
                name: 'Math Master!',
                description: 'Get a streak of 25 correct answers',
                icon: '👑',
                color: '#ffd700',
                requirement: 25,
                category: 'streak'
            },
            streak_50: {
                id: 'streak_50',
                name: 'Legendary!',
                description: 'Get a streak of 50 correct answers',
                icon: '🏆',
                color: '#ff6b9d',
                requirement: 50,
                category: 'streak'
            },

            // Star Achievements
            stars_50: {
                id: 'stars_50',
                name: 'Star Collector',
                description: 'Earn 50 stars total',
                icon: '⭐',
                color: '#ffd700',
                requirement: 50,
                category: 'stars'
            },
            stars_100: {
                id: 'stars_100',
                name: 'Star Hoarder',
                description: 'Earn 100 stars total',
                icon: '🌟',
                color: '#ff6b9d',
                requirement: 100,
                category: 'stars'
            },
            stars_250: {
                id: 'stars_250',
                name: 'Star Legend',
                description: 'Earn 250 stars total',
                icon: '✨',
                color: '#a29bfe',
                requirement: 250,
                category: 'stars'
            },
            stars_500: {
                id: 'stars_500',
                name: 'Supernova!',
                description: 'Earn 500 stars total',
                icon: '💫',
                color: '#6c5ce7',
                requirement: 500,
                category: 'stars'
            },

            // Problem Count Achievements
            problems_10: {
                id: 'problems_10',
                name: 'Getting Started',
                description: 'Solve 10 problems',
                icon: '📝',
                color: '#74b9ff',
                requirement: 10,
                category: 'problems'
            },
            problems_50: {
                id: 'problems_50',
                name: 'Problem Solver',
                description: 'Solve 50 problems',
                icon: '📚',
                color: '#0984e3',
                requirement: 50,
                category: 'problems'
            },
            problems_100: {
                id: 'problems_100',
                name: 'Math Whiz',
                description: 'Solve 100 problems',
                icon: '🎓',
                color: '#00b894',
                requirement: 100,
                category: 'problems'
            },
            problems_500: {
                id: 'problems_500',
                name: 'Math Genius',
                description: 'Solve 500 problems',
                icon: '🧠',
                color: '#6c5ce7',
                requirement: 500,
                category: 'problems'
            },

            // Game-Specific Achievements
            addition_master: {
                id: 'addition_master',
                name: 'Addition Ace',
                description: 'Solve 20 addition problems',
                icon: '➕',
                color: '#00cec9',
                requirement: 20,
                category: 'game',
                game: 'addition'
            },
            subtraction_master: {
                id: 'subtraction_master',
                name: 'Subtraction Star',
                description: 'Solve 20 subtraction problems',
                icon: '➖',
                color: '#fd79a8',
                requirement: 20,
                category: 'game',
                game: 'subtraction'
            },
            multiplication_master: {
                id: 'multiplication_master',
                name: 'Multiplication Master',
                description: 'Solve 20 multiplication problems',
                icon: '✖️',
                color: '#fdcb6e',
                requirement: 20,
                category: 'game',
                game: 'multiplication'
            },
            division_master: {
                id: 'division_master',
                name: 'Division Dynamo',
                description: 'Solve 20 division problems',
                icon: '➗',
                color: '#74b9ff',
                requirement: 20,
                category: 'game',
                game: 'division'
            },
            all_games: {
                id: 'all_games',
                name: 'Well Rounded',
                description: 'Play all 4 math games',
                icon: '🎯',
                color: '#a29bfe',
                requirement: 4,
                category: 'game',
                checkType: 'uniqueGames'
            },

            // Special Achievements
            no_hints: {
                id: 'no_hints',
                name: 'Independent Thinker',
                description: 'Solve 10 problems without using hints',
                icon: '💡',
                color: '#ffeaa7',
                requirement: 10,
                category: 'special',
                checkType: 'noHints'
            },
            speed_demon: {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Solve 5 problems in under 30 seconds each',
                icon: '⚡',
                color: '#e17055',
                requirement: 5,
                category: 'special',
                checkType: 'speed'
            },
            perfectionist: {
                id: 'perfectionist',
                name: 'Perfectionist',
                description: 'Get 20 correct answers in a row on first try',
                icon: '💎',
                color: '#00cec9',
                requirement: 20,
                category: 'special',
                checkType: 'perfectStreak'
            },
            early_bird: {
                id: 'early_bird',
                name: 'Early Bird',
                description: 'Play before 8 AM',
                icon: '🌅',
                color: '#fdcb6e',
                requirement: 1,
                category: 'special',
                checkType: 'timeOfDay',
                beforeHour: 8
            },
            night_owl: {
                id: 'night_owl',
                name: 'Night Owl',
                description: 'Play after 8 PM',
                icon: '🌙',
                color: '#6c5ce7',
                requirement: 1,
                category: 'special',
                checkType: 'timeOfDay',
                afterHour: 20
            },
            comeback: {
                id: 'comeback',
                name: 'Comeback Kid',
                description: 'Get a streak of 5 after getting one wrong',
                icon: '🔄',
                color: '#00b894',
                requirement: 5,
                category: 'special',
                checkType: 'comeback'
            }
        };
    }

    loadUnlockedAchievements() {
        try {
            const saved = localStorage.getItem('mathGameAchievements');
            if (saved) {
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (e) {
            console.error('Error loading achievements:', e);
        }
        return [];
    }

    saveUnlockedAchievements() {
        try {
            localStorage.setItem('mathGameAchievements', JSON.stringify(this.unlockedAchievements));
        } catch (e) {
            console.error('Error saving achievements:', e);
        }
    }

    checkAchievements(stats, gameType = null) {
        const newlyUnlocked = [];
        
        try {
            for (const [key, achievement] of Object.entries(this.achievements)) {
                if (this.unlockedAchievements.includes(achievement.id)) continue;

                let shouldUnlock = false;

                switch (achievement.category) {
                    case 'streak':
                        if (stats.streak >= achievement.requirement) {
                            shouldUnlock = true;
                        }
                        break;

                    case 'stars':
                        if (stats.totalStars >= achievement.requirement) {
                            shouldUnlock = true;
                        }
                        break;

                    case 'problems':
                        if (stats.totalProblems >= achievement.requirement) {
                            shouldUnlock = true;
                        }
                        break;

                    case 'game':
                        if (achievement.game && gameType === achievement.game) {
                            const gameProblems = stats[`${achievement.game}Problems`] || 0;
                            if (gameProblems >= achievement.requirement) {
                                shouldUnlock = true;
                            }
                        } else if (achievement.checkType === 'uniqueGames') {
                            const gamesPlayed = ['addition', 'subtraction', 'multiplication', 'division']
                                .filter(game => (stats[`${game}Problems`] || 0) > 0).length;
                            if (gamesPlayed >= achievement.requirement) {
                                shouldUnlock = true;
                            }
                        }
                        break;

                    case 'special':
                        shouldUnlock = this.checkSpecialAchievement(achievement, stats);
                        break;
                }

                if (shouldUnlock) {
                    this.unlockedAchievements.push(achievement.id);
                    newlyUnlocked.push(achievement);
                }
            }

            if (newlyUnlocked.length > 0) {
                this.saveUnlockedAchievements();
            }
        } catch (e) {
            console.error('Error checking achievements:', e);
        }

        return newlyUnlocked;
    }

    checkSpecialAchievement(achievement, stats) {
        switch (achievement.checkType) {
            case 'noHints':
                return (stats.problemsWithoutHints || 0) >= achievement.requirement;

            case 'speed':
                return (stats.fastProblems || 0) >= achievement.requirement;

            case 'perfectStreak':
                return (stats.perfectStreak || 0) >= achievement.requirement;

            case 'timeOfDay':
                const hour = new Date().getHours();
                if (achievement.beforeHour !== undefined) {
                    return hour < achievement.beforeHour;
                }
                if (achievement.afterHour !== undefined) {
                    return hour >= achievement.afterHour;
                }
                return false;

            case 'comeback':
                return stats.comebackStreak >= achievement.requirement;

            default:
                return false;
        }
    }

    getUnlockedAchievements() {
        return this.unlockedAchievements.map(id => this.achievements[id]).filter(Boolean);
    }

    getLockedAchievements() {
        return Object.values(this.achievements).filter(a => !this.unlockedAchievements.includes(a.id));
    }

    getAllAchievements() {
        return Object.values(this.achievements);
    }

    getAchievementProgress(achievement, stats) {
        let current = 0;
        let target = achievement.requirement;

        switch (achievement.category) {
            case 'streak':
                current = stats.streak || 0;
                break;
            case 'stars':
                current = stats.totalStars || 0;
                break;
            case 'problems':
                current = stats.totalProblems || 0;
                break;
            case 'game':
                if (achievement.game) {
                    current = stats[`${achievement.game}Problems`] || 0;
                } else if (achievement.checkType === 'uniqueGames') {
                    current = ['addition', 'subtraction', 'multiplication', 'division']
                        .filter(game => (stats[`${game}Problems`] || 0) > 0).length;
                }
                break;
            case 'special':
                if (achievement.checkType === 'noHints') {
                    current = stats.problemsWithoutHints || 0;
                } else if (achievement.checkType === 'speed') {
                    current = stats.fastProblems || 0;
                } else if (achievement.checkType === 'perfectStreak') {
                    current = stats.perfectStreak || 0;
                } else if (achievement.checkType === 'comeback') {
                    current = stats.comebackStreak || 0;
                }
                break;
        }

        return { current, target, percentage: Math.min(100, (current / target) * 100) };
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, ${achievement.color} 0%, ${this.darkenColor(achievement.color, 20)} 100%);
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

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
}