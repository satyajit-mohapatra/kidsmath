// XSS Protection Utility
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

class ProgressManager {
    constructor() {
        this.loadStats();
        this.analytics = new Analytics();
        this.displayProgress();
        this.checkAchievements();
        this.setupEventListeners();
        this.displayAnalytics();
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
            socialSkillsStars: 0,
            socialSkillsBest: 0,
            socialSkillsLevel: 1,
            socialSkillsProblems: 0,
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

    // Helper method to safely set element text content
    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // Helper method to safely set element style
    setStyle(id, property, value) {
        const el = document.getElementById(id);
        if (el) el.style[property] = value;
    }

    displayProgress() {
        this.setText('totalStars', this.stats.totalStars);
        this.setText('bestStreak', this.stats.bestStreak);
        this.setText('totalProblems', this.stats.totalProblems || 0);
        this.setText('achievementCount', this.stats.achievements ? this.stats.achievements.length : 0);

        const maxStars = 100;

        const additionPercent = Math.min((this.stats.additionStars / maxStars) * 100, 100);
        const subtractionPercent = Math.min((this.stats.subtractionStars / maxStars) * 100, 100);
        const multiplicationPercent = Math.min((this.stats.multiplicationStars / maxStars) * 100, 100);
        const divisionPercent = Math.min((this.stats.divisionStars / maxStars) * 100, 100);
        const funMathPercent = Math.min((this.stats.funMathStars / maxStars) * 100, 100);

        this.setStyle('additionFill', 'width', `${additionPercent}%`);
        this.setStyle('subtractionFill', 'width', `${subtractionPercent}%`);
        this.setStyle('multiplicationFill', 'width', `${multiplicationPercent}%`);
        this.setStyle('divisionFill', 'width', `${divisionPercent}%`);
        this.setStyle('funMathFill', 'width', `${funMathPercent}%`);

        this.setText('additionStars', this.stats.additionStars);
        this.setText('subtractionStars', this.stats.subtractionStars);
        this.setText('multiplicationStars', this.stats.multiplicationStars);
        this.setText('divisionStars', this.stats.divisionStars);
        this.setText('funMathStars', this.stats.funMathStars);

        this.setText('additionBest', this.stats.additionBest || 0);
        this.setText('subtractionBest', this.stats.subtractionBest || 0);
        this.setText('multiplicationBest', this.stats.multiplicationBest || 0);
        this.setText('divisionBest', this.stats.divisionBest || 0);
        this.setText('funMathBest', this.stats.funMathBest || 0);

        this.setText('additionLevel', this.stats.additionLevel || 1);
        this.setText('subtractionLevel', this.stats.subtractionLevel || 1);
        this.setText('multiplicationLevel', this.stats.multiplicationLevel || 1);
        this.setText('divisionLevel', this.stats.divisionLevel || 1);
        this.setText('funMathLevel', this.stats.funMathLevel || 1);

        this.setText('additionProblems', this.stats.additionProblems || 0);
        this.setText('subtractionProblems', this.stats.subtractionProblems || 0);
        this.setText('multiplicationProblems', this.stats.multiplicationProblems || 0);
        this.setText('divisionProblems', this.stats.divisionProblems || 0);
        this.setText('funMathProblems', this.stats.funMathProblems || 0);

        this.setText('socialSkillsStars', this.stats.socialSkillsStars || 0);
        this.setText('socialSkillsBest', this.stats.socialSkillsBest || 0);
        this.setText('socialSkillsLevel', this.stats.socialSkillsLevel || 1);
        this.setText('socialSkillsProblems', this.stats.socialSkillsProblems || 0);

        const socialSkillsPercent = Math.min((this.stats.socialSkillsStars / 100) * 100, 100);
        this.setStyle('socialSkillsFill', 'width', `${socialSkillsPercent}%`);

        this.setText('fractionsStars', this.stats.fractionsStars || 0);
        this.setText('fractionsBest', this.stats.fractionsBest || 0);
        this.setText('fractionsLevel', this.stats.fractionsLevel || 1);
        this.setText('fractionsProblems', this.stats.fractionsProblems || 0);

        const fractionsPercent = Math.min((this.stats.fractionsStars / 100) * 100, 100);
        this.setStyle('fractionsFill', 'width', `${fractionsPercent}%`);

        this.setText('timeMoneyStars', this.stats.timeMoneyStars || 0);
        this.setText('timeMoneyBest', this.stats.timeMoneyBest || 0);
        this.setText('timeMoneyLevel', this.stats.timeMoneyLevel || 1);
        this.setText('timeMoneyProblems', this.stats.timeMoneyProblems || 0);

        const timeMoneyPercent = Math.min((this.stats.timeMoneyStars / 100) * 100, 100);
        this.setStyle('timeMoneyFill', 'width', `${timeMoneyPercent}%`);

        const lastPlayed = document.getElementById('lastPlayed');
        if (lastPlayed) {
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

        this.displayDailyChallenges();
    }

    displayDailyChallenges() {
        if (typeof DailyChallenges === 'undefined') return;

        const dailyChallenges = new DailyChallenges();
        const todaysChallenges = dailyChallenges.getTodaysChallenges();
        const dailyStats = this.getDailyStats();

        this.setText('challengesDate', dailyChallenges.getTodaysDate());
        this.setText('completedChallenges', dailyChallenges.getCompletedCount());
        this.setText('challengeRewards', dailyChallenges.getTotalRewards());

        const container = document.getElementById('dailyChallengesList');
        if (!container) return;
        container.innerHTML = '';

        todaysChallenges.forEach(challenge => {
            const isCompleted = dailyChallenges.completedChallenges.includes(challenge.id);
            const progress = dailyChallenges.getChallengeProgress(challenge, dailyStats);

            const challengeCard = document.createElement('div');
            challengeCard.className = `challenge-card ${isCompleted ? 'completed' : 'pending'}`;
            challengeCard.innerHTML = `
                <div class="challenge-reward-badge">+${challenge.reward} ⭐</div>
                <div class="challenge-card-header">
                    <div class="challenge-card-icon">${challenge.icon}</div>
                    <div class="challenge-card-title">
                        <h3>${challenge.name}</h3>
                        <span class="difficulty difficulty-${challenge.difficulty}">${challenge.difficulty}</span>
                    </div>
                </div>
                <div class="challenge-card-desc">${challenge.description}</div>
                <div class="challenge-card-progress">
                    <div class="challenge-card-progress-bar" style="width: ${progress.percentage}%"></div>
                </div>
                <div class="challenge-card-progress-text">
                    <span>${isCompleted ? 'Completed!' : `${progress.current} / ${progress.target}`}</span>
                    <span>${Math.round(progress.percentage)}%</span>
                </div>
            `;
            container.appendChild(challengeCard);
        });
    }

    getDailyStats() {
        const savedDailyStats = localStorage.getItem('dailyStats');
        if (savedDailyStats) {
            const stats = JSON.parse(savedDailyStats);
            const today = new Date().toDateString();
            if (stats.date === today) {
                return stats;
            }
        }
        return {
            dailyStreak: 0,
            dailyProblems: 0,
            dailyStars: 0,
            dailyProblemsWithoutHints: 0,
            dailyFastProblems: 0,
            dailyAdditionProblems: 0,
            dailySubtractionProblems: 0,
            dailyMultiplicationProblems: 0,
            dailyDivisionProblems: 0
        };
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

    displayAnalytics() {
        if (typeof Analytics === 'undefined') return;

        const weeklyData = this.analytics.getWeeklyProgress();
        const gameBreakdown = this.analytics.getGameBreakdown();
        const recommendations = this.analytics.getRecommendations();
        const velocity = this.analytics.getLearningVelocity();
        const strongest = this.analytics.getStrongestOperation();
        const weakest = this.analytics.getWeakestOperation();

        this.setText('accuracyRate', 
            this.stats.totalProblems > 0 
                ? Math.round((this.stats.correctProblems || 0) / this.stats.totalProblems * 100) + '%'
                : '0%');

        this.setText('learningTrend', 
            velocity ? (velocity.improvement > 0 ? '↗️ +' : velocity.improvement < 0 ? '↘️ ' : '→ ') + 
            Math.abs(velocity.improvement) + '%' : '-');

        this.setText('strongestOp', 
            strongest ? this.capitalize(strongest) : '-');

        this.setText('weakestOp', 
            weakest ? this.capitalize(weakest) : '-');

        if (weeklyData.length > 0) {
            this.analytics.createBarChart(weeklyData.map(d => ({
                label: d.day,
                value: d.problems
            })), 'weeklyChart', {
                colors: ['#4facfe', '#00f2fe', '#ff6b6b', '#ffd93d', '#6bcf7f', '#a29bfe', '#fd79a8']
            });
        }

        if (gameBreakdown.length > 0) {
            this.analytics.createPieChart(gameBreakdown.map(g => ({
                label: this.capitalize(g.game),
                value: g.problems
            })), 'gameBreakdownChart');
        }

        const recommendationsContainer = document.getElementById('recommendationsList');
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = '';
            recommendations.forEach(rec => {
                const item = document.createElement('div');
                item.className = `recommendation-item ${rec.type}`;
                item.innerHTML = `
                    <div class="recommendation-icon">${rec.icon}</div>
                    <div class="recommendation-text">${rec.message}</div>
                `;
                recommendationsContainer.appendChild(item);
            });
        }

        const recentSessions = this.analytics.getSessionHistory(1);
        if (recentSessions.length > 0) {
            const lastSession = recentSessions[recentSessions.length - 1];
            const sessionDate = new Date(lastSession.timestamp);
            
            this.setText('sessionDate', 
                sessionDate.toLocaleDateString() + ' ' + sessionDate.toLocaleTimeString());
            
            const todaySessions = recentSessions.filter(s => 
                new Date(s.timestamp).toDateString() === new Date().toDateString()
            );
            
            const sessionProblems = todaySessions.length;
            const sessionCorrect = todaySessions.filter(s => s.result === 'correct').length;
            const sessionStars = todaySessions.reduce((sum, s) => sum + (s.stars || 0), 0);
            
            this.setText('sessionProblems', sessionProblems);
            this.setText('sessionCorrect', sessionCorrect);
            this.setText('sessionAccuracy', 
                sessionProblems > 0 ? Math.round(sessionCorrect / sessionProblems * 100) + '%' : '0%');
            this.setText('sessionStars', sessionStars);
        }
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    setupEventListeners() {
        const resetBtn = document.getElementById('resetProgress');
        const printBtn = document.getElementById('printReport');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all your progress? This cannot be undone!')) {
                    this.resetProgress();
                }
            });
        }

        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.printReport();
            });
        }
    }

    printReport() {
        const reportWindow = window.open('', '_blank');
        const s = this.stats;
        const getVal = (val) => val || 0;
        
        const savedProfile = localStorage.getItem('mathGameProfile');
        let profile = { name: '', avatar: '🦊' };
        try {
            if (savedProfile) {
                profile = JSON.parse(savedProfile);
            }
        } catch (e) {
            console.error('Error parsing profile:', e);
        }
        const playerName = escapeHtml(profile.name) || 'Math Learner';
        const avatar = escapeHtml(profile.avatar) || '🦊';
        
        reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Progress Report</title>
                <style>
                    body { 
                        font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', Arial, sans-serif; 
                        padding: 20px; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .report-container {
                        background: white;
                        border-radius: 30px;
                        padding: 30px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .report-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .report-avatar {
                        font-size: 4rem;
                        margin-bottom: 10px;
                    }
                    .player-name {
                        font-size: 2rem;
                        background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        color: #ff6b6b;
                        font-weight: 900;
                        margin-top: 10px;
                        letter-spacing: 1px;
                    }
                    .player-badge {
                        display: inline-block;
                        background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
                        padding: 8px 20px;
                        border-radius: 25px;
                        margin-top: 10px;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    h1 { 
                        color: #ff6b6b; 
                        text-align: center; 
                        font-size: 2.5rem;
                        margin-bottom: 10px;
                    }
                    .report-date {
                        text-align: center;
                        color: #636e72;
                        margin-bottom: 30px;
                    }
                    h2 { 
                        color: #2d3436; 
                        border-bottom: 3px solid; 
                        padding-bottom: 10px; 
                        margin-top: 25px;
                    }
                    .section { 
                        margin: 20px 0; 
                        padding: 20px; 
                        border-radius: 20px; 
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .overall-section {
                        background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
                        border: 3px solid #f39c12;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .overall-section h2 { border-color: #f39c12; color: #d35400; }
                    
                    .fun-section {
                        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                        border: 3px solid #e17055;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .fun-section h2 { border-color: #e17055; color: #d35400; }
                    
                    .social-section {
                        background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
                        border: 3px solid #6c5ce7;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .social-section h2 { border-color: #6c5ce7; color: #6c5ce7; }
                    
                    .addition-section {
                        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
                        border: 3px solid #4facfe;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .addition-section h2 { border-color: #4facfe; color: #0984e3; }
                    
                    .subtraction-section {
                        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                        border: 3px solid #fa709a;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .subtraction-section h2 { border-color: #fa709a; color: #e84393; }
                    
                    .multiplication-section {
                        background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
                        border: 3px solid #fd79a8;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .multiplication-section h2 { border-color: #fd79a8; color: #e84393; }
                    
                    .division-section {
                        background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
                        border: 3px solid #0984e3;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .division-section h2 { border-color: #0984e3; color: #0056b3; }
                    
                    .achievements-section {
                        background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
                        border: 3px solid #00b894;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .achievements-section h2 { border-color: #00b894; color: #00b894; }
                    
                    .stat-row { 
                        display: flex; 
                        justify-content: space-between; 
                        margin: 12px 0; 
                        font-size: 1.1rem;
                    }
                    .stat-label { font-weight: bold; color: #2d3436; }
                    .stat-value { 
                        color: #2d3436; 
                        font-weight: bold;
                        background: rgba(255,255,255,0.5);
                        padding: 5px 15px;
                        border-radius: 20px;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .achievements { 
                        display: flex; 
                        flex-wrap: wrap; 
                        gap: 10px; 
                        margin-top: 15px; 
                    }
                    .achievement { 
                        background: linear-gradient(135deg, #fff9c4 0%, #ffe082 100%);
                        padding: 8px 15px; 
                        border-radius: 25px; 
                        font-size: 14px;
                        border: 2px solid #ffca28;
                        box-shadow: 0 2px 8px rgba(255,202,40,0.4);
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .footer { 
                        text-align: center; 
                        margin-top: 30px; 
                        color: #636e72; 
                        font-size: 14px;
                        padding-top: 20px;
                        border-top: 2px dashed #b2bec3;
                    }
                    .footer-message {
                        font-size: 1.2rem;
                        color: #ff6b6b;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <div class="report-header">
                        <div class="report-avatar">${avatar}</div>
                        <h1>🌟 Progress Report 🌟</h1>
                        <div class="player-badge">
                            <p class="player-name">${playerName}</p>
                        </div>
                    </div>
                    <p class="report-date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    
                    <div class="section overall-section">
                        <h2>🏆 Overall Stats</h2>
                        <div class="stat-row">
                            <span class="stat-label">Total Stars:</span>
                            <span class="stat-value">⭐ ${getVal(s.totalStars)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Best Streak:</span>
                            <span class="stat-value">🔥 ${getVal(s.bestStreak)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Problems Solved:</span>
                            <span class="stat-value">📊 ${getVal(s.totalProblems)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Last Played:</span>
                            <span class="stat-value">🕐 ${s.lastPlayed ? new Date(s.lastPlayed).toLocaleDateString() : 'Never'}</span>
                        </div>
                    </div>

                    <div class="section fun-section">
                        <h2>🎲 Fun Math</h2>
                        <div class="stat-row">
                            <span class="stat-label">Stars:</span>
                            <span class="stat-value">⭐ ${getVal(s.funMathStars)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Level:</span>
                            <span class="stat-value">📈 ${getVal(s.funMathLevel)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Best Streak:</span>
                            <span class="stat-value">🔥 ${getVal(s.funMathBest)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Activities Completed:</span>
                            <span class="stat-value">📝 ${getVal(s.funMathProblems)}</span>
                        </div>
                    </div>

                    <div class="section social-section">
                        <h2>🤝 Social Skills</h2>
                        <div class="stat-row">
                            <span class="stat-label">Stars:</span>
                            <span class="stat-value">⭐ ${getVal(s.socialSkillsStars)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Level:</span>
                            <span class="stat-value">📈 ${getVal(s.socialSkillsLevel)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Best Streak:</span>
                            <span class="stat-value">🔥 ${getVal(s.socialSkillsBest)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Scenarios Completed:</span>
                            <span class="stat-value">📝 ${getVal(s.socialSkillsProblems)}</span>
                        </div>
                    </div>

                    <div class="section addition-section">
                        <h2>➕ Addition</h2>
                        <div class="stat-row">
                            <span class="stat-label">Stars:</span>
                            <span class="stat-value">⭐ ${getVal(s.additionStars)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Level:</span>
                            <span class="stat-value">📈 ${getVal(s.additionLevel)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Best Streak:</span>
                            <span class="stat-value">🔥 ${getVal(s.additionBest)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Problems Solved:</span>
                            <span class="stat-value">📝 ${getVal(s.additionProblems)}</span>
                        </div>
                    </div>

                    <div class="section subtraction-section">
                        <h2>➖ Subtraction</h2>
                        <div class="stat-row">
                            <span class="stat-label">Stars:</span>
                            <span class="stat-value">⭐ ${getVal(s.subtractionStars)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Level:</span>
                            <span class="stat-value">📈 ${getVal(s.subtractionLevel)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Best Streak:</span>
                            <span class="stat-value">🔥 ${getVal(s.subtractionBest)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Problems Solved:</span>
                            <span class="stat-value">📝 ${getVal(s.subtractionProblems)}</span>
                        </div>
                    </div>

                    <div class="section multiplication-section">
                        <h2>✖️ Multiplication</h2>
                        <div class="stat-row">
                            <span class="stat-label">Stars:</span>
                            <span class="stat-value">⭐ ${getVal(s.multiplicationStars)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Level:</span>
                            <span class="stat-value">📈 ${getVal(s.multiplicationLevel)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Best Streak:</span>
                            <span class="stat-value">🔥 ${getVal(s.multiplicationBest)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Problems Solved:</span>
                            <span class="stat-value">📝 ${getVal(s.multiplicationProblems)}</span>
                        </div>
                    </div>

                    <div class="section division-section">
                        <h2>➗ Division</h2>
                        <div class="stat-row">
                            <span class="stat-label">Stars:</span>
                            <span class="stat-value">⭐ ${getVal(s.divisionStars)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Level:</span>
                            <span class="stat-value">📈 ${getVal(s.divisionLevel)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Best Streak:</span>
                            <span class="stat-value">🔥 ${getVal(s.divisionBest)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Problems Solved:</span>
                            <span class="stat-value">📝 ${getVal(s.divisionProblems)}</span>
                        </div>
                    </div>

                    <div class="section achievements-section">
                        <h2>🏆 Achievements (${getVal(s.achievements) ? s.achievements.length : 0})</h2>
                        <div class="achievements">
                            ${s.achievements && s.achievements.includes('first_star') ? '<span class="achievement">⭐ First Star</span>' : ''}
                            ${s.achievements && s.achievements.includes('star_10') ? '<span class="achievement">🌟 Star Collector</span>' : ''}
                            ${s.achievements && s.achievements.includes('star_50') ? '<span class="achievement">✨ Star Master</span>' : ''}
                            ${s.achievements && s.achievements.includes('streak_5') ? '<span class="achievement">🔥 On Fire!</span>' : ''}
                            ${s.achievements && s.achievements.includes('streak_10') ? '<span class="achievement">💥 Unstoppable!</span>' : ''}
                            ${s.achievements && s.achievements.includes('addition_expert') ? '<span class="achievement">➕ Addition Expert</span>' : ''}
                            ${s.achievements && s.achievements.includes('subtraction_expert') ? '<span class="achievement">➖ Subtraction Expert</span>' : ''}
                            ${s.achievements && s.achievements.includes('multiplication_expert') ? '<span class="achievement">✖️ Multiplication Expert</span>' : ''}
                            ${s.achievements && s.achievements.includes('division_expert') ? '<span class="achievement">➗ Division Expert</span>' : ''}
                            ${s.achievements && s.achievements.includes('fun_math_master') ? '<span class="achievement">🎲 Fun Math Master</span>' : ''}
                            ${s.achievements && s.achievements.includes('math_ninja') ? '<span class="achievement">🥷 Math Ninja</span>' : ''}
                            ${s.achievements && s.achievements.includes('dedicated_learner') ? '<span class="achievement">📚 Dedicated Learner</span>' : ''}
                            ${s.achievements && s.achievements.includes('perfect_score') ? '<span class="achievement">💯 Perfect Score</span>' : ''}
                        </div>
                    </div>

                    <div class="footer">
                        <p class="footer-message">🌟 Keep up the great work! 🌟</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        reportWindow.document.close();
        reportWindow.print();
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
            socialSkillsStars: 0,
            socialSkillsBest: 0,
            socialSkillsLevel: 1,
            socialSkillsProblems: 0,
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
        try {
            localStorage.setItem('mathGameStats', JSON.stringify(this.stats));
        } catch (e) {
            console.error('Error saving stats:', e);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProgressManager();
});
