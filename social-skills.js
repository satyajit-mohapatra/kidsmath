class SocialSkillsGame {
    constructor() {
        this.currentLevel = 1;
        this.stars = 0;
        this.streak = 0;
        this.currentScenario = null;
        this.usedHint = false;
        this.hintLevel = 0;

        this.emojis = ['🌟', '🎈', '🎪', '🎯', '🎨', '🎭', '🦄', '🌈'];
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];
        this.characters = ['👧', '👦', '🧒', '👶', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯'];

        this.scenarios = this.createScenarios();

        this.init();
    }

    init() {
        this.loadStats();
        this.setupEventListeners();
        this.generateScenario();
    }

    loadStats() {
        const savedStats = localStorage.getItem('mathGameStats');
        this.globalStats = savedStats ? JSON.parse(savedStats) : {
            totalStars: 0,
            bestStreak: 0,
            socialSkillsStars: 0,
            socialSkillsBest: 0,
            socialSkillsLevel: 1
        };

        this.stars = this.globalStats.socialSkillsStars || 0;
        this.updateStats();
    }

    saveStats() {
        this.globalStats.socialSkillsStars = this.stars;
        this.globalStats.socialSkillsBest = Math.max(
            this.globalStats.socialSkillsBest || 0,
            this.streak
        );
        this.globalStats.socialSkillsLevel = this.currentLevel;
        this.globalStats.totalStars = Math.max(this.globalStats.totalStars, this.stars);
        this.globalStats.bestStreak = Math.max(this.globalStats.bestStreak, this.streak);

        localStorage.setItem('mathGameStats', JSON.stringify(this.globalStats));
    }

    createScenarios() {
        return {
            1: [
                {
                    character: '👧',
                    text: 'Emma wants to play with her friend\'s toy.',
                    question: 'What should Emma say?',
                    options: [
                        { text: 'Give me that toy!', correct: false },
                        { text: 'Can I please have a turn?', correct: true },
                        { text: 'I\'m not talking to you!', correct: false }
                    ],
                    hint: 'Good friends use polite words like "please" and "can I".',
                    celebration: '🎉 Awesome! Using polite words makes friends!'
                },
                {
                    character: '👦',
                    text: 'Lucas received a gift from his grandma.',
                    question: 'What should Lucas say?',
                    options: [
                        { text: 'Thanks, Grandma! I love it!', correct: true },
                        { text: 'I wanted a different one.', correct: false },
                        { text: 'Whatever.', correct: false }
                    ],
                    hint: 'When someone gives you something, you say thank you!',
                    celebration: '🎉 Great job! Thank you words make people happy!'
                },
                {
                    character: '🧒',
                    text: 'Mia dropped her crayons and they spilled everywhere.',
                    question: 'What should Mia do?',
                    options: [
                        { text: 'Ask for help to pick them up', correct: true },
                        { text: 'Cry and do nothing', correct: false },
                        { text: 'Walk away and leave them', correct: false }
                    ],
                    hint: 'It\'s okay to ask for help when you need it!',
                    celebration: '🎉 Perfect! Asking for help is smart!'
                },
                {
                    character: '🦊',
                    text: 'Felix wants to join the other kids playing tag.',
                    question: 'What should Felix say?',
                    options: [
                        { text: 'Can I play with you?', correct: true },
                        { text: 'You have to let me play!', correct: false },
                        { text: 'I\'m better than all of you!', correct: false }
                    ],
                    hint: 'Ask nicely if you want to join a game.',
                    celebration: '🎉 Wonderful! Being friendly helps make new friends!'
                },
                {
                    character: '👦',
                    text: 'Noah bumped into his friend by accident.',
                    question: 'What should Noah say?',
                    options: [
                        { text: 'Sorry, are you okay?', correct: true },
                        { text: 'It was an accident!', correct: true },
                        { text: 'Not my fault!', correct: false }
                    ],
                    hint: 'When we accidentally hurt someone, we say sorry.',
                    celebration: '🎉 Great! Saying sorry shows we care!'
                },
                {
                    character: '👧',
                    text: 'Sophia wants to use the swing but her friend is on it.',
                    question: 'What should Sophia do?',
                    options: [
                        { text: 'Wait patiently for her turn', correct: true },
                        { text: 'Push her friend off', correct: false },
                        { text: 'Yell at her to get off', correct: false }
                    ],
                    hint: 'Taking turns means waiting for your turn nicely.',
                    celebration: '🎉 Excellent! Being patient is kind!'
                },
                {
                    character: '🐻',
                    text: 'Bear shared his cookies with his friend.',
                    question: 'What is Bear showing?',
                    options: [
                        { text: 'Being selfish', correct: false },
                        { text: 'Being a good friend', correct: true },
                        { text: 'Being angry', correct: false }
                    ],
                    hint: 'Sharing with others shows we care about them.',
                    celebration: '🎉 Amazing! Sharing makes everyone happy!'
                },
                {
                    character: '👦',
                    text: 'Leo sees his friend crying because they lost their toy.',
                    question: 'What should Leo do?',
                    options: [
                        { text: 'Laugh at them', correct: false },
                        { text: 'Ask if they\'re okay and help look', correct: true },
                        { text: 'Ignore them', correct: false }
                    ],
                    hint: 'When friends are sad, we try to help them feel better.',
                    celebration: '🎉 Wonderful! Being kind to sad friends makes them feel better!'
                }
            ],
            2: [
                {
                    character: '👧',
                    text: 'Emma is playing a board game and it\'s her turn, but she doesn\'t know what to do.',
                    question: 'What should Emma do?',
                    options: [
                        { text: 'Guess randomly', correct: false },
                        { text: 'Ask someone to explain the rules', correct: true },
                        { text: 'Flip the board and leave', correct: false }
                    ],
                    hint: 'It\'s okay to ask questions when you don\'t understand something.',
                    celebration: '🎉 Great! Asking for help when you need it is smart!'
                },
                {
                    character: '👦',
                    text: 'Lucas wants to play soccer, but his friends are playing basketball.',
                    question: 'What should Lucas do?',
                    options: [
                        { text: 'Play basketball with them and suggest soccer later', correct: true },
                        { text: 'Yell at them for not playing what he wants', correct: false },
                        { text: 'Play alone and refuse to join', correct: false }
                    ],
                    hint: 'Being flexible and joining what friends are playing helps everyone have fun.',
                    celebration: '🎉 Awesome! Being flexible helps us have more fun with friends!'
                },
                {
                    character: '🧒',
                    text: 'Mia made a mistake on her drawing and feels frustrated.',
                    question: 'How should Mia handle her feelings?',
                    options: [
                        { text: 'Throw her crayons and scream', correct: false },
                        { text: 'Take a deep breath and try again', correct: true },
                        { text: 'Give up completely', correct: false }
                    ],
                    hint: 'When we feel frustrated, taking deep breaths helps us calm down.',
                    celebration: '🎉 Wonderful! Managing our feelings helps us solve problems!'
                },
                {
                    character: '🦊',
                    text: 'Felix and his friend both want to be the leader in a game.',
                    question: 'What should they do?',
                    options: [
                        { text: 'Rock-paper-scissors to decide', correct: true },
                        { text: 'Fight about it', correct: false },
                        { text: 'Neither gets to be leader', correct: false }
                    ],
                    hint: 'When we disagree, we can find fair ways to decide.',
                    celebration: '🎉 Great! Finding fair solutions helps everyone!'
                },
                {
                    character: '👧',
                    text: 'Emma sees a new kid at school who looks lonely.',
                    question: 'What should Emma do?',
                    options: [
                        { text: 'Say hello and ask if they want to play', correct: true },
                        { text: 'Ignore them because they\'re new', correct: false },
                        { text: 'Point and laugh', correct: false }
                    ],
                    hint: 'Welcoming new friends makes them feel included and happy.',
                    celebration: '🎉 Amazing! Being friendly to new friends is the best!'
                },
                {
                    character: '👦',
                    text: 'Lucas promised to play with his friend, but then got invited to something else.',
                    question: 'What should Lucas do?',
                    options: [
                        { text: 'Tell his friend and make plans for another time', correct: true },
                        { text: 'Just leave without saying anything', correct: false },
                        { text: 'Lie and say he was sick', correct: false }
                    ],
                    hint: 'Keeping promises is important. If plans change, tell your friend.',
                    celebration: '🎉 Excellent! Being honest keeps friendships strong!'
                },
                {
                    character: '🐼',
                    text: 'Panda worked really hard on something but his friend\'s thing is better.',
                    question: 'How should Panda feel?',
                    options: [
                        { text: 'Feel jealous and mean', correct: false },
                        { text: 'Be happy for his friend and proud of himself', correct: true },
                        { text: 'Break his friend\'s thing', correct: false }
                    ],
                    hint: 'We can be happy for our friends\' success and still be proud of ourselves.',
                    celebration: '🎉 Wonderful! Being happy for others shows good friendship!'
                },
                {
                    character: '👧',
                    text: 'Sophia\'s friend said something that hurt her feelings.',
                    question: 'What should Sophia do?',
                    options: [
                        { text: 'Hit her friend back', correct: false },
                        { text: 'Tell her friend how she feels using "I" statements', correct: true },
                        { text: 'Never speak to her again', correct: false }
                    ],
                    hint: 'Using "I feel sad when..." helps friends understand how their words affect us.',
                    celebration: '🎉 Great! Using our words to express feelings helps solve problems!'
                }
            ],
            3: [
                {
                    character: '👦',
                    text: 'Lucas is playing with toys at school. Another child takes a toy without asking.',
                    question: 'What should Lucas do?',
                    options: [
                        { text: 'Take it back forcefully', correct: false },
                        { text: 'Use words: "Please ask before taking my toy"', correct: true },
                        { text: 'Cry loudly', correct: false }
                    ],
                    hint: 'Using calm words to stand up for ourselves is called advocacy.',
                    celebration: '🎉 Awesome! Using words to solve problems is being a good advocate!'
                },
                {
                    character: '👧',
                    text: 'Emma is at a birthday party. She doesn\'t like the game everyone is playing.',
                    question: 'What should Emma do?',
                    options: [
                        { text: 'Complain loudly that it\'s boring', correct: false },
                        { text: 'Play along and maybe suggest a different game later', correct: true },
                        { text: 'Sit in the corner and refuse to participate', correct: false }
                    ],
                    hint: 'Being respectful of group activities while also being true to yourself is balanced.',
                    celebration: '🎉 Great! Being flexible yet true to yourself shows maturity!'
                },
                {
                    character: '🧒',
                    text: 'Mia sees a group of kids excluding another child.',
                    question: 'What should Mia do?',
                    options: [
                        { text: 'Join in excluding them', correct: false },
                        { text: 'Include the excluded child in your group', correct: true },
                        { text: 'Walk away and do nothing', correct: false }
                    ],
                    hint: 'Standing up against exclusion shows leadership and kindness.',
                    celebration: '🎉 Amazing! Including others shows true leadership!'
                },
                {
                    character: '🦊',
                    text: 'Felix made a promise to help a friend, but he\'s really tired.',
                    question: 'What should Felix do?',
                    options: [
                        { text: 'Help anyway even though he\'s tired', correct: false },
                        { text: 'Explain he\'s tired but will help soon', correct: true },
                        { text: 'Forget the promise entirely', correct: false }
                    ],
                    hint: 'Being honest about our limits while still honoring commitments is key.',
                    celebration: '🎉 Wonderful! Being honest about our limits is healthy!'
                },
                {
                    character: '👦',
                    text: 'Lucas noticed his friend has been quiet and sad for a few days.',
                    question: 'What should Lucas do?',
                    options: [
                        { text: 'Ask if everything is okay and offer to listen', correct: true },
                        { text: 'Ignore it and play anyway', correct: false },
                        { text: 'Make fun of them for being sad', correct: false }
                    ],
                    hint: 'Checking in on friends who seem down shows empathy and care.',
                    celebration: '🎉 Great! Being a good friend means noticing when they need support!'
                },
                {
                    character: '👧',
                    text: 'Emma and her friend both had the same idea for a project.',
                    question: 'What should they do?',
                    options: [
                        { text: 'Argue about who had the idea first', correct: false },
                        { text: 'Combine ideas and work together', correct: true },
                        { text: 'Refuse to work together', correct: false }
                    ],
                    hint: 'Collaborating on ideas often creates something even better!',
                    celebration: '🎉 Awesome! Teamwork makes the dream work!'
                },
                {
                    character: '🐨',
                    text: 'Koala is new to the neighborhood. He wants to make friends but feels shy.',
                    question: 'What could Koala try?',
                    options: [
                        { text: 'Wait for others to approach him first', correct: false },
                        { text: 'Start with small steps like saying hello or offering a smile', correct: true },
                        { text: 'Hide and never come out', correct: false }
                    ],
                    hint: 'Making the first move can be hard, but small friendly steps help!',
                    celebration: '🎉 Great! Being brave enough to start conversations builds friendships!'
                },
                {
                    character: '👦',
                    text: 'Leo broke something that belonged to his friend by accident.',
                    question: 'What should Leo do?',
                    options: [
                        { text: 'Hide the broken pieces and say nothing', correct: false },
                        { text: 'Tell the truth, apologize, and offer to fix or replace it', correct: true },
                        { text: 'Blame someone else', correct: false }
                    ],
                    hint: 'Taking responsibility and making amends shows integrity.',
                    celebration: '🎉 Wonderful! Being honest and making amends shows true character!'
                }
            ]
        };
    }

    setupEventListeners() {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLevel = parseInt(e.target.dataset.level);
                this.generateScenario();
            });
        });

        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('mascot').addEventListener('click', () => this.mascotClick());
    }

    generateScenario() {
        this.usedHint = false;
        this.hintLevel = 0;
        document.getElementById('hintContent').textContent = '';
        document.getElementById('feedbackArea').innerHTML = '';
        document.getElementById('hintCounter').textContent = '0/6';

        const levelScenarios = this.scenarios[this.currentLevel] || this.scenarios[1];
        const randomIndex = Math.floor(Math.random() * levelScenarios.length);
        this.currentScenario = levelScenarios[randomIndex];

        this.displayScenario();
    }

    displayScenario() {
        const scenario = this.currentScenario;

        document.getElementById('scenarioCharacter').textContent = scenario.character;

        const scenarioText = document.getElementById('scenarioText');
        scenarioText.innerHTML = `
            <div class="scenario-label">Scenario:</div>
            <div class="scenario-description">${scenario.text}</div>
        `;

        const scenarioQuestion = document.getElementById('scenarioQuestion');
        scenarioQuestion.innerHTML = `
            <div class="question-label">Question:</div>
            <div class="question-text">${scenario.question}</div>
        `;

        const answerOptions = document.getElementById('answerOptions');
        answerOptions.innerHTML = '';

        const shuffledOptions = [...scenario.options].sort(() => Math.random() - 0.5);

        shuffledOptions.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'answer-option';
            optionBtn.dataset.correct = option.correct;
            optionBtn.innerHTML = `
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option.text}</span>
            `;
            optionBtn.addEventListener('click', () => this.selectAnswer(optionBtn, option.correct));
            answerOptions.appendChild(optionBtn);
        });
    }

    selectAnswer(button, isCorrect) {
        const allOptions = document.querySelectorAll('.answer-option');
        allOptions.forEach(opt => opt.disabled = true);

        if (isCorrect) {
            button.classList.add('correct');
            this.handleCorrectAnswer();
        } else {
            button.classList.add('incorrect');

            allOptions.forEach(opt => {
                if (opt.dataset.correct === 'true') {
                    opt.classList.add('correct');
                }
            });

            this.handleIncorrectAnswer();
        }
    }

    handleCorrectAnswer() {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus;

        this.updateStats();
        this.saveStats();

        const celebration = this.currentScenario.celebration;
        this.showFeedback(`✨ Correct! ${celebration}`, 'correct');
        this.playSuccessSound();

        if (this.streak % 3 === 0) {
            this.showCelebration();
        }

        setTimeout(() => {
            this.generateScenario();
        }, 3000);
    }

    handleIncorrectAnswer() {
        this.streak = 0;
        this.updateStats();

        this.showFeedback(`🤔 Not quite! ${this.currentScenario.hint}`, 'incorrect');
        this.playErrorSound();

        setTimeout(() => {
            this.generateScenario();
        }, 3000);
    }

    showHint() {
        this.hintLevel++;
        this.playTone(700, 0.15);

        if (this.hintLevel > 6) {
            this.hintLevel = 6;
        }

        document.getElementById('hintCounter').textContent = `${this.hintLevel}/6`;

        const mascot = document.getElementById('mascot');
        mascot.classList.add('talking');
        setTimeout(() => mascot.classList.remove('talking'), 500);

        const hintMessages = [
            '💡 Think about what makes a good friend!',
            '👀 Read the options carefully...',
            '🧠 Which choice would a kind person make?',
            '💝 Would this make your friend happy?',
            '🌟 What would your nicest friend do?',
            this.currentScenario.hint
        ];

        const hintMessage = hintMessages[this.hintLevel - 1] || this.currentScenario.hint;
        document.getElementById('hintContent').textContent = hintMessage;

        if (this.hintLevel === 1) {
            this.stars += 1;
            this.updateStats();
        }
    }

    showFeedback(message, type) {
        const feedbackArea = document.getElementById('feedbackArea');
        feedbackArea.innerHTML = `
            <div class="feedback-message feedback-${type}">
                ${message}
            </div>
        `;
    }

    updateStats() {
        document.getElementById('stars').textContent = `⭐ ${this.stars}`;
        document.getElementById('streak').textContent = `🔥 ${this.streak}`;
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

    mascotClick() {
        const mascot = document.getElementById('mascot');
        const messages = [
            '🦊 Hi there! Ready to learn social skills?',
            '🦊 Being kind makes the world better!',
            '🦊 You\'re doing amazing!',
            '🦊 Remember: please and thank you!',
            '🦊 Keep up the great work!',
            '🦊 Click me anytime! 🎉',
            '🦊 Sharing is caring!',
            '🦊 Being a good friend takes practice!'
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
}

document.addEventListener('DOMContentLoaded', () => {
    new SocialSkillsGame();
});