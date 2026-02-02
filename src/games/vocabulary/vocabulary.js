class VocabularyGame extends BaseGame {
    constructor() {
        super('vocabulary');
        this.currentCategory = 'animals';
        this.targetCount = 5;
        this.userAnswers = [];
        this.correctAnswers = [];
        this.hintIndex = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateChallenge();
    }

    setupEventListeners() {
        // Group tabs
        document.querySelectorAll('.group-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.group-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const group = e.target.dataset.group;
                document.querySelectorAll('.category-group').forEach(g => g.classList.remove('active'));
                document.querySelector(`.category-group[data-group="${group}"]`).classList.add('active');
                
                // Activate first category in group
                const firstBtn = document.querySelector(`.category-group[data-group="${group}"] .category-btn`);
                if (firstBtn) {
                    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                    firstBtn.classList.add('active');
                    this.currentCategory = firstBtn.dataset.category;
                    this.generateChallenge();
                }
            });
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.generateChallenge();
            });
        });

        // Action buttons
        document.getElementById('submitBtn').addEventListener('click', () => this.checkAnswers());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipChallenge());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextChallenge());
        document.getElementById('mascot').addEventListener('click', () => this.mascotClick());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.checkAnswers();
            }
        });
    }

    getWordLists() {
        return {
            animals: [
                { name: 'Lion', emoji: '🦁' }, { name: 'Elephant', emoji: '🐘' },
                { name: 'Giraffe', emoji: '🦒' }, { name: 'Zebra', emoji: '🦓' },
                { name: 'Tiger', emoji: '🐅' }, { name: 'Bear', emoji: '🐻' },
                { name: 'Fox', emoji: '🦊' }, { name: 'Rabbit', emoji: '🐰' },
                { name: 'Panda', emoji: '🐼' }, { name: 'Monkey', emoji: '🐒' },
                { name: 'Gorilla', emoji: '🦍' }, { name: 'Wolf', emoji: '🐺' },
                { name: 'Horse', emoji: '🐴' }, { name: 'Deer', emoji: '🦌' },
                { name: 'Dog', emoji: '🐕' }, { name: 'Cat', emoji: '🐈' },
                { name: 'Cow', emoji: '🐄' }, { name: 'Pig', emoji: '🐖' },
                { name: 'Sheep', emoji: '🐑' }, { name: 'Goat', emoji: '🐐' },
                { name: 'Chicken', emoji: '🐓' }, { name: 'Duck', emoji: '🦆' },
                { name: 'Frog', emoji: '🐸' }, { name: 'Snake', emoji: '🐍' },
                { name: 'Lizard', emoji: '🦎' }, { name: 'Turtle', emoji: '🐢' },
                { name: 'Crocodile', emoji: '🐊' }, { name: 'Dolphin', emoji: '🐬' },
                { name: 'Whale', emoji: '🐳' }, { name: 'Shark', emoji: '🦈' },
                { name: 'Octopus', emoji: '🐙' }, { name: 'Seal', emoji: '🦭' },
                { name: 'Penguin', emoji: '🐧' }, { name: 'Kangaroo', emoji: '🦘' },
                { name: 'Koala', emoji: '🐨' }, { name: 'Camel', emoji: '🐪' },
                { name: 'Hippo', emoji: '🦛' }, { name: 'Rhino', emoji: '🦏' },
                { name: 'Bat', emoji: '🦇' }, { name: 'Squirrel', emoji: '🐿️' },
                { name: 'Raccoon', emoji: '🦝' }, { name: 'Skunk', emoji: '🦨' },
                { name: 'Otter', emoji: '🦦' }, { name: 'Sloth', emoji: '🦥' },
                { name: 'Mouse', emoji: '🐁' }, { name: 'Rat', emoji: '🐀' },
                { name: 'Hedgehog', emoji: '🦔' }, { name: 'Beaver', emoji: '🦫' },
                { name: 'Bison', emoji: '🦬' }, { name: 'Moose', emoji: '🫎' }
            ],
            birds: [
                { name: 'Eagle', emoji: '🦅' }, { name: 'Owl', emoji: '🦉' },
                { name: 'Parrot', emoji: '🦜' }, { name: 'Peacock', emoji: '🦚' },
                { name: 'Swan', emoji: '🦢' }, { name: 'Flamingo', emoji: '🦩' },
                { name: 'Dove', emoji: '🕊️' }, { name: 'Penguin', emoji: '🐧' },
                { name: 'Rooster', emoji: '🐓' }, { name: 'Turkey', emoji: '🦃' },
                { name: 'Duck', emoji: '🦆' }, { name: 'Goose', emoji: '🦢' },
                { name: 'Hummingbird', emoji: '🐦' }, { name: 'Woodpecker', emoji: '🐦' },
                { name: 'Crow', emoji: '🐦' }, { name: 'Sparrow', emoji: '🐦' },
                { name: 'Robin', emoji: '🐦' }, { name: 'Blue Jay', emoji: '🐦' },
                { name: 'Cardinal', emoji: '🐦' }, { name: 'Canary', emoji: '🐦' },
                { name: 'Seagull', emoji: '🐦' }, { name: 'Pelican', emoji: '🐦' },
                { name: 'Heron', emoji: '🐦' }, { name: 'Stork', emoji: '🐦' },
                { name: 'Crane', emoji: '🐦' }, { name: 'Ostrich', emoji: '🐦' },
                { name: 'Emu', emoji: '🐦' }, { name: 'Kiwi', emoji: '🐦' },
                { name: 'Toucan', emoji: '🐦' }, { name: 'Kingfisher', emoji: '🐦' },
                { name: 'Puffin', emoji: '🐦' }, { name: 'Swallow', emoji: '🐦' },
                { name: 'Nightingale', emoji: '🐦' }, { name: 'Lark', emoji: '🐦' },
                { name: 'Cuckoo', emoji: '🐦' }, { name: 'Pigeon', emoji: '🐦' },
                { name: 'Chicken', emoji: '🐔' }, { name: 'Hen', emoji: '🐔' },
                { name: 'Chick', emoji: '🐤' }, { name: 'Hawk', emoji: '🦅' },
                { name: 'Falcon', emoji: '🦅' }, { name: 'Vulture', emoji: '🦅' }
            ],
            insects: [
                { name: 'Bee', emoji: '🐝' }, { name: 'Butterfly', emoji: '🦋' },
                { name: 'Ladybug', emoji: '🐞' }, { name: 'Ant', emoji: '🐜' },
                { name: 'Spider', emoji: '🕷️' }, { name: 'Caterpillar', emoji: '🐛' },
                { name: 'Snail', emoji: '🐌' }, { name: 'Cricket', emoji: '🦗' },
                { name: 'Grasshopper', emoji: '🦗' }, { name: 'Beetle', emoji: '🪲' },
                { name: 'Fly', emoji: '🪰' }, { name: 'Mosquito', emoji: '🦟' },
                { name: 'Worm', emoji: '🪱' }, { name: 'Dragonfly', emoji: '🦋' },
                { name: 'Firefly', emoji: '✨' }, { name: 'Moth', emoji: '🦋' },
                { name: 'Wasp', emoji: '🐝' }, { name: 'Hornet', emoji: '🐝' },
                { name: 'Centipede', emoji: '🐛' }, { name: 'Scorpion', emoji: '🦂' },
                { name: 'Flea', emoji: '🐜' }, { name: 'Louse', emoji: '🐜' },
                { name: 'Termite', emoji: '🐜' }, { name: 'Cockroach', emoji: '🪳' },
                { name: 'Praying Mantis', emoji: '🦗' }
            ],
            'sea-animals': [
                { name: 'Fish', emoji: '🐟' }, { name: 'Dolphin', emoji: '🐬' },
                { name: 'Whale', emoji: '🐳' }, { name: 'Shark', emoji: '🦈' },
                { name: 'Octopus', emoji: '🐙' }, { name: 'Squid', emoji: '🦑' },
                { name: 'Crab', emoji: '🦀' }, { name: 'Lobster', emoji: '🦞' },
                { name: 'Shrimp', emoji: '🦐' }, { name: 'Jellyfish', emoji: '🪼' },
                { name: 'Seahorse', emoji: '🦑' }, { name: 'Starfish', emoji: '⭐' },
                { name: 'Seal', emoji: '🦭' }, { name: 'Walrus', emoji: '🦭' },
                { name: 'Penguin', emoji: '🐧' }, { name: 'Turtle', emoji: '🐢' },
                { name: 'Eel', emoji: '🐍' }, { name: 'Ray', emoji: '🐟' },
                { name: 'Clownfish', emoji: '🐠' }, { name: 'Angelfish', emoji: '🐠' },
                { name: 'Pufferfish', emoji: '🐡' }, { name: 'Oyster', emoji: '🦪' },
                { name: 'Coral', emoji: '🪸' }, { name: 'Seaweed', emoji: '🌿' },
                { name: 'Plankton', emoji: '🦠' }
            ],
            'farm-animals': [
                { name: 'Cow', emoji: '🐄' }, { name: 'Pig', emoji: '🐖' },
                { name: 'Sheep', emoji: '🐑' }, { name: 'Goat', emoji: '🐐' },
                { name: 'Horse', emoji: '🐴' }, { name: 'Chicken', emoji: '🐓' },
                { name: 'Rooster', emoji: '🐓' }, { name: 'Duck', emoji: '🦆' },
                { name: 'Goose', emoji: '🦢' }, { name: 'Turkey', emoji: '🦃' },
                { name: 'Donkey', emoji: '🫏' }, { name: 'Rabbit', emoji: '🐰' },
                { name: 'Cat', emoji: '🐈' }, { name: 'Dog', emoji: '🐕' },
                { name: 'Mouse', emoji: '🐁' }, { name: 'Bull', emoji: '🐂' },
                { name: 'Ox', emoji: '🐂' }, { name: 'Calf', emoji: '🐄' },
                { name: 'Lamb', emoji: '🐑' }, { name: 'Piglet', emoji: '🐖' },
                { name: 'Foal', emoji: '🐴' }, { name: 'Chick', emoji: '🐤' },
                { name: 'Hen', emoji: '🐔' }
            ],
            fruits: [
                { name: 'Apple', emoji: '🍎' }, { name: 'Banana', emoji: '🍌' },
                { name: 'Orange', emoji: '🍊' }, { name: 'Grapes', emoji: '🍇' },
                { name: 'Strawberry', emoji: '🍓' }, { name: 'Watermelon', emoji: '🍉' },
                { name: 'Peach', emoji: '🍑' }, { name: 'Cherry', emoji: '🍒' },
                { name: 'Pineapple', emoji: '🍍' }, { name: 'Mango', emoji: '🥭' },
                { name: 'Kiwi', emoji: '🥝' }, { name: 'Pear', emoji: '🍐' },
                { name: 'Lemon', emoji: '🍋' }, { name: 'Lime', emoji: '🍋' },
                { name: 'Coconut', emoji: '🥥' }, { name: 'Papaya', emoji: '🥭' },
                { name: 'Guava', emoji: '🍐' }, { name: 'Pomegranate', emoji: '🫐' },
                { name: 'Blueberry', emoji: '🫐' }, { name: 'Raspberry', emoji: '🫐' },
                { name: 'Blackberry', emoji: '🫐' }, { name: 'Apricot', emoji: '🍑' },
                { name: 'Plum', emoji: '🍑' }, { name: 'Fig', emoji: '🫐' },
                { name: 'Date', emoji: '🌴' }, { name: 'Avocado', emoji: '🥑' },
                { name: 'Dragon Fruit', emoji: '🐉' }, { name: 'Passion Fruit', emoji: '🍈' },
                { name: 'Lychee', emoji: '🍒' }, { name: 'Durian', emoji: '🍈' },
                { name: 'Jackfruit', emoji: '🍈' }, { name: 'Star Fruit', emoji: '⭐' },
                { name: 'Persimmon', emoji: '🍅' }, { name: 'Tangerine', emoji: '🍊' },
                { name: 'Grapefruit', emoji: '🍊' }, { name: 'Melon', emoji: '🍈' },
                { name: 'Cantaloupe', emoji: '🍈' }, { name: 'Honeydew', emoji: '🍈' }
            ],
            vegetables: [
                { name: 'Carrot', emoji: '🥕' }, { name: 'Broccoli', emoji: '🥦' },
                { name: 'Cucumber', emoji: '🥒' }, { name: 'Eggplant', emoji: '🍆' },
                { name: 'Onion', emoji: '🧅' }, { name: 'Garlic', emoji: '🧄' },
                { name: 'Potato', emoji: '🥔' }, { name: 'Sweet Potato', emoji: '🍠' },
                { name: 'Lettuce', emoji: '🥬' }, { name: 'Pepper', emoji: '🌶️' },
                { name: 'Bell Pepper', emoji: '🫑' }, { name: 'Mushroom', emoji: '🍄' },
                { name: 'Corn', emoji: '🌽' }, { name: 'Tomato', emoji: '🍅' },
                { name: 'Cabbage', emoji: '🥬' }, { name: 'Cauliflower', emoji: '🥦' },
                { name: 'Spinach', emoji: '🥬' }, { name: 'Kale', emoji: '🥬' },
                { name: 'Celery', emoji: '🥬' }, { name: 'Asparagus', emoji: '🥬' },
                { name: 'Peas', emoji: '🟢' }, { name: 'Green Beans', emoji: '🟢' },
                { name: 'Pumpkin', emoji: '🎃' }, { name: 'Squash', emoji: '🎃' },
                { name: 'Zucchini', emoji: '🥒' }, { name: 'Radish', emoji: '🍠' },
                { name: 'Beet', emoji: '🍠' }, { name: 'Turnip', emoji: '🍠' },
                { name: 'Okra', emoji: '🥬' }, { name: 'Artichoke', emoji: '🌿' },
                { name: 'Leek', emoji: '🧅' }, { name: 'Scallion', emoji: '🧅' },
                { name: 'Ginger', emoji: '🫚' }, { name: 'Yam', emoji: '🍠' }
            ],
            foods: [
                { name: 'Pizza', emoji: '🍕' }, { name: 'Burger', emoji: '🍔' },
                { name: 'Sandwich', emoji: '🥪' }, { name: 'Hot Dog', emoji: '🌭' },
                { name: 'Taco', emoji: '🌮' }, { name: 'Burrito', emoji: '🌯' },
                { name: 'Sushi', emoji: '🍣' }, { name: 'Rice', emoji: '🍚' },
                { name: 'Pasta', emoji: '🍝' }, { name: 'Noodles', emoji: '🍜' },
                { name: 'Soup', emoji: '🍲' }, { name: 'Salad', emoji: '🥗' },
                { name: 'Bread', emoji: '🍞' }, { name: 'Bagel', emoji: '🥯' },
                { name: 'Croissant', emoji: '🥐' }, { name: 'Donut', emoji: '🍩' },
                { name: 'Cake', emoji: '🎂' }, { name: 'Cookie', emoji: '🍪' },
                { name: 'Ice Cream', emoji: '🍦' }, { name: 'Chocolate', emoji: '🍫' },
                { name: 'Candy', emoji: '🍬' }, { name: 'Popcorn', emoji: '🍿' },
                { name: 'Pretzel', emoji: '🥨' }, { name: 'Cheese', emoji: '🧀' },
                { name: 'Egg', emoji: '🥚' }, { name: 'Bacon', emoji: '🥓' },
                { name: 'Steak', emoji: '🥩' }, { name: 'Chicken', emoji: '🍗' },
                { name: 'Fish', emoji: '🐟' }, { name: 'Shrimp', emoji: '🦐' },
                { name: 'Omelet', emoji: '🍳' }, { name: 'Pancake', emoji: '🥞' },
                { name: 'Waffle', emoji: '🧇' }, { name: 'French Fries', emoji: '🍟' },
                { name: 'Chips', emoji: '🥔' }, { name: 'Pie', emoji: '🥧' },
                { name: 'Pudding', emoji: '🍮' }, { name: 'Honey', emoji: '🍯' }
            ],
            drinks: [
                { name: 'Water', emoji: '💧' }, { name: 'Milk', emoji: '🥛' },
                { name: 'Juice', emoji: '🧃' }, { name: 'Coffee', emoji: '☕' },
                { name: 'Tea', emoji: '🍵' }, { name: 'Soda', emoji: '🥤' },
                { name: 'Lemonade', emoji: '🍋' }, { name: 'Smoothie', emoji: '🥤' },
                { name: 'Hot Chocolate', emoji: '☕' }, { name: 'Milkshake', emoji: '🥤' },
                { name: 'Iced Tea', emoji: '🧊' }, { name: 'Orange Juice', emoji: '🍊' },
                { name: 'Apple Juice', emoji: '🍎' }, { name: 'Grape Juice', emoji: '🍇' },
                { name: 'Coconut Water', emoji: '🥥' }, { name: 'Energy Drink', emoji: '⚡' },
                { name: 'Sports Drink', emoji: '🥤' }, { name: 'Sparkling Water', emoji: '🫧' },
                { name: 'Wine', emoji: '🍷' }, { name: 'Beer', emoji: '🍺' },
                { name: 'Cocktail', emoji: '🍸' }, { name: 'Champagne', emoji: '🍾' },
                { name: 'Sake', emoji: '🍶' }, { name: 'Mate', emoji: '🧉' }
            ],
            colors: [
                { name: 'Red', emoji: '🔴' }, { name: 'Blue', emoji: '🔵' },
                { name: 'Green', emoji: '🟢' }, { name: 'Yellow', emoji: '🟡' },
                { name: 'Orange', emoji: '🟠' }, { name: 'Purple', emoji: '🟣' },
                { name: 'Pink', emoji: '🩷' }, { name: 'Black', emoji: '⚫' },
                { name: 'White', emoji: '⚪' }, { name: 'Brown', emoji: '🟤' },
                { name: 'Gray', emoji: '🩶' }, { name: 'Light Blue', emoji: '🩵' },
                { name: 'Gold', emoji: '🟡' }, { name: 'Silver', emoji: '⚪' },
                { name: 'Beige', emoji: '🟤' }, { name: 'Navy', emoji: '🔵' },
                { name: 'Teal', emoji: '🔵' }, { name: 'Cyan', emoji: '🔵' },
                { name: 'Magenta', emoji: '🟣' }, { name: 'Lime', emoji: '🟢' },
                { name: 'Olive', emoji: '🟢' }, { name: 'Maroon', emoji: '🔴' },
                { name: 'Turquoise', emoji: '🔵' }, { name: 'Indigo', emoji: '🟣' },
                { name: 'Violet', emoji: '🟣' }, { name: 'Coral', emoji: '🟠' },
                { name: 'Peach', emoji: '🟠' }, { name: 'Lavender', emoji: '🟣' },
                { name: 'Mint', emoji: '🟢' }, { name: 'Cream', emoji: '⚪' }
            ],
            shapes: [
                { name: 'Circle', emoji: '⭕' }, { name: 'Square', emoji: '🔲' },
                { name: 'Triangle', emoji: '🔺' }, { name: 'Rectangle', emoji: '⬜' },
                { name: 'Diamond', emoji: '🔷' }, { name: 'Star', emoji: '⭐' },
                { name: 'Heart', emoji: '❤️' }, { name: 'Arrow', emoji: '➡️' },
                { name: 'Cross', emoji: '➕' }, { name: 'Oval', emoji: '🥚' },
                { name: 'Crescent', emoji: '🌙' }, { name: 'Hexagon', emoji: '⬡' },
                { name: 'Pentagon', emoji: '⬠' }, { name: 'Octagon', emoji: '🛑' },
                { name: 'Rhombus', emoji: '🔶' }, { name: 'Trapezoid', emoji: '⬜' },
                { name: 'Parallelogram', emoji: '⬜' }, { name: 'Ellipse', emoji: '🥚' },
                { name: 'Semicircle', emoji: '⭕' }, { name: 'Ring', emoji: '⭕' },
                { name: 'Spiral', emoji: '🌀' }, { name: 'Wave', emoji: '〰️' },
                { name: 'Zigzag', emoji: '⚡' }, { name: 'Blob', emoji: '🔵' }
            ],
            'body-parts': [
                { name: 'Eye', emoji: '👁️' }, { name: 'Ear', emoji: '👂' },
                { name: 'Nose', emoji: '👃' }, { name: 'Mouth', emoji: '👄' },
                { name: 'Tooth', emoji: '🦷' }, { name: 'Tongue', emoji: '👅' },
                { name: 'Arm', emoji: '💪' }, { name: 'Leg', emoji: '🦵' },
                { name: 'Foot', emoji: '🦶' }, { name: 'Hand', emoji: '🖐️' },
                { name: 'Brain', emoji: '🧠' }, { name: 'Heart', emoji: '❤️' },
                { name: 'Lungs', emoji: '🫁' }, { name: 'Bone', emoji: '🦴' },
                { name: 'Stomach', emoji: '🫀' }, { name: 'Head', emoji: '👤' },
                { name: 'Hair', emoji: '💇' }, { name: 'Face', emoji: '😊' },
                { name: 'Neck', emoji: '👤' }, { name: 'Chest', emoji: '👤' },
                { name: 'Back', emoji: '👤' }, { name: 'Shoulder', emoji: '💪' },
                { name: 'Elbow', emoji: '💪' }, { name: 'Wrist', emoji: '✋' },
                { name: 'Finger', emoji: '👆' }, { name: 'Knee', emoji: '🦵' },
                { name: 'Ankle', emoji: '🦶' }, { name: 'Toe', emoji: '🦶' },
                { name: 'Skin', emoji: '👋' }, { name: 'Muscle', emoji: '💪' },
                { name: 'Blood', emoji: '🩸' }, { name: 'Vein', emoji: '🩸' }
            ],
            emotions: [
                { name: 'Happy', emoji: '😊' }, { name: 'Sad', emoji: '😢' },
                { name: 'Angry', emoji: '😠' }, { name: 'Scared', emoji: '😨' },
                { name: 'Surprised', emoji: '😮' }, { name: 'Tired', emoji: '😴' },
                { name: 'Sick', emoji: '🤒' }, { name: 'Excited', emoji: '🤩' },
                { name: 'Bored', emoji: '😑' }, { name: 'Confused', emoji: '😕' },
                { name: 'Proud', emoji: '😌' }, { name: 'Shy', emoji: '😳' },
                { name: 'Silly', emoji: '😜' }, { name: 'Worried', emoji: '😟' },
                { name: 'Embarrassed', emoji: '😅' }, { name: 'Grumpy', emoji: '😒' },
                { name: 'Nervous', emoji: '😰' }, { name: 'Calm', emoji: '😌' },
                { name: 'Lonely', emoji: '😔' }, { name: 'Jealous', emoji: '😒' },
                { name: 'Love', emoji: '😍' }, { name: 'Laughing', emoji: '😂' },
                { name: 'Crying', emoji: '😭' }, { name: 'Sleepy', emoji: '😪' },
                { name: 'Hungry', emoji: '😋' }, { name: 'Thirsty', emoji: '🥵' },
                { name: 'Hot', emoji: '🥵' }, { name: 'Cold', emoji: '🥶' },
                { name: 'Dizzy', emoji: '😵' }, { name: 'Thinking', emoji: '🤔' }
            ],
            vehicles: [
                { name: 'Car', emoji: '🚗' }, { name: 'Bus', emoji: '🚌' },
                { name: 'Truck', emoji: '🚚' }, { name: 'Motorcycle', emoji: '🏍️' },
                { name: 'Bicycle', emoji: '🚲' }, { name: 'Train', emoji: '🚂' },
                { name: 'Airplane', emoji: '✈️' }, { name: 'Helicopter', emoji: '🚁' },
                { name: 'Boat', emoji: '⛵' }, { name: 'Ship', emoji: '🚢' },
                { name: 'Rocket', emoji: '🚀' }, { name: 'Taxi', emoji: '🚕' },
                { name: 'Police Car', emoji: '🚓' }, { name: 'Ambulance', emoji: '🚑' },
                { name: 'Fire Truck', emoji: '🚒' }, { name: 'Tractor', emoji: '🚜' },
                { name: 'Van', emoji: '🚐' }, { name: 'Jeep', emoji: '🚙' },
                { name: 'Scooter', emoji: '🛵' }, { name: 'Skateboard', emoji: '🛹' },
                { name: 'Subway', emoji: '🚇' }, { name: 'Tram', emoji: '🚊' },
                { name: 'Trolley', emoji: '🚎' }, { name: 'Canoe', emoji: '🛶' },
                { name: 'Kayak', emoji: '🛶' }, { name: 'Sailboat', emoji: '⛵' },
                { name: 'Speedboat', emoji: '🚤' }, { name: 'Cruise Ship', emoji: '🛳️' },
                { name: 'Ferry', emoji: '⛴️' }, { name: 'Spaceship', emoji: '🚀' },
                { name: 'UFO', emoji: '🛸' }, { name: 'Bulldozer', emoji: '🚜' }
            ],
            jobs: [
                { name: 'Doctor', emoji: '👨‍⚕️' }, { name: 'Nurse', emoji: '👩‍⚕️' },
                { name: 'Teacher', emoji: '👩‍🏫' }, { name: 'Police', emoji: '👮' },
                { name: 'Firefighter', emoji: '👨‍🚒' }, { name: 'Chef', emoji: '👨‍🍳' },
                { name: 'Farmer', emoji: '👩‍🌾' }, { name: 'Scientist', emoji: '👨‍🔬' },
                { name: 'Artist', emoji: '👩‍🎨' }, { name: 'Musician', emoji: '👨‍🎤' },
                { name: 'Pilot', emoji: '👨‍✈️' }, { name: 'Astronaut', emoji: '👩‍🚀' },
                { name: 'Judge', emoji: '👨‍⚖️' }, { name: 'Lawyer', emoji: '👨‍⚖️' },
                { name: 'Engineer', emoji: '👷' }, { name: 'Mechanic', emoji: '👩‍🔧' },
                { name: 'Carpenter', emoji: '👷' }, { name: 'Plumber', emoji: '👷' },
                { name: 'Electrician', emoji: '👷' }, { name: 'Builder', emoji: '👷' },
                { name: 'Driver', emoji: '🚗' }, { name: 'Sailor', emoji: '⚓' },
                { name: 'Soldier', emoji: '💂' }, { name: 'Guard', emoji: '💂' },
                { name: 'Detective', emoji: '🕵️' }, { name: 'Spy', emoji: '🕵️' },
                { name: 'Magician', emoji: '🧙' }, { name: 'Clown', emoji: '🤡' },
                { name: 'Dancer', emoji: '💃' }, { name: 'Actor', emoji: '🎭' },
                { name: 'Writer', emoji: '✍️' }, { name: 'Photographer', emoji: '📷' },
                { name: 'Barber', emoji: '💇' }, { name: 'Hairdresser', emoji: '💇' },
                { name: 'Tailor', emoji: '🧵' }, { name: 'Vet', emoji: '👨‍⚕️' }
            ],
            places: [
                { name: 'House', emoji: '🏠' }, { name: 'School', emoji: '🏫' },
                { name: 'Hospital', emoji: '🏥' }, { name: 'Store', emoji: '🏪' },
                { name: 'Restaurant', emoji: '🍽️' }, { name: 'Park', emoji: '🏞️' },
                { name: 'Beach', emoji: '🏖️' }, { name: 'Mountain', emoji: '⛰️' },
                { name: 'Forest', emoji: '🌲' }, { name: 'City', emoji: '🌆' },
                { name: 'Farm', emoji: '🚜' }, { name: 'Zoo', emoji: '🦁' },
                { name: 'Museum', emoji: '🏛️' }, { name: 'Library', emoji: '📚' },
                { name: 'Church', emoji: '⛪' }, { name: 'Mosque', emoji: '🕌' },
                { name: 'Temple', emoji: '🛕' }, { name: 'Synagogue', emoji: '🕍' },
                { name: 'Airport', emoji: '✈️' }, { name: 'Train Station', emoji: '🚉' },
                { name: 'Bus Stop', emoji: '🚏' }, { name: 'Gas Station', emoji: '⛽' },
                { name: 'Bank', emoji: '🏦' }, { name: 'Post Office', emoji: '🏤' },
                { name: 'Police Station', emoji: '🚓' }, { name: 'Fire Station', emoji: '🚒' },
                { name: 'Castle', emoji: '🏰' }, { name: 'Palace', emoji: '🏰' },
                { name: 'Bridge', emoji: '🌉' }, { name: 'Tower', emoji: '🗼' },
                { name: 'Stadium', emoji: '🏟️' }, { name: 'Theater', emoji: '🎭' },
                { name: 'Cinema', emoji: '🎬' }, { name: 'Gym', emoji: '🏋️' },
                { name: 'Pool', emoji: '🏊' }, { name: 'Desert', emoji: '🏜️' }
            ],
            weather: [
                { name: 'Sunny', emoji: '☀️' }, { name: 'Cloudy', emoji: '☁️' },
                { name: 'Rainy', emoji: '🌧️' }, { name: 'Snowy', emoji: '🌨️' },
                { name: 'Windy', emoji: '💨' }, { name: 'Stormy', emoji: '⛈️' },
                { name: 'Foggy', emoji: '🌫️' }, { name: 'Hot', emoji: '🥵' },
                { name: 'Cold', emoji: '🥶' }, { name: 'Rainbow', emoji: '🌈' },
                { name: 'Thunder', emoji: '⚡' }, { name: 'Lightning', emoji: '⚡' },
                { name: 'Tornado', emoji: '🌪️' }, { name: 'Hurricane', emoji: '🌀' },
                { name: 'Hail', emoji: '🧊' }, { name: 'Drizzle', emoji: '🌦️' },
                { name: 'Shower', emoji: '🚿' }, { name: 'Blizzard', emoji: '🌨️' },
                { name: 'Drought', emoji: '🏜️' }, { name: 'Flood', emoji: '🌊' },
                { name: 'Humid', emoji: '💧' }, { name: 'Dry', emoji: '🏜️' },
                { name: 'Breezy', emoji: '🍃' }, { name: 'Gusty', emoji: '💨' }
            ],
            toys: [
                { name: 'Ball', emoji: '⚽' }, { name: 'Doll', emoji: '🎎' },
                { name: 'Teddy Bear', emoji: '🧸' }, { name: 'Car', emoji: '🚗' },
                { name: 'Train', emoji: '🚂' }, { name: 'Blocks', emoji: '🧱' },
                { name: 'Puzzle', emoji: '🧩' }, { name: 'Kite', emoji: '🪁' },
                { name: 'Yo-Yo', emoji: '🪀' }, { name: 'Marbles', emoji: '🔮' },
                { name: 'Balloon', emoji: '🎈' }, { name: 'Robot', emoji: '🤖' },
                { name: 'Dinosaur', emoji: '🦖' }, { name: 'Plane', emoji: '✈️' },
                { name: 'Boat', emoji: '🚢' }, { name: 'Rocket', emoji: '🚀' },
                { name: 'Slime', emoji: '🦠' }, { name: 'Play-Doh', emoji: '🎨' },
                { name: 'Lego', emoji: '🧱' }, { name: 'Stuffed Animal', emoji: '🧸' },
                { name: 'Action Figure', emoji: '🦸' }, { name: 'Remote Control Car', emoji: '🚗' },
                { name: 'Drum', emoji: '🥁' }, { name: 'Guitar', emoji: '🎸' },
                { name: 'Piano', emoji: '🎹' }, { name: 'Trumpet', emoji: '🎺' },
                { name: 'Xylophone', emoji: '🎹' }, { name: 'Flute', emoji: '🪈' },
                { name: 'Trumpet', emoji: '🎺' }, { name: 'Violin', emoji: '🎻' }
            ],
            clothes: [
                { name: 'Shirt', emoji: '👕' }, { name: 'Pants', emoji: '👖' },
                { name: 'Dress', emoji: '👗' }, { name: 'Skirt', emoji: '👗' },
                { name: 'Jacket', emoji: '🧥' }, { name: 'Coat', emoji: '🧥' },
                { name: 'Sweater', emoji: '🧥' }, { name: 'Hat', emoji: '👒' },
                { name: 'Cap', emoji: '🧢' }, { name: 'Scarf', emoji: '🧣' },
                { name: 'Gloves', emoji: '🧤' }, { name: 'Socks', emoji: '🧦' },
                { name: 'Shoes', emoji: '👟' }, { name: 'Boots', emoji: '👢' },
                { name: 'Sandals', emoji: '👡' }, { name: 'Slippers', emoji: '🩴' },
                { name: 'Tie', emoji: '👔' }, { name: 'Belt', emoji: '👖' },
                { name: 'Pajamas', emoji: '😴' }, { name: 'Robe', emoji: '🥋' },
                { name: 'Swimsuit', emoji: '👙' }, { name: 'Shorts', emoji: '🩳' },
                { name: 'T-Shirt', emoji: '👕' }, { name: 'Blouse', emoji: '👚' },
                { name: 'Suit', emoji: '👔' }, { name: 'Uniform', emoji: '👮' },
                { name: 'Costume', emoji: '🎭' }, { name: 'Mask', emoji: '🎭' },
                { name: 'Glasses', emoji: '👓' }, { name: 'Sunglasses', emoji: '🕶️' }
            ],
            furniture: [
                { name: 'Chair', emoji: '🪑' }, { name: 'Table', emoji: '🪑' },
                { name: 'Bed', emoji: '🛏️' }, { name: 'Sofa', emoji: '🛋️' },
                { name: 'Couch', emoji: '🛋️' }, { name: 'Desk', emoji: '🪑' },
                { name: 'Bookshelf', emoji: '📚' }, { name: 'Wardrobe', emoji: '👔' },
                { name: 'Cabinet', emoji: '🗄️' }, { name: 'Drawer', emoji: '🗄️' },
                { name: 'Mirror', emoji: '🪞' }, { name: 'Lamp', emoji: '🛋️' },
                { name: 'Fan', emoji: '🌀' }, { name: 'Clock', emoji: '🕐' },
                { name: 'Rug', emoji: '🧶' }, { name: 'Curtain', emoji: '🪟' },
                { name: 'Pillow', emoji: '🛏️' }, { name: 'Blanket', emoji: '🛏️' },
                { name: 'Mattress', emoji: '🛏️' }, { name: 'Bunk Bed', emoji: '🛏️' },
                { name: 'Crib', emoji: '🛏️' }, { name: 'Dresser', emoji: '👔' },
                { name: 'Nightstand', emoji: '🛏️' }, { name: 'Coffee Table', emoji: '🪑' },
                { name: 'Dining Table', emoji: '🪑' }, { name: 'Stool', emoji: '🪑' },
                { name: 'Bench', emoji: '🪑' }, { name: 'Shelf', emoji: '📚' },
                { name: 'TV Stand', emoji: '📺' }, { name: 'Fireplace', emoji: '🔥' }
            ],
            'school-items': [
                { name: 'Book', emoji: '📖' }, { name: 'Pencil', emoji: '✏️' },
                { name: 'Pen', emoji: '🖊️' }, { name: 'Eraser', emoji: '🧼' },
                { name: 'Ruler', emoji: '📏' }, { name: 'Scissors', emoji: '✂️' },
                { name: 'Glue', emoji: '🧴' }, { name: 'Paper', emoji: '📄' },
                { name: 'Notebook', emoji: '📓' }, { name: 'Backpack', emoji: '🎒' },
                { name: 'Calculator', emoji: '🧮' }, { name: 'Marker', emoji: '🖊️' },
                { name: 'Crayon', emoji: '🖍️' }, { name: 'Paint', emoji: '🎨' },
                { name: 'Brush', emoji: '🖌️' }, { name: 'Chalk', emoji: '🖍️' },
                { name: 'Board', emoji: '⬛' }, { name: 'Globe', emoji: '🌍' },
                { name: 'Map', emoji: '🗺️' }, { name: 'Dictionary', emoji: '📖' },
                { name: 'Folder', emoji: '📁' }, { name: 'Stapler', emoji: '📎' },
                { name: 'Tape', emoji: '📼' }, { name: 'Highlighter', emoji: '🖊️' },
                { name: 'Compass', emoji: '🧭' }, { name: 'Protractor', emoji: '📐' },
                { name: 'Lunchbox', emoji: '🍱' }, { name: 'Water Bottle', emoji: '💧' },
                { name: 'Desk', emoji: '🪑' }, { name: 'Chair', emoji: '🪑' }
            ],
            flowers: [
                { name: 'Rose', emoji: '🌹' }, { name: 'Sunflower', emoji: '🌻' },
                { name: 'Tulip', emoji: '🌷' }, { name: 'Daisy', emoji: '🌼' },
                { name: 'Lily', emoji: '🪷' }, { name: 'Orchid', emoji: '🌺' },
                { name: 'Cherry Blossom', emoji: '🌸' }, { name: 'Hibiscus', emoji: '🌺' },
                { name: 'Lotus', emoji: '🪷' }, { name: 'Lavender', emoji: '🪻' },
                { name: 'Poppy', emoji: '🌺' }, { name: 'Daffodil', emoji: '🌼' },
                { name: 'Marigold', emoji: '🌼' }, { name: 'Jasmine', emoji: '🌼' },
                { name: 'Peony', emoji: '🌸' }, { name: 'Iris', emoji: '🪻' },
                { name: 'Violet', emoji: '🪻' }, { name: 'Carnation', emoji: '🌸' },
                { name: 'Chrysanthemum', emoji: '🌼' }, { name: 'Hydrangea', emoji: '🌸' },
                { name: 'Lilac', emoji: '🪻' }, { name: 'Magnolia', emoji: '🌸' },
                { name: 'Dandelion', emoji: '🌼' }, { name: 'Buttercup', emoji: '🌼' }
            ],
            trees: [
                { name: 'Oak', emoji: '🌳' }, { name: 'Pine', emoji: '🌲' },
                { name: 'Palm', emoji: '🌴' }, { name: 'Maple', emoji: '🌳' },
                { name: 'Birch', emoji: '🌳' }, { name: 'Willow', emoji: '🌳' },
                { name: 'Cherry', emoji: '🌳' }, { name: 'Apple', emoji: '🍎' },
                { name: 'Orange', emoji: '🍊' }, { name: 'Lemon', emoji: '🍋' },
                { name: 'Peach', emoji: '🍑' }, { name: 'Plum', emoji: '🍑' },
                { name: 'Mango', emoji: '🥭' }, { name: 'Banana', emoji: '🍌' },
                { name: 'Coconut', emoji: '🥥' }, { name: 'Olive', emoji: '🫒' },
                { name: 'Fir', emoji: '🌲' }, { name: 'Cedar', emoji: '🌲' },
                { name: 'Redwood', emoji: '🌲' }, { name: 'Sequoia', emoji: '🌲' },
                { name: 'Bamboo', emoji: '🎋' }, { name: 'Eucalyptus', emoji: '🌳' },
                { name: 'Baobab', emoji: '🌳' }, { name: 'Acacia', emoji: '🌳' }
            ],
            planets: [
                { name: 'Mercury', emoji: '🌑' }, { name: 'Venus', emoji: '☁️' },
                { name: 'Earth', emoji: '🌍' }, { name: 'Mars', emoji: '🔴' },
                { name: 'Jupiter', emoji: '🟠' }, { name: 'Saturn', emoji: '🪐' },
                { name: 'Uranus', emoji: '🔵' }, { name: 'Neptune', emoji: '🔵' },
                { name: 'Pluto', emoji: '🌑' }, { name: 'Sun', emoji: '☀️' },
                { name: 'Moon', emoji: '🌙' }, { name: 'Star', emoji: '⭐' },
                { name: 'Comet', emoji: '☄️' }, { name: 'Asteroid', emoji: '🌑' },
                { name: 'Meteor', emoji: '☄️' }, { name: 'Galaxy', emoji: '🌌' },
                { name: 'Nebula', emoji: '🌌' }, { name: 'Black Hole', emoji: '⚫' },
                { name: 'Satellite', emoji: '🛰️' }, { name: 'Space Station', emoji: '🛰️' }
            ],
            seasons: [
                { name: 'Spring', emoji: '🌸' }, { name: 'Summer', emoji: '☀️' },
                { name: 'Autumn', emoji: '🍂' }, { name: 'Fall', emoji: '🍂' },
                { name: 'Winter', emoji: '❄️' }, { name: 'Rainy Season', emoji: '🌧️' },
                { name: 'Dry Season', emoji: '🏜️' }, { name: 'Monsoon', emoji: '🌧️' },
                { name: 'Harvest', emoji: '🌾' }
            ]
        };
    }

    getCategoryTitle(category) {
        const titles = {
            animals: '🦁 Name 5 Animals!',
            birds: '🦅 Name 5 Birds!',
            insects: '🐛 Name 5 Insects!',
            'sea-animals': '🐠 Name 5 Sea Animals!',
            'farm-animals': '🐄 Name 5 Farm Animals!',
            fruits: '🍎 Name 5 Fruits!',
            vegetables: '🥕 Name 5 Vegetables!',
            foods: '🍔 Name 5 Foods!',
            drinks: '🥤 Name 5 Drinks!',
            colors: '🎨 Name 5 Colors!',
            shapes: '📐 Name 5 Shapes!',
            'body-parts': '🧠 Name 5 Body Parts!',
            emotions: '😊 Name 5 Emotions!',
            vehicles: '🚗 Name 5 Vehicles!',
            jobs: '👨‍⚕️ Name 5 Jobs!',
            places: '🏠 Name 5 Places!',
            weather: '🌤️ Name 5 Weather Types!',
            toys: '🧸 Name 5 Toys!',
            clothes: '👕 Name 5 Clothes!',
            furniture: '🪑 Name 5 Furniture!',
            'school-items': '✏️ Name 5 School Items!',
            flowers: '🌸 Name 5 Flowers!',
            trees: '🌳 Name 5 Trees!',
            planets: '🪐 Name 5 Planets!',
            seasons: '🌸 Name 5 Seasons!'
        };
        return titles[category] || `Name 5 ${category}!`;
    }

    generateChallenge() {
        this.usedHint = false;
        this.hintIndex = 0;
        this.userAnswers = [];
        this.correctAnswers = [];
        
        document.getElementById('feedbackArea').innerHTML = '';
        document.getElementById('hintContent').textContent = '';
        document.getElementById('resultsDisplay').style.display = 'none';
        document.getElementById('challengeDisplay').style.display = 'block';
        
        // Update title
        document.getElementById('challengeTitle').textContent = this.getCategoryTitle(this.currentCategory);
        
        // Reset progress
        this.updateProgress(0);
        
        // Generate input fields
        this.generateInputFields();
        
        // Focus first input
        setTimeout(() => {
            const firstInput = document.querySelector('.word-input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    generateInputFields() {
        const container = document.getElementById('inputArea');
        container.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            inputGroup.innerHTML = `
                <span class="input-number">${i + 1}.</span>
                <input type="text" class="word-input" id="wordInput${i}" placeholder="Type here..." autocomplete="off">
                <span class="input-status" id="status${i}"></span>
            `;
            container.appendChild(inputGroup);
            
            // Add enter key handler
            const input = inputGroup.querySelector('.word-input');
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const nextInput = document.getElementById(`wordInput${i + 1}`);
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        this.checkAnswers();
                    }
                }
            });
        }
    }

    checkAnswers() {
        const wordLists = this.getWordLists();
        const validWords = wordLists[this.currentCategory];
        const inputs = document.querySelectorAll('.word-input');
        
        let correctCount = 0;
        this.userAnswers = [];
        this.correctAnswers = [];
        
        inputs.forEach((input, index) => {
            const value = input.value.trim().toLowerCase();
            this.userAnswers.push(value);
            
            if (value) {
                // Check if answer is correct (case insensitive, partial match allowed)
                const match = validWords.find(word => 
                    word.name.toLowerCase() === value ||
                    word.name.toLowerCase().includes(value) ||
                    value.includes(word.name.toLowerCase())
                );
                
                const statusEl = document.getElementById(`status${index}`);
                
                if (match) {
                    input.classList.add('correct');
                    input.classList.remove('incorrect');
                    statusEl.textContent = match.emoji;
                    correctCount++;
                    this.correctAnswers.push(match);
                } else {
                    input.classList.add('incorrect');
                    input.classList.remove('correct');
                    statusEl.textContent = '❌';
                }
            }
        });
        
        this.updateProgress(correctCount);
        
        if (correctCount >= this.targetCount) {
            this.handleCorrectRound(correctCount);
        } else {
            this.showFeedback(`You got ${correctCount} right! Keep trying! 💪`, 'incorrect');
            this.playErrorSound();
        }
    }

    updateProgress(correctCount) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const percentage = (correctCount / this.targetCount) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${correctCount} / ${this.targetCount} correct`;
    }

    handleCorrectRound(correctCount) {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus + correctCount;
        
        this.updateStats();
        this.saveStats();
        
        this.showFeedback(`🎉 Amazing! You named ${correctCount} correctly!`, 'correct');
        this.playSuccessSound();
        
        if (this.streak % 5 === 0) {
            this.showCelebration();
        }
        
        // Show results
        setTimeout(() => {
            this.showResults(correctCount);
        }, 1500);
    }

    showResults(correctCount) {
        document.getElementById('challengeDisplay').style.display = 'none';
        const resultsDisplay = document.getElementById('resultsDisplay');
        resultsDisplay.style.display = 'block';
        
        // Update stats
        document.getElementById('resultsStats').innerHTML = `
            <div class="result-stat">✅ Correct: ${correctCount}</div>
            <div class="result-stat">⭐ Stars Earned: ${this.usedHint ? 1 + correctCount : 2 + correctCount}</div>
            <div class="result-stat">🔥 Streak: ${this.streak}</div>
        `;
        
        // Show correct answers with emojis
        const correctAnswersDiv = document.getElementById('correctAnswers');
        if (this.correctAnswers.length > 0) {
            correctAnswersDiv.innerHTML = `
                <h4>Your Correct Answers:</h4>
                <div class="answers-grid">
                    ${this.correctAnswers.map(word => `
                        <div class="answer-item">
                            <span class="answer-emoji">${word.emoji}</span>
                            <span class="answer-name">${word.name}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            correctAnswersDiv.innerHTML = '';
        }
    }

    nextChallenge() {
        this.generateChallenge();
    }

    skipChallenge() {
        this.streak = 0;
        this.updateStats();
        this.showFeedback('Skipped! Try another category! 🎯', 'incorrect');
        setTimeout(() => {
            this.generateChallenge();
        }, 1000);
    }

    showHint() {
        this.usedHint = true;
        const wordLists = this.getWordLists();
        const validWords = wordLists[this.currentCategory];
        
        // Get a word that hasn't been answered correctly yet
        const answeredWords = this.correctAnswers.map(w => w.name.toLowerCase());
        const remainingWords = validWords.filter(w => !answeredWords.includes(w.name.toLowerCase()));
        
        if (remainingWords.length > 0) {
            const hintWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
            const firstLetter = hintWord.name.charAt(0);
            const emoji = hintWord.emoji;
            
            document.getElementById('hintContent').innerHTML = `
                💡 Hint: ${emoji} Starts with letter "${firstLetter}" 
                <br><small>(${hintWord.name.length} letters)</small>
            `;
            
            this.mascotTalk();
        } else {
            document.getElementById('hintContent').textContent = '💡 You\'ve already found all the words! Great job!';
        }
    }

    mascotClick() {
        const messages = [
            'You can do it! 🌟',
            'Keep learning! 📚',
            'You\'re doing great! ⭐',
            'Learning is fun! 🎉',
            'You\'re so smart! 💡'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('hintContent').textContent = message;
        this.mascotTalk();
    }

    mascotTalk() {
        const mascot = document.getElementById('mascot');
        mascot.classList.add('talking');
        setTimeout(() => mascot.classList.remove('talking'), 500);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new VocabularyGame();
});
