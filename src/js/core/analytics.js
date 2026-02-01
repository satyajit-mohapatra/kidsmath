class Analytics {
    constructor() {
        this.stats = this.loadStats();
    }

    loadStats() {
        try {
            const saved = localStorage.getItem('mathGameStats');
            if (saved) {
                const parsed = JSON.parse(saved);
                return typeof parsed === 'object' && parsed !== null ? parsed : {};
            }
        } catch (e) {
            console.error('Error loading analytics stats:', e);
        }
        return {};
    }

    getSessionHistory(days = 7) {
        const history = this.stats.sessionHistory || [];
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        return history.filter(session => new Date(session.timestamp) >= cutoff);
    }

    getDailyStats(days = 7) {
        const history = this.getSessionHistory(days);
        const dailyStats = {};
        
        history.forEach(session => {
            const date = new Date(session.timestamp).toLocaleDateString();
            if (!dailyStats[date]) {
                dailyStats[date] = {
                    date: date,
                    problems: 0,
                    correct: 0,
                    stars: 0,
                    streak: 0
                };
            }
            
            dailyStats[date].problems++;
            if (session.result === 'correct') {
                dailyStats[date].correct++;
            }
            dailyStats[date].stars = Math.max(dailyStats[date].stars, session.stars);
            dailyStats[date].streak = Math.max(dailyStats[date].streak, session.streak);
        });
        
        return Object.values(dailyStats).sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
    }

    getGameBreakdown() {
        const games = ['addition', 'subtraction', 'multiplication', 'division', 'funMath', 'socialSkills', 'advancedMath', 'fractions', 'timeMoney'];
        const breakdown = [];
        
        games.forEach(game => {
            const stars = this.stats[`${game}Stars`] || 0;
            const problems = this.stats[`${game}Problems`] || 0;
            const best = this.stats[`${game}Best`] || 0;
            
            if (problems > 0) {
                breakdown.push({
                    game: game,
                    stars: stars,
                    problems: problems,
                    bestStreak: best,
                    accuracy: problems > 0 ? Math.round((stars / (problems * 2)) * 100) : 0
                });
            }
        });
        
        return breakdown;
    }

    getWeeklyProgress() {
        const dailyStats = this.getDailyStats(7);
        const weekData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString();
            
            const dayData = dailyStats.find(d => d.date === dateStr) || {
                date: dateStr,
                problems: 0,
                correct: 0,
                stars: 0,
                streak: 0
            };
            
            weekData.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: dateStr,
                ...dayData
            });
        }
        
        return weekData;
    }

    getAccuracyTrend() {
        const history = this.getSessionHistory(30);
        const trend = [];
        let correct = 0;
        let total = 0;
        
        history.forEach((session, index) => {
            total++;
            if (session.result === 'correct') {
                correct++;
            }
            
            if ((index + 1) % 5 === 0 || index === history.length - 1) {
                trend.push({
                    problems: total,
                    accuracy: Math.round((correct / total) * 100)
                });
            }
        });
        
        return trend;
    }

    getLearningVelocity() {
        const history = this.getSessionHistory(14);
        if (history.length < 5) return null;
        
        const firstHalf = history.slice(0, Math.floor(history.length / 2));
        const secondHalf = history.slice(Math.floor(history.length / 2));
        
        const firstAccuracy = firstHalf.filter(s => s.result === 'correct').length / firstHalf.length;
        const secondAccuracy = secondHalf.filter(s => s.result === 'correct').length / secondHalf.length;
        
        return {
            improvement: Math.round((secondAccuracy - firstAccuracy) * 100),
            trend: secondAccuracy > firstAccuracy ? 'improving' : secondAccuracy < firstAccuracy ? 'declining' : 'stable'
        };
    }

    getStrongestOperation() {
        const operations = ['addition', 'subtraction', 'multiplication', 'division'];
        let strongest = null;
        let maxAccuracy = 0;
        
        operations.forEach(op => {
            const problems = this.stats[`${op}Problems`] || 0;
            const stars = this.stats[`${op}Stars`] || 0;
            
            if (problems > 5) {
                const accuracy = stars / (problems * 2);
                if (accuracy > maxAccuracy) {
                    maxAccuracy = accuracy;
                    strongest = op;
                }
            }
        });
        
        return strongest;
    }

    getWeakestOperation() {
        const operations = ['addition', 'subtraction', 'multiplication', 'division'];
        let weakest = null;
        let minAccuracy = 1;
        
        operations.forEach(op => {
            const problems = this.stats[`${op}Problems`] || 0;
            const stars = this.stats[`${op}Stars`] || 0;
            
            if (problems > 5) {
                const accuracy = stars / (problems * 2);
                if (accuracy < minAccuracy) {
                    minAccuracy = accuracy;
                    weakest = op;
                }
            }
        });
        
        return weakest;
    }

    getRecommendations() {
        const recommendations = [];
        const velocity = this.getLearningVelocity();
        const weakest = this.getWeakestOperation();
        const strongest = this.getStrongestOperation();
        
        if (velocity && velocity.trend === 'declining') {
            recommendations.push({
                type: 'warning',
                icon: '⚠️',
                message: 'Your accuracy has been declining. Take your time and use hints when needed!'
            });
        }
        
        if (velocity && velocity.trend === 'improving') {
            recommendations.push({
                type: 'success',
                icon: '📈',
                message: 'Great job! You\'re getting better every day!'
            });
        }
        
        if (weakest) {
            recommendations.push({
                type: 'tip',
                icon: '🎯',
                message: `Practice more ${weakest} - it could use some work!`
            });
        }
        
        if (strongest) {
            recommendations.push({
                type: 'success',
                icon: '🏆',
                message: `You're amazing at ${strongest}! Keep it up!`
            });
        }
        
        const totalProblems = this.stats.totalProblems || 0;
        if (totalProblems < 10) {
            recommendations.push({
                type: 'tip',
                icon: '🌟',
                message: 'Keep practicing! The more you play, the better you\'ll get!'
            });
        }
        
        return recommendations;
    }

    createBarChart(data, containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const maxValue = Math.max(...data.map(d => d.value || d.problems || d.stars || 0));
        const height = options.height || 200;
        
        let html = '<div class="bar-chart">';
        
        data.forEach((item, index) => {
            const value = item.value || item.problems || item.stars || 0;
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const label = item.label || item.day || item.game || '';
            const color = options.colors ? options.colors[index % options.colors.length] : '#4facfe';
            
            html += `
                <div class="bar-item">
                    <div class="bar-wrapper">
                        <div class="bar" style="height: ${percentage}%; background: ${color}">
                            <span class="bar-value">${value}</span>
                        </div>
                    </div>
                    <div class="bar-label">${label}</div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    createLineChart(data, containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container || data.length < 2) return;
        
        const width = options.width || container.clientWidth || 600;
        const height = options.height || 200;
        const padding = 40;
        
        const values = data.map(d => d.value || d.accuracy || d.stars || 0);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const range = maxValue - minValue || 1;
        
        const points = data.map((item, index) => {
            const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((item.value || item.accuracy || item.stars || 0) - minValue) / range * (height - 2 * padding);
            return `${x},${y}`;
        }).join(' ');
        
        let html = `<svg class="line-chart" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
        
        html += `<polyline points="${points}" fill="none" stroke="#4facfe" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
        
        data.forEach((item, index) => {
            const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((item.value || item.accuracy || item.stars || 0) - minValue) / range * (height - 2 * padding);
            html += `<circle cx="${x}" cy="${y}" r="5" fill="#4facfe" stroke="white" stroke-width="2"/>`;
        });
        
        html += '</svg>';
        container.innerHTML = html;
    }

    createPieChart(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
        if (total === 0) return;
        
        const size = 200;
        const radius = size / 2 - 10;
        const center = size / 2;
        
        let html = `<svg class="pie-chart" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
        
        let currentAngle = 0;
        const colors = ['#4facfe', '#00f2fe', '#ff6b6b', '#ffd93d', '#6bcf7f', '#a29bfe'];
        
        data.forEach((item, index) => {
            const value = item.value || 0;
            const percentage = value / total;
            const angle = percentage * 360;
            
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = center + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = center + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = center + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = center + radius * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            html += `<path d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" 
                         fill="${colors[index % colors.length]}" stroke="white" stroke-width="2"/>`;
            
            currentAngle += angle;
        });
        
        html += '</svg>';
        
        html += '<div class="pie-legend">';
        data.forEach((item, index) => {
            const percentage = Math.round((item.value || 0) / total * 100);
            html += `
                <div class="legend-item">
                    <span class="legend-color" style="background: ${colors[index % colors.length]}"></span>
                    <span class="legend-label">${item.label || item.game || ''}: ${percentage}%</span>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}