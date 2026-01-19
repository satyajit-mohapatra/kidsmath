class MenuManager {
    constructor() {
        this.loadStats();
        this.init();
    }

    init() {
        this.displayStats();
        this.setupMascot();
    }

    loadStats() {
        const savedStats = localStorage.getItem('mathGameStats');
        this.stats = savedStats ? JSON.parse(savedStats) : {
            totalStars: 0,
            bestStreak: 0,
            additionStars: 0,
            subtractionStars: 0,
            multiplicationStars: 0,
            divisionStars: 0,
            funMathStars: 0,
            achievements: []
        };
    }

    displayStats() {
        document.getElementById('totalStars').textContent = `⭐ ${this.stats.totalStars}`;
        document.getElementById('bestStreak').textContent = `🔥 ${this.stats.bestStreak}`;
        document.getElementById('additionStars').textContent = `⭐ ${this.stats.additionStars}`;
        document.getElementById('subtractionStars').textContent = `⭐ ${this.stats.subtractionStars}`;
        document.getElementById('multiplicationStars').textContent = `⭐ ${this.stats.multiplicationStars}`;
        document.getElementById('divisionStars').textContent = `⭐ ${this.stats.divisionStars}`;
        document.getElementById('funMathStars').textContent = `⭐ ${this.stats.funMathStars}`;
        document.getElementById('progressStars').textContent = `🏆 ${this.stats.achievements.length}`;
    }

    setupMascot() {
        const mascot = document.getElementById('menuMascot');
        const message = document.getElementById('mascotMessage');

        const messages = [
            'Click a card to start learning!',
            'Math is fun! 🎉',
            'You can do it! 💪',
            'Ready for an adventure?',
            'Which one will you try first?',
            'Every star makes you smarter!',
            'Let\'s learn together! 🌟',
            'Pick your favorite! 🎯'
        ];

        mascot.addEventListener('click', () => {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            message.textContent = randomMessage;
            message.style.animation = 'none';
            setTimeout(() => {
                message.style.animation = 'slideUp 0.5s ease-out';
            }, 10);

            this.playTone(900, 0.1);
            this.playTone(1100, 0.1);

            mascot.style.transform = 'scale(1.3) rotate(360deg)';
            setTimeout(() => {
                mascot.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        });
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
}

document.addEventListener('DOMContentLoaded', () => {
    new MenuManager();
});
