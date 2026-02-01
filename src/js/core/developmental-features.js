/**
 * Developmental Features Module
 * Provides enhanced accessibility features for children with developmental delays
 */
class DevelopmentalFeatures {
    constructor() {
        this.settings = this.loadSettings();
        this.sessionStartTime = Date.now();
        this.breakReminderInterval = null;
        this.init();
    }

    init() {
        this.applySettings();
        this.setupBreakReminders();
        this.setupAnimatedMascot();
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const defaults = {
            developmentalMode: true,
            autoReadQuestions: true,
            extraLargeButtons: true,
            superEasyLevel: true,
            breakReminders: true,
            breakIntervalMinutes: 5,
            parentPIN: '',
            sessionLimitMinutes: 30,
            countingAnimation: true,
            pictureAnswers: true,
            mascotAnimations: true
        };

        const saved = localStorage.getItem('developmentalSettings');
        if (saved) {
            try {
                return { ...defaults, ...JSON.parse(saved) };
            } catch (e) {
                return defaults;
            }
        }
        return defaults;
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        localStorage.setItem('developmentalSettings', JSON.stringify(this.settings));
        this.applySettings();
    }

    /**
     * Apply settings to the page
     */
    applySettings() {
        const body = document.body;

        // Add developmental mode class
        if (this.settings.developmentalMode) {
            body.classList.add('developmental-mode');
        } else {
            body.classList.remove('developmental-mode');
        }

        // Extra large buttons
        if (this.settings.extraLargeButtons) {
            body.classList.add('extra-large-buttons');
        } else {
            body.classList.remove('extra-large-buttons');
        }

        // Picture answers mode
        if (this.settings.pictureAnswers) {
            body.classList.add('picture-answers-mode');
        } else {
            body.classList.remove('picture-answers-mode');
        }
    }

    /**
     * Setup break reminders
     */
    setupBreakReminders() {
        if (this.breakReminderInterval) {
            clearInterval(this.breakReminderInterval);
        }

        if (!this.settings.breakReminders) return;

        const intervalMs = this.settings.breakIntervalMinutes * 60 * 1000;

        this.breakReminderInterval = setInterval(() => {
            this.showBreakReminder();
        }, intervalMs);
    }

    /**
     * Show break reminder modal
     */
    showBreakReminder() {
        // Check if modal already exists
        if (document.getElementById('breakReminderModal')) return;

        const modal = document.createElement('div');
        modal.id = 'breakReminderModal';
        modal.className = 'break-reminder-modal';
        modal.innerHTML = `
            <div class="break-reminder-content">
                <div class="break-reminder-emoji">🌈</div>
                <h2>Time for a Little Break!</h2>
                <p>You've been learning so well!</p>
                <p>Let's take a break and:</p>
                <ul class="break-activities">
                    <li>🚶 Take a little walk</li>
                    <li>💧 Have a drink of water</li>
                    <li>🤸 Do some stretches</li>
                    <li>👀 Look at something far away</li>
                </ul>
                <button class="break-continue-btn" id="breakContinueBtn">
                    I'm Ready to Continue! 🚀
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Speak the reminder
        if (window.voiceNarrator && this.settings.autoReadQuestions) {
            window.voiceNarrator.speak("Time for a little break! You've been learning so well! Take a walk, have some water, or do some stretches. Press the button when you're ready to continue!", { priority: true });
        }

        // Add click handler
        document.getElementById('breakContinueBtn').addEventListener('click', () => {
            modal.remove();
            if (window.voiceNarrator) {
                window.voiceNarrator.speak("Great! Let's keep learning!", { priority: true });
            }
        });
    }

    /**
     * Setup animated mascot
     */
    setupAnimatedMascot() {
        // This will be enhanced by individual games
        document.addEventListener('mascot:happy', () => this.mascotReaction('happy'));
        document.addEventListener('mascot:celebrate', () => this.mascotReaction('celebrate'));
        document.addEventListener('mascot:encourage', () => this.mascotReaction('encourage'));
        document.addEventListener('mascot:wave', () => this.mascotReaction('wave'));
    }

    /**
     * Animate mascot with reaction
     * @param {string} reaction - Type of reaction
     */
    mascotReaction(reaction) {
        if (!this.settings.mascotAnimations) return;

        const mascot = document.getElementById('mascot') || document.getElementById('menuMascot');
        if (!mascot) return;

        // Remove any existing animation classes
        mascot.classList.remove('mascot-bounce', 'mascot-spin', 'mascot-wave', 'mascot-jump');

        // Add animation class based on reaction
        switch (reaction) {
            case 'happy':
                mascot.classList.add('mascot-bounce');
                break;
            case 'celebrate':
                mascot.classList.add('mascot-spin');
                break;
            case 'encourage':
                mascot.classList.add('mascot-wave');
                break;
            case 'wave':
                mascot.classList.add('mascot-wave');
                break;
        }

        // Remove animation class after animation completes
        setTimeout(() => {
            mascot.classList.remove('mascot-bounce', 'mascot-spin', 'mascot-wave', 'mascot-jump');
        }, 1000);
    }

    /**
     * Check if session limit reached
     */
    checkSessionLimit() {
        if (!this.settings.sessionLimitMinutes) return false;

        const elapsedMinutes = (Date.now() - this.sessionStartTime) / 60000;
        return elapsedMinutes >= this.settings.sessionLimitMinutes;
    }

    /**
     * Show session limit reached modal
     */
    showSessionLimitReached() {
        const modal = document.createElement('div');
        modal.id = 'sessionLimitModal';
        modal.className = 'session-limit-modal';
        modal.innerHTML = `
            <div class="session-limit-content">
                <div class="session-limit-emoji">😴</div>
                <h2>Great Learning Session!</h2>
                <p>You've been learning for ${this.settings.sessionLimitMinutes} minutes!</p>
                <p>Time to take a longer break now.</p>
                <div class="session-limit-buttons">
                    <a href="../../../index.html" class="session-home-btn">🏠 Go Home</a>
                    <button class="session-unlock-btn" id="sessionUnlockBtn">🔓 Parent Unlock</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Parent unlock
        document.getElementById('sessionUnlockBtn').addEventListener('click', () => {
            const pin = prompt('Enter parent PIN:');
            if (pin === this.settings.parentPIN) {
                modal.remove();
                this.sessionStartTime = Date.now(); // Reset timer
            } else {
                alert('Incorrect PIN');
            }
        });

        // Speak the message
        if (window.voiceNarrator) {
            window.voiceNarrator.speak("Great learning session! You've been learning for a while. Time to take a longer break now.", { priority: true });
        }
    }

    /**
     * Create picture answer options
     * @param {number} correctAnswer - The correct answer
     * @param {number} numOptions - Number of options to show
     * @returns {Array} Array of answer objects
     */
    createPictureAnswerOptions(correctAnswer, numOptions = 4) {
        const options = [{ value: correctAnswer, isCorrect: true }];
        const usedValues = new Set([correctAnswer]);

        // Generate wrong answers close to correct answer
        while (options.length < numOptions) {
            let wrongAnswer;
            const offset = Math.floor(Math.random() * 5) + 1;
            if (Math.random() < 0.5) {
                wrongAnswer = correctAnswer + offset;
            } else {
                wrongAnswer = Math.max(1, correctAnswer - offset);
            }

            if (!usedValues.has(wrongAnswer) && wrongAnswer > 0) {
                usedValues.add(wrongAnswer);
                options.push({ value: wrongAnswer, isCorrect: false });
            }
        }

        // Shuffle options
        return this.shuffleArray(options);
    }

    /**
     * Shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Get emoji objects for a number
     * @param {number} count - Number of objects
     * @returns {string} HTML string with emoji objects
     */
    getEmojiObjects(count) {
        const emojis = ['🍎', '🌟', '🎈', '🦋', '🐶', '🌸', '🍪', '🚗', '⚽', '🎁'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        let html = '<div class="emoji-objects">';
        for (let i = 0; i < count; i++) {
            html += `<span class="emoji-object" data-index="${i}">${emoji}</span>`;
        }
        html += '</div>';

        return html;
    }

    /**
     * Animate counting objects one by one
     * @param {HTMLElement} container - Container element
     * @param {number} count - Number to count to
     */
    animateCountingObjects(container, count) {
        const objects = container.querySelectorAll('.emoji-object');
        let current = 0;

        const countNext = () => {
            if (current < objects.length && current < count) {
                objects[current].classList.add('counted');
                objects[current].classList.add('pop');

                if (window.voiceNarrator && this.settings.countingAnimation) {
                    window.voiceNarrator.speak((current + 1).toString(), { priority: true });
                }

                current++;
                setTimeout(countNext, 600);
            }
        };

        countNext();
    }

    /**
     * Open parent settings modal
     */
    openParentSettings() {
        const modal = document.createElement('div');
        modal.id = 'parentSettingsModal';
        modal.className = 'parent-settings-modal';
        modal.innerHTML = `
            <div class="parent-settings-content">
                <h2>👨‍👩‍👦 Parent Settings</h2>
                
                <div class="settings-section">
                    <h3>Learning Mode</h3>
                    <label class="setting-toggle">
                        <input type="checkbox" id="devModeToggle" ${this.settings.developmentalMode ? 'checked' : ''}>
                        <span>Developmental Mode</span>
                    </label>
                    <label class="setting-toggle">
                        <input type="checkbox" id="superEasyToggle" ${this.settings.superEasyLevel ? 'checked' : ''}>
                        <span>Super Easy Level (numbers 1-5)</span>
                    </label>
                    <label class="setting-toggle">
                        <input type="checkbox" id="pictureAnswersToggle" ${this.settings.pictureAnswers ? 'checked' : ''}>
                        <span>Picture Answers (no typing)</span>
                    </label>
                </div>
                
                <div class="settings-section">
                    <h3>Accessibility</h3>
                    <label class="setting-toggle">
                        <input type="checkbox" id="autoReadToggle" ${this.settings.autoReadQuestions ? 'checked' : ''}>
                        <span>Read Questions Aloud</span>
                    </label>
                    <label class="setting-toggle">
                        <input type="checkbox" id="largeButtonsToggle" ${this.settings.extraLargeButtons ? 'checked' : ''}>
                        <span>Extra Large Buttons</span>
                    </label>
                    <label class="setting-toggle">
                        <input type="checkbox" id="countingAnimToggle" ${this.settings.countingAnimation ? 'checked' : ''}>
                        <span>Counting Animations</span>
                    </label>
                    <label class="setting-toggle">
                        <input type="checkbox" id="mascotAnimToggle" ${this.settings.mascotAnimations ? 'checked' : ''}>
                        <span>Mascot Animations</span>
                    </label>
                </div>
                
                <div class="settings-section">
                    <h3>Time Management</h3>
                    <label class="setting-toggle">
                        <input type="checkbox" id="breakRemindersToggle" ${this.settings.breakReminders ? 'checked' : ''}>
                        <span>Break Reminders</span>
                    </label>
                    <label class="setting-input">
                        <span>Break Interval (minutes):</span>
                        <input type="number" id="breakIntervalInput" value="${this.settings.breakIntervalMinutes}" min="3" max="30">
                    </label>
                    <label class="setting-input">
                        <span>Session Limit (minutes, 0=off):</span>
                        <input type="number" id="sessionLimitInput" value="${this.settings.sessionLimitMinutes}" min="0" max="120">
                    </label>
                </div>
                
                <div class="settings-section">
                    <h3>Parent PIN (optional)</h3>
                    <label class="setting-input">
                        <span>Set PIN for unlocking:</span>
                        <input type="password" id="parentPINInput" value="${this.settings.parentPIN}" maxlength="4" placeholder="4 digits">
                    </label>
                </div>
                
                <div class="settings-buttons">
                    <button class="cancel-btn" id="cancelSettingsBtn">Cancel</button>
                    <button class="save-btn" id="saveSettingsBtn">Save Settings</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cancel button
        document.getElementById('cancelSettingsBtn').addEventListener('click', () => {
            modal.remove();
        });

        // Save button
        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.settings.developmentalMode = document.getElementById('devModeToggle').checked;
            this.settings.superEasyLevel = document.getElementById('superEasyToggle').checked;
            this.settings.pictureAnswers = document.getElementById('pictureAnswersToggle').checked;
            this.settings.autoReadQuestions = document.getElementById('autoReadToggle').checked;
            this.settings.extraLargeButtons = document.getElementById('largeButtonsToggle').checked;
            this.settings.countingAnimation = document.getElementById('countingAnimToggle').checked;
            this.settings.mascotAnimations = document.getElementById('mascotAnimToggle').checked;
            this.settings.breakReminders = document.getElementById('breakRemindersToggle').checked;
            this.settings.breakIntervalMinutes = parseInt(document.getElementById('breakIntervalInput').value) || 5;
            this.settings.sessionLimitMinutes = parseInt(document.getElementById('sessionLimitInput').value) || 0;
            this.settings.parentPIN = document.getElementById('parentPINInput').value;

            this.saveSettings();
            this.setupBreakReminders();
            modal.remove();

            // Reload page to apply changes
            if (confirm('Settings saved! Reload page to apply all changes?')) {
                window.location.reload();
            }
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Check if super easy level is enabled
     */
    isSuperEasyEnabled() {
        return this.settings.superEasyLevel && this.settings.developmentalMode;
    }

    /**
     * Get number range for super easy level
     */
    getSuperEasyRange() {
        return { min: 1, max: 5 };
    }
}

// Create global instance
window.developmentalFeatures = new DevelopmentalFeatures();
