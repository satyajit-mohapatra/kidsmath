/**
 * Voice Narrator Module
 * Provides text-to-speech functionality for children with developmental delays
 * Uses Web Speech API with child-friendly settings
 */
class VoiceNarrator {
    constructor() {
        this.synth = window.speechSynthesis;
        this.enabled = this.loadPreference();
        this.rate = 0.8; // Slower for easier comprehension
        this.pitch = 1.1; // Slightly higher for friendly tone
        this.volume = 1.0;
        this.voice = null;
        this.queue = [];
        this.isSpeaking = false;
        
        this.init();
    }

    init() {
        // Wait for voices to load
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.selectBestVoice();
        }
        this.selectBestVoice();
    }

    selectBestVoice() {
        const voices = this.synth.getVoices();
        
        // Prefer child-friendly voices in order
        const preferredVoices = [
            'Samantha', // macOS friendly female voice
            'Karen',    // Australian friendly voice
            'Moira',    // Irish friendly voice
            'Google US English Female',
            'Microsoft Aria Online',
            'Google UK English Female',
        ];
        
        for (const preferred of preferredVoices) {
            const found = voices.find(v => 
                v.name.includes(preferred) || 
                v.name.toLowerCase().includes(preferred.toLowerCase())
            );
            if (found) {
                this.voice = found;
                return;
            }
        }
        
        // Fallback to any English female voice or default
        this.voice = voices.find(v => 
            v.lang.startsWith('en') && 
            (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    }

    loadPreference() {
        return localStorage.getItem('voiceNarratorEnabled') !== 'false';
    }

    savePreference() {
        localStorage.setItem('voiceNarratorEnabled', this.enabled.toString());
    }

    enable() {
        this.enabled = true;
        this.savePreference();
    }

    disable() {
        this.enabled = false;
        this.stop();
        this.savePreference();
    }

    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.enabled;
    }

    /**
     * Speak text with child-friendly settings
     * @param {string} text - Text to speak
     * @param {Object} options - Optional settings
     * @param {boolean} options.priority - If true, interrupts current speech
     * @param {number} options.delay - Delay before speaking (ms)
     * @param {Function} options.onEnd - Callback when speech ends
     */
    speak(text, options = {}) {
        if (!this.enabled || !this.synth) return;

        const { priority = false, delay = 0, onEnd = null } = options;

        // Clean text for speech
        const cleanText = this.cleanTextForSpeech(text);
        
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = this.voice;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;

        if (onEnd) {
            utterance.onend = onEnd;
        }

        utterance.onerror = (event) => {
            console.warn('Speech synthesis error:', event.error);
            this.isSpeaking = false;
            this.processQueue();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            if (onEnd) onEnd();
            this.processQueue();
        };

        const addToQueue = () => {
            if (priority) {
                this.stop();
                this.synth.speak(utterance);
                this.isSpeaking = true;
            } else {
                this.queue.push(utterance);
                this.processQueue();
            }
        };

        if (delay > 0) {
            setTimeout(addToQueue, delay);
        } else {
            addToQueue();
        }
    }

    processQueue() {
        if (this.isSpeaking || this.queue.length === 0) return;
        
        const utterance = this.queue.shift();
        this.synth.speak(utterance);
        this.isSpeaking = true;
    }

    /**
     * Clean text for natural speech
     */
    cleanTextForSpeech(text) {
        if (!text) return '';
        
        return text
            // Remove emojis (they don't speak well)
            .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F100}-\u{1F1FF}]|[\u{1F200}-\u{1F2FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|➕|➖|✖️|➗|⭐|🔥|✓|✗|←|→|⬅️|➡️/gu, '')
            // Convert math operators to words
            .replace(/\+/g, ' plus ')
            .replace(/\-/g, ' minus ')
            .replace(/×/g, ' times ')
            .replace(/÷/g, ' divided by ')
            .replace(/=/g, ' equals ')
            .replace(/\?/g, ' what? ')
            // Clean up multiple spaces
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Speak a number with counting effect
     * @param {number} count - Number to count to
     * @param {number} delay - Delay between numbers (ms)
     */
    countTo(count, delay = 500) {
        if (!this.enabled) return Promise.resolve();
        
        return new Promise((resolve) => {
            let current = 1;
            
            const speakNext = () => {
                if (current <= count) {
                    this.speak(current.toString(), { priority: true });
                    current++;
                    setTimeout(speakNext, delay);
                } else {
                    resolve();
                }
            };
            
            speakNext();
        });
    }

    /**
     * Speak encouragement messages
     */
    speakEncouragement() {
        const messages = [
            "Great job!",
            "You're amazing!",
            "Wonderful!",
            "Excellent work!",
            "You did it!",
            "Super star!",
            "Fantastic!",
            "Well done!",
            "You're so smart!",
            "Keep going!"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.speak(message, { priority: true });
    }

    /**
     * Speak gentle correction
     */
    speakTryAgain() {
        const messages = [
            "Try again!",
            "Almost there!",
            "You can do it!",
            "Let's try once more!",
            "Close! Try again!"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.speak(message, { priority: true });
    }

    /**
     * Stop all speech
     */
    stop() {
        this.synth.cancel();
        this.queue = [];
        this.isSpeaking = false;
    }

    /**
     * Check if currently speaking
     */
    get speaking() {
        return this.synth.speaking || this.isSpeaking;
    }
}

// Create global instance
window.voiceNarrator = new VoiceNarrator();
