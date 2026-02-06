class MenuManager {
    constructor() {
        this.loadStats();
        this.loadProfile();
        this.init();
    }

    init() {
        this.displayStats();
        this.displaySalutation();
        this.setupMascot();
        this.initGameVisibility();
        this.renderGameCards();
        this.setupProfile();
    }

    initGameVisibility() {
        if (!this.profile.gameVisibility) {
            this.profile.gameVisibility = {
                funMath: true,
                socialSkills: true,
                addition: true,
                subtraction: true,
                multiplication: true,
                division: true,
                advancedMath: true,
                sentenceFormation: true,
                vocabulary: true,
                rhymingWords: true,
                wordScramble: true,
                fractions: true,
                timeMoney: true,
                generalKnowledge: true
            };
            this.saveProfile();
        }
    }

    renderGameCards() {
        const gameCards = document.querySelectorAll('.menu-card');
        gameCards.forEach(card => {
            const href = card.getAttribute('href');
            let gameKey = '';

            if (href.includes('fun-math')) gameKey = 'funMath';
            else if (href.includes('social-skills')) gameKey = 'socialSkills';
            else if (href.includes('addition')) gameKey = 'addition';
            else if (href.includes('subtraction')) gameKey = 'subtraction';
            else if (href.includes('multiplication')) gameKey = 'multiplication';
            else if (href.includes('division')) gameKey = 'division';
            else if (href.includes('advanced-math')) gameKey = 'advancedMath';
            else if (href.includes('sentence-formation')) gameKey = 'sentenceFormation';
            else if (href.includes('vocabulary')) gameKey = 'vocabulary';
            else if (href.includes('rhyming-words')) gameKey = 'rhymingWords';
            else if (href.includes('word-scramble')) gameKey = 'wordScramble';
            else if (href.includes('fractions')) gameKey = 'fractions';
            else if (href.includes('time-money')) gameKey = 'timeMoney';
            else if (href.includes('general-knowledge')) gameKey = 'generalKnowledge';

            if (gameKey && this.profile.gameVisibility[gameKey] === false) {
                card.style.display = 'none';
            } else {
                card.style.display = '';
            }
        });
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
            socialSkillsStars: 0,
            advancedMathStars: 0,
            sentenceFormationStars: 0,
            vocabularyStars: 0,
            rhymingWordsStars: 0,
            wordScrambleStars: 0,
            fractionsStars: 0,
            timeMoneyStars: 0,
            generalKnowledgeStars: 0,
            achievements: []
        };
    }

    loadProfile() {
        const savedProfile = localStorage.getItem('mathGameProfile');
        this.profile = savedProfile ? JSON.parse(savedProfile) : {
            name: '',
            avatar: '🦊',
            createdAt: null,
            gameVisibility: {
                funMath: true,
                socialSkills: true,
                addition: true,
                subtraction: true,
                multiplication: true,
                division: true,
                advancedMath: true,
                sentenceFormation: true,
                vocabulary: true,
                rhymingWords: true,
                wordScramble: true,
                fractions: true,
                timeMoney: true,
                generalKnowledge: true
            }
        };
    }

    saveProfile() {
        localStorage.setItem('mathGameProfile', JSON.stringify(this.profile));
    }

    displaySalutation() {
        const salutation = document.getElementById('salutation');
        const hour = new Date().getHours();
        
        let greeting, emoji;
        if (hour < 12) {
            greeting = 'Good morning';
            emoji = '🌅';
        } else if (hour < 17) {
            greeting = 'Good afternoon';
            emoji = '☀️';
        } else {
            greeting = 'Good evening';
            emoji = '🌙';
        }

        if (this.profile.name) {
            salutation.textContent = `${emoji} ${greeting}, ${this.profile.name}!`;
        } else {
            salutation.textContent = `${emoji} ${greeting}, friend!`;
        }
    }

    setupProfile() {
        const profileBtn = document.getElementById('profileBtn');
        const profileModal = document.getElementById('profileModal');
        const closeProfile = document.getElementById('closeProfile');
        const saveProfile = document.getElementById('saveProfile');
        const profileAvatar = document.getElementById('profileAvatar');
        const avatarOptions = document.querySelectorAll('.avatar-option');
        const visibilitySection = document.getElementById('gameVisibilitySection');
        const visibilityCheckboxes = document.querySelectorAll('.visibility-checkbox');

        if (profileBtn && profileModal) {
            profileBtn.addEventListener('click', () => {
                profileModal.style.display = 'flex';
                profileModal.classList.add('show');
            });
        }

        if (closeProfile && profileModal) {
            closeProfile.addEventListener('click', () => {
                profileModal.style.display = 'none';
                profileModal.classList.remove('show');
            });
        }

        visibilitySection.style.display = 'block';

        visibilityCheckboxes.forEach(checkbox => {
            const gameKey = checkbox.dataset.game;
            checkbox.checked = this.profile.gameVisibility[gameKey] !== false;
            checkbox.addEventListener('change', (e) => {
                const key = e.target.dataset.game;
                this.profile.gameVisibility[key] = e.target.checked;
            });
        });

        avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                profileAvatar.textContent = option.textContent;
            });
        });

        if (saveProfile) {
            saveProfile.addEventListener('click', () => {
                const name = document.getElementById('profileName').value.trim();
                this.profile.name = name;
                this.profile.avatar = profileAvatar.textContent;
                if (!this.profile.createdAt) {
                    this.profile.createdAt = new Date().toISOString();
                }
                this.saveProfile();
                this.displaySalutation();
                this.renderGameCards();
                this.playTone(800, 0.1);
                setTimeout(() => this.playTone(1000, 0.1), 100);
                const modal = document.getElementById('profileModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                }
            });
        }
    }

    displayStats() {
        document.getElementById('totalStars').textContent = `⭐ ${this.stats.totalStars}`;
        document.getElementById('bestStreak').textContent = `🔥 ${this.stats.bestStreak}`;
        document.getElementById('additionStars').textContent = `⭐ ${this.stats.additionStars}`;
        document.getElementById('subtractionStars').textContent = `⭐ ${this.stats.subtractionStars}`;
        document.getElementById('multiplicationStars').textContent = `⭐ ${this.stats.multiplicationStars}`;
        document.getElementById('divisionStars').textContent = `⭐ ${this.stats.divisionStars}`;
        document.getElementById('funMathStars').textContent = `⭐ ${this.stats.funMathStars}`;
        document.getElementById('socialSkillsStars').textContent = `⭐ ${this.stats.socialSkillsStars || 0}`;
        document.getElementById('advancedMathStars').textContent = `⭐ ${this.stats.advancedMathStars || 0}`;
        document.getElementById('sentenceFormationStars').textContent = `⭐ ${this.stats.sentenceFormationStars || 0}`;
        document.getElementById('vocabularyStars').textContent = `⭐ ${this.stats.vocabularyStars || 0}`;
        document.getElementById('rhymingWordsStars').textContent = `⭐ ${this.stats.rhymingWordsStars || 0}`;
        document.getElementById('wordScrambleStars').textContent = `⭐ ${this.stats.wordScrambleStars || 0}`;
        document.getElementById('fractionsStars').textContent = `⭐ ${this.stats.fractionsStars || 0}`;
        document.getElementById('timeMoneyStars').textContent = `⭐ ${this.stats.timeMoneyStars || 0}`;
        document.getElementById('generalKnowledgeStars').textContent = `⭐ ${this.stats.generalKnowledgeStars || 0}`;
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
    window.menuManager = new MenuManager();
});
