class GeneralKnowledgeGame extends BaseGame {
    constructor() {
        super('generalKnowledge');
        this.currentActivity = 'animal-names';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateActivity();
    }

    setupEventListeners() {
        // Level 1: Subject button handlers
        document.querySelectorAll('.subject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update subject buttons
                document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Show corresponding category group
                const subject = e.target.dataset.subject;
                document.querySelectorAll('.category-group').forEach(group => {
                    group.classList.remove('active');
                });
                const activeCategoryGroup = document.querySelector(`.category-group[data-subject="${subject}"]`);
                if (activeCategoryGroup) {
                    activeCategoryGroup.classList.add('active');
                    
                    // Activate first category in the group
                    const firstCategory = activeCategoryGroup.querySelector('.category-btn');
                    if (firstCategory) {
                        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                        firstCategory.classList.add('active');
                        
                        // Show corresponding activity group
                        const category = firstCategory.dataset.category;
                        document.querySelectorAll('.activity-group').forEach(group => {
                            group.classList.remove('active');
                        });
                        const activeActivityGroup = document.querySelector(`.activity-group[data-category="${category}"]`);
                        if (activeActivityGroup) {
                            activeActivityGroup.classList.add('active');
                            
                            // Activate first activity in the group
                            const firstActivity = activeActivityGroup.querySelector('.activity-btn');
                            if (firstActivity) {
                                document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
                                firstActivity.classList.add('active');
                                this.currentActivity = firstActivity.dataset.activity;
                                this.generateActivity();
                            }
                        }
                    }
                }
            });
        });

        // Level 2: Category button handlers
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update category buttons
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Show corresponding activity group
                const category = e.target.dataset.category;
                document.querySelectorAll('.activity-group').forEach(group => {
                    group.classList.remove('active');
                });
                const activeGroup = document.querySelector(`.activity-group[data-category="${category}"]`);
                if (activeGroup) {
                    activeGroup.classList.add('active');
                    // Activate first activity in the group
                    const firstActivity = activeGroup.querySelector('.activity-btn');
                    if (firstActivity) {
                        document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
                        firstActivity.classList.add('active');
                        this.currentActivity = firstActivity.dataset.activity;
                        this.generateActivity();
                    }
                }
            });
        });

        // Level 3: Activity button handlers
        document.querySelectorAll('.activity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentActivity = e.target.dataset.activity;
                this.generateActivity();
            });
        });

        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('tutorialBtn').addEventListener('click', () => this.startTutorial());
        document.getElementById('closeTutorial').addEventListener('click', () => this.closeTutorial());
        document.getElementById('nextStep').addEventListener('click', () => this.nextTutorialStep());
        document.getElementById('prevStep').addEventListener('click', () => this.prevTutorialStep());
        document.getElementById('mascot').addEventListener('click', () => this.mascotClick());
    }

    generateActivity() {
        this.usedHint = false;
        this.hintLevel = 0;
        document.getElementById('hintContent').textContent = '';
        document.getElementById('feedbackArea').innerHTML = '';

        switch(this.currentActivity) {
            case 'animal-names':
                this.generateAnimalNamesQuiz();
                break;
            case 'bird-names':
                this.generateBirdNamesQuiz();
                break;
            case 'animal-sounds':
                this.generateAnimalSoundsQuiz();
                break;
            case 'bird-sounds':
                this.generateBirdSoundsQuiz();
                break;
            case 'habitats':
                this.generateHabitatsQuiz();
                break;
            case 'baby-names':
                this.generateBabyAnimalsQuiz();
                break;
            case 'space':
                this.generateSpaceQuiz();
                break;
            case 'body-parts':
                this.generateBodyPartsQuiz();
                break;
            case 'fruits':
                this.generateFruitsQuiz();
                break;
            case 'vegetables':
                this.generateVegetablesQuiz();
                break;
            case 'colors':
                this.generateColorsQuiz();
                break;
            case 'shapes':
                this.generateShapesQuiz();
                break;
            case 'transport':
                this.generateTransportQuiz();
                break;
            case 'professions':
                this.generateProfessionsQuiz();
                break;
            case 'weather':
                this.generateWeatherQuiz();
                break;
            case 'seasons':
                this.generateSeasonsQuiz();
                break;
            case 'days':
                this.generateDaysQuiz();
                break;
            case 'months':
                this.generateMonthsQuiz();
                break;
            case 'continents':
                this.generateContinentsQuiz();
                break;
            case 'landmarks':
                this.generateLandmarksQuiz();
                break;
        }
    }

    getAnimals() {
        return [
            { emoji: '🦁', name: 'Lion', sound: 'Roar', baby: 'Cub', habitat: 'Savanna' },
            { emoji: '🐘', name: 'Elephant', sound: 'Trumpet', baby: 'Calf', habitat: 'Jungle' },
            { emoji: '🦒', name: 'Giraffe', sound: 'Hum', baby: 'Calf', habitat: 'Savanna' },
            { emoji: '🦓', name: 'Zebra', sound: 'Bray', baby: 'Foal', habitat: 'Savanna' },
            { emoji: '🐅', name: 'Tiger', sound: 'Roar', baby: 'Cub', habitat: 'Jungle' },
            { emoji: '🐻', name: 'Bear', sound: 'Growl', baby: 'Cub', habitat: 'Forest' },
            { emoji: '🦊', name: 'Fox', sound: 'Bark', baby: 'Kit', habitat: 'Forest' },
            { emoji: '🐰', name: 'Rabbit', sound: 'Squeak', baby: 'Bunny', habitat: 'Forest' },
            { emoji: '🐼', name: 'Panda', sound: 'Bleat', baby: 'Cub', habitat: 'Bamboo Forest' },
            { emoji: '🐨', name: 'Koala', sound: 'Bark', baby: 'Joey', habitat: 'Eucalyptus Forest' },
            { emoji: '🐒', name: 'Monkey', sound: 'Chatter', baby: 'Infant', habitat: 'Jungle' },
            { emoji: '🦍', name: 'Gorilla', sound: 'Grunt', baby: 'Infant', habitat: 'Jungle' },
            { emoji: '🐺', name: 'Wolf', sound: 'Howl', baby: 'Pup', habitat: 'Forest' },
            { emoji: '🐗', name: 'Boar', sound: 'Grunt', baby: 'Piglet', habitat: 'Forest' },
            { emoji: '🐴', name: 'Horse', sound: 'Neigh', baby: 'Foal', habitat: 'Grassland' },
            { emoji: '🦄', name: 'Unicorn', sound: 'Neigh', baby: 'Foal', habitat: 'Magical Forest' },
            { emoji: '🐝', name: 'Bee', sound: 'Buzz', baby: 'Larva', habitat: 'Garden' },
            { emoji: '🐛', name: 'Caterpillar', sound: 'Silent', baby: 'Egg', habitat: 'Garden' },
            { emoji: '🦋', name: 'Butterfly', sound: 'Silent', baby: 'Caterpillar', habitat: 'Garden' },
            { emoji: '🐌', name: 'Snail', sound: 'Silent', baby: 'Egg', habitat: 'Garden' },
            { emoji: '🐞', name: 'Ladybug', sound: 'Silent', baby: 'Larva', habitat: 'Garden' },
            { emoji: '🐜', name: 'Ant', sound: 'Silent', baby: 'Larva', habitat: 'Underground' },
            { emoji: '🦗', name: 'Cricket', sound: 'Chirp', baby: 'Nymph', habitat: 'Grassland' },
            { emoji: '🕷️', name: 'Spider', sound: 'Silent', baby: 'Spiderling', habitat: 'Web' },
            { emoji: '🦂', name: 'Scorpion', sound: 'Silent', baby: 'Scorpling', habitat: 'Desert' },
            { emoji: '🦟', name: 'Mosquito', sound: 'Buzz', baby: 'Larva', habitat: 'Water' },
            { emoji: '🦀', name: 'Crab', sound: 'Click', baby: 'Zoea', habitat: 'Ocean' },
            { emoji: '🦞', name: 'Lobster', sound: 'Click', baby: 'Larva', habitat: 'Ocean' },
            { emoji: '🦐', name: 'Shrimp', sound: 'Snap', baby: 'Larva', habitat: 'Ocean' },
            { emoji: '🦑', name: 'Squid', sound: 'Silent', baby: 'Paralarva', habitat: 'Ocean' },
            { emoji: '🦎', name: 'Lizard', sound: 'Hiss', baby: 'Hatchling', habitat: 'Desert' },
            { emoji: '🐍', name: 'Snake', sound: 'Hiss', baby: 'Snakelet', habitat: 'Forest' },
            { emoji: '🐢', name: 'Turtle', sound: 'Hiss', baby: 'Hatchling', habitat: 'Ocean' },
            { emoji: '🐙', name: 'Octopus', sound: 'Silent', baby: 'Larva', habitat: 'Ocean' },
            { emoji: '🦑', name: 'Squid', sound: 'Silent', baby: 'Paralarva', habitat: 'Ocean' },
            { emoji: '🦐', name: 'Shrimp', sound: 'Snap', baby: 'Larva', habitat: 'Ocean' },
            { emoji: '🦀', name: 'Crab', sound: 'Click', baby: 'Zoea', habitat: 'Ocean' },
            { emoji: '🐡', name: 'Pufferfish', sound: 'Silent', baby: 'Larva', habitat: 'Ocean' },
            { emoji: '🐠', name: 'Fish', sound: 'Silent', baby: 'Fry', habitat: 'Ocean' },
            { emoji: '🐟', name: 'Fish', sound: 'Silent', baby: 'Fry', habitat: 'Ocean' },
            { emoji: '🐬', name: 'Dolphin', sound: 'Click', baby: 'Calf', habitat: 'Ocean' },
            { emoji: '🐳', name: 'Whale', sound: 'Song', baby: 'Calf', habitat: 'Ocean' },
            { emoji: '🦈', name: 'Shark', sound: 'Silent', baby: 'Pup', habitat: 'Ocean' },
            { emoji: '🐊', name: 'Crocodile', sound: 'Growl', baby: 'Hatchling', habitat: 'Swamp' },
            { emoji: '🐅', name: 'Tiger', sound: 'Roar', baby: 'Cub', habitat: 'Jungle' },
            { emoji: '🐆', name: 'Leopard', sound: 'Roar', baby: 'Cub', habitat: 'Jungle' },
            { emoji: '🦓', name: 'Zebra', sound: 'Bray', baby: 'Foal', habitat: 'Savanna' },
            { emoji: '🦍', name: 'Gorilla', sound: 'Grunt', baby: 'Infant', habitat: 'Jungle' },
            { emoji: '🦧', name: 'Orangutan', sound: 'Long Call', baby: 'Infant', habitat: 'Jungle' },
            { emoji: '🐘', name: 'Elephant', sound: 'Trumpet', baby: 'Calf', habitat: 'Savanna' },
            { emoji: '🦛', name: 'Hippo', sound: 'Wheeze', baby: 'Calf', habitat: 'River' },
            { emoji: '🦏', name: 'Rhino', sound: 'Snort', baby: 'Calf', habitat: 'Savanna' },
            { emoji: '🐪', name: 'Camel', sound: 'Grunt', baby: 'Calf', habitat: 'Desert' },
            { emoji: '🦙', name: 'Llama', sound: 'Hum', baby: 'Cria', habitat: 'Mountain' },
            { emoji: '🦒', name: 'Giraffe', sound: 'Hum', baby: 'Calf', habitat: 'Savanna' },
            { emoji: '🦘', name: 'Kangaroo', sound: 'Chortle', baby: 'Joey', habitat: 'Outback' },
            { emoji: '🐃', name: 'Buffalo', sound: 'Grunt', baby: 'Calf', habitat: 'Grassland' },
            { emoji: '🐂', name: 'Ox', sound: 'Moo', baby: 'Calf', habitat: 'Farm' },
            { emoji: '🐄', name: 'Cow', sound: 'Moo', baby: 'Calf', habitat: 'Farm' },
            { emoji: '🐎', name: 'Horse', sound: 'Neigh', baby: 'Foal', habitat: 'Grassland' },
            { emoji: '🐖', name: 'Pig', sound: 'Oink', baby: 'Piglet', habitat: 'Farm' },
            { emoji: '🐏', name: 'Ram', sound: 'Bleat', baby: 'Lamb', habitat: 'Mountain' },
            { emoji: '🐑', name: 'Sheep', sound: 'Baa', baby: 'Lamb', habitat: 'Farm' },
            { emoji: '🦌', name: 'Deer', sound: 'Bleat', baby: 'Fawn', habitat: 'Forest' },
            { emoji: '🐕', name: 'Dog', sound: 'Bark', baby: 'Puppy', habitat: 'Home' },
            { emoji: '🐩', name: 'Poodle', sound: 'Bark', baby: 'Puppy', habitat: 'Home' },
            { emoji: '🐈', name: 'Cat', sound: 'Meow', baby: 'Kitten', habitat: 'Home' },
            { emoji: '🐈‍⬛', name: 'Black Cat', sound: 'Meow', baby: 'Kitten', habitat: 'Home' },
            { emoji: '🐓', name: 'Rooster', sound: 'Cock-a-doodle-doo', baby: 'Chick', habitat: 'Farm' },
            { emoji: '🦃', name: 'Turkey', sound: 'Gobble', baby: 'Poult', habitat: 'Farm' },
            { emoji: '🦚', name: 'Peacock', sound: 'Scream', baby: 'Peachick', habitat: 'Forest' },
            { emoji: '🦜', name: 'Parrot', sound: 'Squawk', baby: 'Chick', habitat: 'Jungle' },
            { emoji: '🦢', name: 'Swan', sound: 'Hiss', baby: 'Cygnet', habitat: 'Lake' },
            { emoji: '🦩', name: 'Flamingo', sound: 'Honk', baby: 'Chick', habitat: 'Lake' },
            { emoji: '🕊️', name: 'Dove', sound: 'Coo', baby: 'Squab', habitat: 'Forest' },
            { emoji: '🐇', name: 'Rabbit', sound: 'Squeak', baby: 'Kit', habitat: 'Forest' },
            { emoji: '🦝', name: 'Raccoon', sound: 'Chatter', baby: 'Kit', habitat: 'Forest' },
            { emoji: '🦨', name: 'Skunk', sound: 'Hiss', baby: 'Kit', habitat: 'Forest' },
            { emoji: '🦡', name: 'Badger', sound: 'Growl', baby: 'Cub', habitat: 'Forest' },
            { emoji: '🦦', name: 'Otter', sound: 'Whistle', baby: 'Pup', habitat: 'River' },
            { emoji: '🦥', name: 'Sloth', sound: 'Bleat', baby: 'Baby', habitat: 'Jungle' },
            { emoji: '🐁', name: 'Mouse', sound: 'Squeak', baby: 'Pup', habitat: 'Field' },
            { emoji: '🐀', name: 'Rat', sound: 'Squeak', baby: 'Pup', habitat: 'Sewer' },
            { emoji: '🐿️', name: 'Squirrel', sound: 'Chatter', baby: 'Kit', habitat: 'Forest' },
            { emoji: '🦔', name: 'Hedgehog', sound: 'Snuffle', baby: 'Hoglet', habitat: 'Garden' },
        ];
    }

    getBirds() {
        return [
            { emoji: '🦅', name: 'Eagle', sound: 'Screech', baby: 'Eaglet', habitat: 'Mountains' },
            { emoji: '🦉', name: 'Owl', sound: 'Hoot', baby: 'Owlet', habitat: 'Forest' },
            { emoji: '🦜', name: 'Parrot', sound: 'Squawk', baby: 'Chick', habitat: 'Jungle' },
            { emoji: '🦚', name: 'Peacock', sound: 'Scream', baby: 'Peachick', habitat: 'Forest' },
            { emoji: '🦢', name: 'Swan', sound: 'Hiss', baby: 'Cygnet', habitat: 'Lake' },
            { emoji: '🦩', name: 'Flamingo', sound: 'Honk', baby: 'Chick', habitat: 'Lake' },
            { emoji: '🕊️', name: 'Dove', sound: 'Coo', baby: 'Squab', habitat: 'Forest' },
            { emoji: '🐦', name: 'Bird', sound: 'Tweet', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐧', name: 'Penguin', sound: 'Honk', baby: 'Chick', habitat: 'Antarctica' },
            { emoji: '🐓', name: 'Rooster', sound: 'Cock-a-doodle-doo', baby: 'Chick', habitat: 'Farm' },
            { emoji: '🦃', name: 'Turkey', sound: 'Gobble', baby: 'Poult', habitat: 'Farm' },
            { emoji: '🦆', name: 'Duck', sound: 'Quack', baby: 'Duckling', habitat: 'Pond' },
            { emoji: '🦢', name: 'Goose', sound: 'Honk', baby: 'Gosling', habitat: 'Pond' },
            { emoji: '🦉', name: 'Owl', sound: 'Hoot', baby: 'Owlet', habitat: 'Forest' },
            { emoji: '🦅', name: 'Hawk', sound: 'Screech', baby: 'Eyas', habitat: 'Mountains' },
            { emoji: '🦜', name: 'Macaw', sound: 'Squawk', baby: 'Chick', habitat: 'Jungle' },
            { emoji: '🦜', name: 'Cockatoo', sound: 'Squawk', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Sparrow', sound: 'Chirp', baby: 'Chick', habitat: 'Garden' },
            { emoji: '🐦', name: 'Robin', sound: 'Chirp', baby: 'Chick', habitat: 'Garden' },
            { emoji: '🐦', name: 'Blue Jay', sound: 'Jay', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Cardinal', sound: 'Whistle', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Woodpecker', sound: 'Drum', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Hummingbird', sound: 'Hum', baby: 'Chick', habitat: 'Garden' },
            { emoji: '🐦', name: 'Canary', sound: 'Sing', baby: 'Chick', habitat: 'Cage' },
            { emoji: '🐦', name: 'Finch', sound: 'Chirp', baby: 'Chick', habitat: 'Garden' },
            { emoji: '🐦', name: 'Wren', sound: 'Trill', baby: 'Chick', habitat: 'Garden' },
            { emoji: '🐦', name: 'Crow', sound: 'Caw', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Raven', sound: 'Caw', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Magpie', sound: 'Chatter', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Jay', sound: 'Jay', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🦅', name: 'Falcon', sound: 'Kak', baby: 'Eyas', habitat: 'Mountains' },
            { emoji: '🦅', name: 'Kite', sound: 'Whistle', baby: 'Chick', habitat: 'Mountains' },
            { emoji: '🦉', name: 'Barn Owl', sound: 'Screech', baby: 'Owlet', habitat: 'Barn' },
            { emoji: '🦉', name: 'Snowy Owl', sound: 'Hoot', baby: 'Owlet', habitat: 'Tundra' },
            { emoji: '🐦', name: 'Seagull', sound: 'Squawk', baby: 'Chick', habitat: 'Beach' },
            { emoji: '🐦', name: 'Albatross', sound: 'Groan', baby: 'Chick', habitat: 'Ocean' },
            { emoji: '🐦', name: 'Pelican', sound: 'Groan', baby: 'Chick', habitat: 'Lake' },
            { emoji: '🐦', name: 'Heron', sound: 'Squawk', baby: 'Chick', habitat: 'Wetland' },
            { emoji: '🐦', name: 'Stork', sound: 'Clatter', baby: 'Chick', habitat: 'Wetland' },
            { emoji: '🐦', name: 'Crane', sound: 'Bugle', baby: 'Chick', habitat: 'Wetland' },
            { emoji: '🐦', name: 'Flamingo', sound: 'Honk', baby: 'Chick', habitat: 'Lake' },
            { emoji: '🐦', name: 'Ostrich', sound: 'Boom', baby: 'Chick', habitat: 'Savanna' },
            { emoji: '🐦', name: 'Emu', sound: 'Drum', baby: 'Chick', habitat: 'Outback' },
            { emoji: '🐦', name: 'Kiwi', sound: 'Whistle', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Toucan', sound: 'Croak', baby: 'Chick', habitat: 'Jungle' },
            { emoji: '🐦', name: 'Kingfisher', sound: 'Chatter', baby: 'Chick', habitat: 'River' },
            { emoji: '🐦', name: 'Puffin', sound: 'Groan', baby: 'Puffling', habitat: 'Ocean' },
            { emoji: '🐦', name: 'Swallow', sound: 'Chirp', baby: 'Chick', habitat: 'Barn' },
            { emoji: '🐦', name: 'Swift', sound: 'Scream', baby: 'Chick', habitat: 'Cliff' },
            { emoji: '🐦', name: 'Nightingale', sound: 'Warble', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Lark', sound: 'Song', baby: 'Chick', habitat: 'Field' },
            { emoji: '🐦', name: 'Cuckoo', sound: 'Cuckoo', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Dove', sound: 'Coo', baby: 'Squab', habitat: 'Forest' },
            { emoji: '🐦', name: 'Pigeon', sound: 'Coo', baby: 'Squab', habitat: 'City' },
            { emoji: '🐦', name: 'Partridge', sound: 'Chirp', baby: 'Chick', habitat: 'Field' },
            { emoji: '🐦', name: 'Quail', sound: 'Whistle', baby: 'Chick', habitat: 'Field' },
            { emoji: '🐦', name: 'Pheasant', sound: 'Cackle', baby: 'Chick', habitat: 'Forest' },
            { emoji: '🐦', name: 'Turkey', sound: 'Gobble', baby: 'Poult', habitat: 'Farm' },
            { emoji: '🐦', name: 'Chicken', sound: 'Cluck', baby: 'Chick', habitat: 'Farm' },
            { emoji: '🐦', name: 'Rooster', sound: 'Crow', baby: 'Chick', habitat: 'Farm' },
        ];
    }

    getHabitats() {
        return [
            { name: 'Forest', emoji: '🌲', animals: ['Bear', 'Fox', 'Rabbit', 'Deer', 'Owl', 'Squirrel'] },
            { name: 'Jungle', emoji: '🌴', animals: ['Tiger', 'Monkey', 'Gorilla', 'Parrot', 'Toucan'] },
            { name: 'Savanna', emoji: '🌾', animals: ['Lion', 'Elephant', 'Giraffe', 'Zebra', 'Ostrich'] },
            { name: 'Ocean', emoji: '🌊', animals: ['Dolphin', 'Whale', 'Shark', 'Octopus', 'Fish'] },
            { name: 'Desert', emoji: '🏜️', animals: ['Camel', 'Scorpion', 'Lizard', 'Snake'] },
            { name: 'Mountains', emoji: '⛰️', animals: ['Eagle', 'Hawk', 'Falcon', 'Llama', 'Ram'] },
            { name: 'Farm', emoji: '🚜', animals: ['Cow', 'Pig', 'Sheep', 'Chicken', 'Horse'] },
            { name: 'Lake', emoji: '💧', animals: ['Duck', 'Swan', 'Flamingo', 'Pelican', 'Heron'] },
            { name: 'River', emoji: '🏞️', animals: ['Otter', 'Hippo', 'Kingfisher', 'Crocodile'] },
            { name: 'Garden', emoji: '🌻', animals: ['Bee', 'Butterfly', 'Ladybug', 'Hedgehog', 'Sparrow'] },
            { name: 'Antarctica', emoji: '❄️', animals: ['Penguin', 'Seal', 'Whale'] },
            { name: 'Home', emoji: '🏠', animals: ['Dog', 'Cat', 'Pigeon'] },
        ];
    }

    generateAnimalNamesQuiz() {
        const animals = this.getAnimals();
        const targetAnimal = animals[Math.floor(Math.random() * animals.length)];
        const options = [targetAnimal];
        
        while (options.length < 4) {
            const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
            if (!options.find(a => a.name === randomAnimal.name)) {
                options.push(randomAnimal);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'animal-names',
            target: targetAnimal,
            options: shuffledOptions,
            answer: targetAnimal.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🦁 What animal is this?</h2>
                <div class="quiz-emoji">${targetAnimal.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnimalNameAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    checkAnimalNameAnswer(userAnswer, btnElement) {
        if (userAnswer === this.currentProblem.answer) {
            btnElement.classList.add('correct');
            this.handleCorrectAnswer();
            setTimeout(() => this.generateActivity(), 2000);
        } else {
            btnElement.classList.add('wrong');
            this.handleIncorrectAnswer(userAnswer);
            setTimeout(() => {
                btnElement.classList.remove('wrong');
            }, 1000);
        }
    }

    generateBirdNamesQuiz() {
        const birds = this.getBirds();
        const targetBird = birds[Math.floor(Math.random() * birds.length)];
        const options = [targetBird];
        
        while (options.length < 4) {
            const randomBird = birds[Math.floor(Math.random() * birds.length)];
            if (!options.find(b => b.name === randomBird.name)) {
                options.push(randomBird);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'bird-names',
            target: targetBird,
            options: shuffledOptions,
            answer: targetBird.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🦅 What bird is this?</h2>
                <div class="quiz-emoji">${targetBird.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkBirdNameAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    checkBirdNameAnswer(userAnswer, btnElement) {
        if (userAnswer === this.currentProblem.answer) {
            btnElement.classList.add('correct');
            this.handleCorrectAnswer();
            setTimeout(() => this.generateActivity(), 2000);
        } else {
            btnElement.classList.add('wrong');
            this.handleIncorrectAnswer(userAnswer);
            setTimeout(() => {
                btnElement.classList.remove('wrong');
            }, 1000);
        }
    }

    generateAnimalSoundsQuiz() {
        const animals = this.getAnimals().filter(a => a.sound !== 'Silent');
        const targetAnimal = animals[Math.floor(Math.random() * animals.length)];
        const options = [targetAnimal];
        
        while (options.length < 4) {
            const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
            if (!options.find(a => a.name === randomAnimal.name)) {
                options.push(randomAnimal);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'animal-sounds',
            target: targetAnimal,
            options: shuffledOptions,
            answer: targetAnimal.name,
            sound: targetAnimal.sound
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🔊 Which animal makes this sound?</h2>
                <div class="sound-display">"${targetAnimal.sound}!"</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn emoji-btn';
            btn.innerHTML = `${opt.emoji} ${opt.name}`;
            btn.addEventListener('click', () => this.checkAnimalSoundAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    checkAnimalSoundAnswer(userAnswer, btnElement) {
        if (userAnswer === this.currentProblem.answer) {
            btnElement.classList.add('correct');
            this.handleCorrectAnswer();
            setTimeout(() => this.generateActivity(), 2000);
        } else {
            btnElement.classList.add('wrong');
            this.handleIncorrectAnswer(userAnswer);
            setTimeout(() => {
                btnElement.classList.remove('wrong');
            }, 1000);
        }
    }

    generateBirdSoundsQuiz() {
        const birds = this.getBirds().filter(b => b.sound !== 'Silent');
        const targetBird = birds[Math.floor(Math.random() * birds.length)];
        const options = [targetBird];
        
        while (options.length < 4) {
            const randomBird = birds[Math.floor(Math.random() * birds.length)];
            if (!options.find(b => b.name === randomBird.name)) {
                options.push(randomBird);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'bird-sounds',
            target: targetBird,
            options: shuffledOptions,
            answer: targetBird.name,
            sound: targetBird.sound
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🎵 Which bird makes this sound?</h2>
                <div class="sound-display">"${targetBird.sound}!"</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn emoji-btn';
            btn.innerHTML = `${opt.emoji} ${opt.name}`;
            btn.addEventListener('click', () => this.checkBirdSoundAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    checkBirdSoundAnswer(userAnswer, btnElement) {
        if (userAnswer === this.currentProblem.answer) {
            btnElement.classList.add('correct');
            this.handleCorrectAnswer();
            setTimeout(() => this.generateActivity(), 2000);
        } else {
            btnElement.classList.add('wrong');
            this.handleIncorrectAnswer(userAnswer);
            setTimeout(() => {
                btnElement.classList.remove('wrong');
            }, 1000);
        }
    }

    generateHabitatsQuiz() {
        const habitats = this.getHabitats();
        const targetHabitat = habitats[Math.floor(Math.random() * habitats.length)];
        const animals = this.getAnimals();
        
        const habitatAnimals = animals.filter(a => 
            targetHabitat.animals.some(ha => a.name.includes(ha) || ha.includes(a.name))
        );
        
        const targetAnimal = habitatAnimals.length > 0 
            ? habitatAnimals[Math.floor(Math.random() * habitatAnimals.length)]
            : animals[Math.floor(Math.random() * animals.length)];
        
        const wrongHabitats = habitats.filter(h => h.name !== targetHabitat.name).slice(0, 3);
        const options = [targetHabitat, ...wrongHabitats];
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'habitats',
            target: targetAnimal,
            targetHabitat: targetHabitat,
            options: shuffledOptions,
            answer: targetHabitat.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🏠 Where does the ${targetAnimal.name} live?</h2>
                <div class="quiz-emoji">${targetAnimal.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn emoji-btn';
            btn.innerHTML = `${opt.emoji} ${opt.name}`;
            btn.addEventListener('click', () => this.checkHabitatAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    checkHabitatAnswer(userAnswer, btnElement) {
        if (userAnswer === this.currentProblem.answer) {
            btnElement.classList.add('correct');
            this.handleCorrectAnswer();
            setTimeout(() => this.generateActivity(), 2000);
        } else {
            btnElement.classList.add('wrong');
            this.handleIncorrectAnswer(userAnswer);
            setTimeout(() => {
                btnElement.classList.remove('wrong');
            }, 1000);
        }
    }

    generateBabyAnimalsQuiz() {
        const animals = this.getAnimals().filter(a => a.baby && a.baby !== 'Baby' && a.baby !== 'Infant');
        const targetAnimal = animals[Math.floor(Math.random() * animals.length)];
        const options = [targetAnimal];
        
        while (options.length < 4) {
            const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
            if (!options.find(a => a.name === randomAnimal.name)) {
                options.push(randomAnimal);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'baby-names',
            target: targetAnimal,
            options: shuffledOptions,
            answer: targetAnimal.name,
            babyName: targetAnimal.baby
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">👶 Which animal has a baby called "${targetAnimal.baby}"?</h2>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn emoji-btn';
            btn.innerHTML = `${opt.emoji} ${opt.name}`;
            btn.addEventListener('click', () => this.checkBabyAnimalAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    checkBabyAnimalAnswer(userAnswer, btnElement) {
        if (userAnswer === this.currentProblem.answer) {
            btnElement.classList.add('correct');
            this.handleCorrectAnswer();
            setTimeout(() => this.generateActivity(), 2000);
        } else {
            btnElement.classList.add('wrong');
            this.handleIncorrectAnswer(userAnswer);
            setTimeout(() => {
                btnElement.classList.remove('wrong');
            }, 1000);
        }
    }

    // ==================== DATA METHODS ====================
    
    getSpaceData() {
        return [
            { emoji: '🌞', name: 'Sun', type: 'Star', fact: 'The Sun is a star at the center of our Solar System' },
            { emoji: '🌙', name: 'Moon', type: 'Natural Satellite', fact: 'The Moon is Earth\'s only natural satellite' },
            { emoji: '⭐', name: 'Star', type: 'Celestial Body', fact: 'Stars are giant balls of hot gas' },
            { emoji: '🪐', name: 'Saturn', type: 'Planet', fact: 'Saturn has beautiful rings around it' },
            { emoji: '🌍', name: 'Earth', type: 'Planet', fact: 'Earth is the only planet known to have life' },
            { emoji: '🔴', name: 'Mars', type: 'Planet', fact: 'Mars is called the Red Planet' },
            { emoji: '🌑', name: 'Mercury', type: 'Planet', fact: 'Mercury is the closest planet to the Sun' },
            { emoji: '☁️', name: 'Venus', type: 'Planet', fact: 'Venus is the hottest planet' },
            { emoji: '🟠', name: 'Jupiter', type: 'Planet', fact: 'Jupiter is the largest planet' },
            { emoji: '🔵', name: 'Uranus', type: 'Planet', fact: 'Uranus spins on its side' },
            { emoji: '🟣', name: 'Neptune', type: 'Planet', fact: 'Neptune is the windiest planet' },
            { emoji: '🚀', name: 'Rocket', type: 'Spacecraft', fact: 'Rockets help us travel to space' },
            { emoji: '🛸', name: 'UFO', type: 'Spacecraft', fact: 'UFO means Unidentified Flying Object' },
            { emoji: '🛰️', name: 'Satellite', type: 'Space Technology', fact: 'Satellites orbit Earth and help with communication' },
            { emoji: '👨‍🚀', name: 'Astronaut', type: 'Space Explorer', fact: 'Astronauts are people who travel to space' },
            { emoji: '☄️', name: 'Comet', type: 'Space Object', fact: 'Comets are made of ice and dust' },
            { emoji: '🌠', name: 'Shooting Star', type: 'Meteor', fact: 'Shooting stars are actually meteors burning up' },
            { emoji: '🌌', name: 'Galaxy', type: 'Star System', fact: 'We live in the Milky Way galaxy' },
            { emoji: '🌑', name: 'Black Hole', type: 'Space Phenomenon', fact: 'Black holes have gravity so strong nothing can escape' },
            { emoji: '👽', name: 'Alien', type: 'Space Creature', fact: 'Aliens are creatures from other planets' },
        ];
    }

    getBodyParts() {
        return [
            { emoji: '👁️', name: 'Eye', function: 'See', fact: 'We have two eyes to see the world' },
            { emoji: '👂', name: 'Ear', function: 'Hear', fact: 'Ears help us hear sounds' },
            { emoji: '👃', name: 'Nose', function: 'Smell', fact: 'The nose helps us smell and breathe' },
            { emoji: '👄', name: 'Mouth', function: 'Eat & Talk', fact: 'We use our mouth to eat and speak' },
            { emoji: '🦷', name: 'Tooth', function: 'Chew', fact: 'Teeth help us chew food' },
            { emoji: '👅', name: 'Tongue', function: 'Taste', fact: 'The tongue helps us taste food' },
            { emoji: '💪', name: 'Arm', function: 'Move', fact: 'Arms help us lift and carry things' },
            { emoji: '🦵', name: 'Leg', function: 'Walk', fact: 'Legs help us walk and run' },
            { emoji: '🦶', name: 'Foot', function: 'Stand', fact: 'Feet help us stand and walk' },
            { emoji: '🖐️', name: 'Hand', function: 'Grab', fact: 'Hands help us hold things' },
            { emoji: '🧠', name: 'Brain', function: 'Think', fact: 'The brain controls everything we do' },
            { emoji: '❤️', name: 'Heart', function: 'Pump Blood', fact: 'The heart pumps blood through our body' },
            { emoji: '🫁', name: 'Lungs', function: 'Breathe', fact: 'Lungs help us breathe air' },
            { emoji: '🦴', name: 'Bone', function: 'Support', fact: 'Bones give our body shape and support' },
            { emoji: '🩸', name: 'Blood', function: 'Transport', fact: 'Blood carries oxygen to all parts of body' },
            { emoji: '🫀', name: 'Stomach', function: 'Digest', fact: 'The stomach digests our food' },
            { emoji: '👤', name: 'Head', function: 'Think', fact: 'The head holds our brain and senses' },
            { emoji: '🦴', name: 'Skeleton', function: 'Support', fact: 'The skeleton is made of 206 bones' },
            { emoji: '🦾', name: 'Muscle', function: 'Move', fact: 'Muscles help us move our body' },
            { emoji: '🧑', name: 'Skin', function: 'Protect', fact: 'Skin is the largest organ of our body' },
        ];
    }

    getFruits() {
        return [
            { emoji: '🍎', name: 'Apple', color: 'Red', taste: 'Sweet', fact: 'An apple a day keeps the doctor away' },
            { emoji: '🍌', name: 'Banana', color: 'Yellow', taste: 'Sweet', fact: 'Bananas are rich in potassium' },
            { emoji: '🍊', name: 'Orange', color: 'Orange', taste: 'Citrus', fact: 'Oranges have lots of Vitamin C' },
            { emoji: '🍇', name: 'Grapes', color: 'Purple', taste: 'Sweet', fact: 'Grapes grow in bunches on vines' },
            { emoji: '🍓', name: 'Strawberry', color: 'Red', taste: 'Sweet', fact: 'Strawberries have seeds on the outside' },
            { emoji: '🍉', name: 'Watermelon', color: 'Green', taste: 'Sweet', fact: 'Watermelons are 92% water' },
            { emoji: '🍑', name: 'Peach', color: 'Pink', taste: 'Sweet', fact: 'Peaches have fuzzy skin' },
            { emoji: '🍒', name: 'Cherry', color: 'Red', taste: 'Sweet', fact: 'Cherries grow on trees' },
            { emoji: '🍍', name: 'Pineapple', color: 'Yellow', taste: 'Sweet', fact: 'Pineapples grow in tropical places' },
            { emoji: '🥭', name: 'Mango', color: 'Orange', taste: 'Sweet', fact: 'Mangoes are called the king of fruits' },
            { emoji: '🥝', name: 'Kiwi', color: 'Green', taste: 'Tart', fact: 'Kiwis are small and fuzzy' },
            { emoji: '🍐', name: 'Pear', color: 'Green', taste: 'Sweet', fact: 'Pears are bell-shaped fruits' },
            { emoji: '🍋', name: 'Lemon', color: 'Yellow', taste: 'Sour', fact: 'Lemons are very sour' },
            { emoji: '🍈', name: 'Melon', color: 'Green', taste: 'Sweet', fact: 'Melons grow on vines' },
            { emoji: '🫐', name: 'Blueberry', color: 'Blue', taste: 'Sweet', fact: 'Blueberries are tiny and round' },
            { emoji: '🍏', name: 'Green Apple', color: 'Green', taste: 'Tart', fact: 'Green apples are sour' },
            { emoji: '🥥', name: 'Coconut', color: 'Brown', taste: 'Sweet', fact: 'Coconuts grow on palm trees' },
        ];
    }

    getVegetables() {
        return [
            { emoji: '🥕', name: 'Carrot', color: 'Orange', taste: 'Sweet', fact: 'Carrots help you see better' },
            { emoji: '🥦', name: 'Broccoli', color: 'Green', taste: 'Mild', fact: 'Broccoli looks like tiny trees' },
            { emoji: '🥒', name: 'Cucumber', color: 'Green', taste: 'Fresh', fact: 'Cucumbers are crunchy and fresh' },
            { emoji: '🍆', name: 'Eggplant', color: 'Purple', taste: 'Savory', fact: 'Eggplants are purple vegetables' },
            { emoji: '🧅', name: 'Onion', color: 'White', taste: 'Pungent', fact: 'Onions make you cry when cut' },
            { emoji: '🧄', name: 'Garlic', color: 'White', taste: 'Strong', fact: 'Garlic has a strong smell' },
            { emoji: '🥔', name: 'Potato', color: 'Brown', taste: 'Mild', fact: 'Potatoes grow underground' },
            { emoji: '🍠', name: 'Sweet Potato', color: 'Orange', taste: 'Sweet', fact: 'Sweet potatoes are orange inside' },
            { emoji: '🥬', name: 'Lettuce', color: 'Green', taste: 'Fresh', fact: 'Lettuce is used in salads' },
            { emoji: '🌶️', name: 'Pepper', color: 'Red', taste: 'Mild', fact: 'Peppers can be sweet or spicy' },
            { emoji: '🫑', name: 'Bell Pepper', color: 'Green', taste: 'Sweet', fact: 'Bell peppers are crunchy' },
            { emoji: '🍄', name: 'Mushroom', color: 'Brown', taste: 'Earthy', fact: 'Mushrooms grow in dark places' },
            { emoji: '🌽', name: 'Corn', color: 'Yellow', taste: 'Sweet', fact: 'Corn grows on tall stalks' },
            { emoji: '🍅', name: 'Tomato', color: 'Red', taste: 'Savory', fact: 'Tomatoes are actually fruits' },
        ];
    }

    getColors() {
        return [
            { emoji: '🔴', name: 'Red', hex: '#FF0000', things: ['Apple', 'Fire truck', 'Strawberry', 'Rose'] },
            { emoji: '🔵', name: 'Blue', hex: '#0000FF', things: ['Sky', 'Ocean', 'Blueberry', 'Jeans'] },
            { emoji: '🟢', name: 'Green', hex: '#00FF00', things: ['Grass', 'Tree', 'Broccoli', 'Frog'] },
            { emoji: '🟡', name: 'Yellow', hex: '#FFFF00', things: ['Sun', 'Banana', 'Lemon', 'Duck'] },
            { emoji: '🟠', name: 'Orange', hex: '#FFA500', things: ['Orange', 'Carrot', 'Pumpkin', 'Tiger'] },
            { emoji: '🟣', name: 'Purple', hex: '#800080', things: ['Grape', 'Eggplant', 'Violet', 'Lavender'] },
            { emoji: '⚫', name: 'Black', hex: '#000000', things: ['Night', 'Coal', 'Crow', 'Piano keys'] },
            { emoji: '⚪', name: 'White', hex: '#FFFFFF', things: ['Snow', 'Cloud', 'Milk', 'Swan'] },
            { emoji: '🟤', name: 'Brown', hex: '#8B4513', things: ['Chocolate', 'Wood', 'Bear', 'Coffee'] },
            { emoji: '🩷', name: 'Pink', hex: '#FFC0CB', things: ['Pig', 'Flamingo', 'Cotton candy', 'Rose'] },
            { emoji: '🩶', name: 'Gray', hex: '#808080', things: ['Elephant', 'Cloud', 'Rock', 'Mouse'] },
            { emoji: '🩵', name: 'Light Blue', hex: '#ADD8E6', things: ['Sky', 'Ice', 'Swimming pool', 'Baby blue'] },
        ];
    }

    getShapes() {
        return [
            { emoji: '⭕', name: 'Circle', sides: 0, description: 'Round with no corners' },
            { emoji: '🔲', name: 'Square', sides: 4, description: 'Four equal sides and four corners' },
            { emoji: '🔺', name: 'Triangle', sides: 3, description: 'Three sides and three corners' },
            { emoji: '🔷', name: 'Diamond', sides: 4, description: 'Four sides like a tilted square' },
            { emoji: '⬜', name: 'Rectangle', sides: 4, description: 'Four sides with two long and two short' },
            { emoji: '⭐', name: 'Star', points: 5, description: 'Pointy shape with five points' },
            { emoji: '❤️', name: 'Heart', description: 'Shape that looks like a heart' },
            { emoji: '➡️', name: 'Arrow', description: 'Points in a direction' },
            { emoji: '➕', name: 'Cross', description: 'Two lines crossing each other' },
            { emoji: '🛑', name: 'Octagon', sides: 8, description: 'Eight sides, like a stop sign' },
            { emoji: '⬡', name: 'Hexagon', sides: 6, description: 'Six sides, like a honeycomb' },
            { emoji: '⬠', name: 'Pentagon', sides: 5, description: 'Five sides' },
            { emoji: '🔶', name: 'Rhombus', sides: 4, description: 'Four equal sides like a diamond' },
            { emoji: '🥚', name: 'Oval', description: 'Like a stretched circle' },
            { emoji: '🌙', name: 'Crescent', description: 'Shape like a curved moon' },
        ];
    }

    getTransport() {
        return [
            { emoji: '🚗', name: 'Car', type: 'Land', wheels: 4, fact: 'Cars drive on roads' },
            { emoji: '🚌', name: 'Bus', type: 'Land', wheels: 4, fact: 'Buses carry many people' },
            { emoji: '🚓', name: 'Police Car', type: 'Land', wheels: 4, fact: 'Police cars help keep us safe' },
            { emoji: '🚑', name: 'Ambulance', type: 'Land', wheels: 4, fact: 'Ambulances help sick people' },
            { emoji: '🚒', name: 'Fire Truck', type: 'Land', wheels: 4, fact: 'Fire trucks put out fires' },
            { emoji: '🚚', name: 'Truck', type: 'Land', wheels: 4, fact: 'Trucks carry heavy things' },
            { emoji: '🚜', name: 'Tractor', type: 'Land', wheels: 4, fact: 'Tractors work on farms' },
            { emoji: '🏍️', name: 'Motorcycle', type: 'Land', wheels: 2, fact: 'Motorcycles have two wheels' },
            { emoji: '🚲', name: 'Bicycle', type: 'Land', wheels: 2, fact: 'Bicycles are powered by pedaling' },
            { emoji: '🚂', name: 'Train', type: 'Land', wheels: 'Many', fact: 'Trains run on tracks' },
            { emoji: '🚁', name: 'Helicopter', type: 'Air', wings: 'Rotor', fact: 'Helicopters can hover in place' },
            { emoji: '✈️', name: 'Airplane', type: 'Air', wings: 2, fact: 'Airplanes fly in the sky' },
            { emoji: '🚀', name: 'Rocket', type: 'Space', fact: 'Rockets go to space' },
            { emoji: '🛶', name: 'Canoe', type: 'Water', fact: 'Canoes are small boats' },
            { emoji: '⛵', name: 'Sailboat', type: 'Water', fact: 'Sailboats use wind power' },
            { emoji: '🚤', name: 'Speedboat', type: 'Water', fact: 'Speedboats go fast on water' },
            { emoji: '🚢', name: 'Ship', type: 'Water', fact: 'Ships sail on oceans' },
        ];
    }

    getProfessions() {
        return [
            { emoji: '👨‍⚕️', name: 'Doctor', workplace: 'Hospital', tool: 'Stethoscope', fact: 'Doctors help sick people get better' },
            { emoji: '👩‍⚕️', name: 'Nurse', workplace: 'Hospital', tool: 'Syringe', fact: 'Nurses take care of patients' },
            { emoji: '👨‍🎓', name: 'Student', workplace: 'School', tool: 'Book', fact: 'Students learn new things' },
            { emoji: '👩‍🏫', name: 'Teacher', workplace: 'School', tool: 'Chalkboard', fact: 'Teachers help students learn' },
            { emoji: '👨‍⚖️', name: 'Judge', workplace: 'Court', tool: 'Gavel', fact: 'Judges make important decisions' },
            { emoji: '👩‍🌾', name: 'Farmer', workplace: 'Farm', tool: 'Tractor', fact: 'Farmers grow food for us' },
            { emoji: '👨‍🍳', name: 'Chef', workplace: 'Restaurant', tool: 'Pan', fact: 'Chefs cook delicious food' },
            { emoji: '👩‍🔧', name: 'Mechanic', workplace: 'Garage', tool: 'Wrench', fact: 'Mechanics fix cars and machines' },
            { emoji: '👨‍🏭', name: 'Factory Worker', workplace: 'Factory', tool: 'Tools', fact: 'Factory workers make things' },
            { emoji: '👩‍💼', name: 'Office Worker', workplace: 'Office', tool: 'Computer', fact: 'Office workers use computers' },
            { emoji: '👨‍🔬', name: 'Scientist', workplace: 'Laboratory', tool: 'Microscope', fact: 'Scientists discover new things' },
            { emoji: '👩‍💻', name: 'Programmer', workplace: 'Office', tool: 'Computer', fact: 'Programmers write computer code' },
            { emoji: '👨‍🎤', name: 'Singer', workplace: 'Stage', tool: 'Microphone', fact: 'Singers perform music' },
            { emoji: '👩‍🎨', name: 'Artist', workplace: 'Studio', tool: 'Paintbrush', fact: 'Artists create beautiful art' },
            { emoji: '👨‍✈️', name: 'Pilot', workplace: 'Airplane', tool: 'Controls', fact: 'Pilots fly airplanes' },
            { emoji: '👩‍🚀', name: 'Astronaut', workplace: 'Space', tool: 'Spacesuit', fact: 'Astronauts travel to space' },
            { emoji: '👨‍🚒', name: 'Firefighter', workplace: 'Fire Station', tool: 'Hose', fact: 'Firefighters put out fires' },
            { emoji: '👮', name: 'Police Officer', workplace: 'Police Station', tool: 'Badge', fact: 'Police keep us safe' },
            { emoji: '🕵️', name: 'Detective', workplace: 'Police Station', tool: 'Magnifying Glass', fact: 'Detectives solve mysteries' },
            { emoji: '👷', name: 'Construction Worker', workplace: 'Construction Site', tool: 'Helmet', fact: 'Construction workers build buildings' },
        ];
    }

    getWeather() {
        return [
            { emoji: '☀️', name: 'Sunny', temperature: 'Hot', description: 'Bright and warm' },
            { emoji: '🌤️', name: 'Partly Cloudy', temperature: 'Warm', description: 'Some clouds in sky' },
            { emoji: '⛅', name: 'Cloudy', temperature: 'Mild', description: 'Many clouds covering sky' },
            { emoji: '☁️', name: 'Overcast', temperature: 'Cool', description: 'Gray sky with clouds' },
            { emoji: '🌧️', name: 'Rainy', temperature: 'Cool', description: 'Rain falling from sky' },
            { emoji: '⛈️', name: 'Thunderstorm', temperature: 'Warm', description: 'Thunder and lightning' },
            { emoji: '⚡', name: 'Thunder', temperature: 'Any', description: 'Loud booming sound' },
            { emoji: '🌨️', name: 'Snowy', temperature: 'Cold', description: 'Snow falling from sky' },
            { emoji: '❄️', name: 'Snowflake', temperature: 'Freezing', description: 'Ice crystals falling' },
            { emoji: '☃️', name: 'Snowman', temperature: 'Cold', description: 'Snow shaped like person' },
            { emoji: '🌬️', name: 'Windy', temperature: 'Any', description: 'Strong wind blowing' },
            { emoji: '🌪️', name: 'Tornado', temperature: 'Warm', description: 'Spinning wind funnel' },
            { emoji: '🌫️', name: 'Foggy', temperature: 'Cool', description: 'Thick mist in air' },
            { emoji: '🌈', name: 'Rainbow', temperature: 'Any', description: 'Colors in sky after rain' },
        ];
    }

    getSeasons() {
        return [
            { emoji: '🌸', name: 'Spring', months: ['March', 'April', 'May'], weather: 'Warm', description: 'Flowers bloom' },
            { emoji: '☀️', name: 'Summer', months: ['June', 'July', 'August'], weather: 'Hot', description: 'Long sunny days' },
            { emoji: '🍂', name: 'Autumn', months: ['September', 'October', 'November'], weather: 'Cool', description: 'Leaves fall' },
            { emoji: '❄️', name: 'Winter', months: ['December', 'January', 'February'], weather: 'Cold', description: 'Snow falls' },
        ];
    }

    getDays() {
        return [
            { emoji: '🌅', name: 'Sunday', position: 1, type: 'Weekend', description: 'First day of week' },
            { emoji: '📅', name: 'Monday', position: 2, type: 'Weekday', description: 'Start of school/work week' },
            { emoji: '📅', name: 'Tuesday', position: 3, type: 'Weekday', description: 'Second day of work week' },
            { emoji: '📅', name: 'Wednesday', position: 4, type: 'Weekday', description: 'Middle of the week' },
            { emoji: '📅', name: 'Thursday', position: 5, type: 'Weekday', description: 'Almost weekend' },
            { emoji: '🎉', name: 'Friday', position: 6, type: 'Weekday', description: 'Last day of work week' },
            { emoji: '🎈', name: 'Saturday', position: 7, type: 'Weekend', description: 'Weekend fun day' },
        ];
    }

    getMonths() {
        return [
            { emoji: '❄️', name: 'January', season: 'Winter', days: 31, position: 1 },
            { emoji: '💝', name: 'February', season: 'Winter', days: 28, position: 2 },
            { emoji: '🌸', name: 'March', season: 'Spring', days: 31, position: 3 },
            { emoji: '🌧️', name: 'April', season: 'Spring', days: 30, position: 4 },
            { emoji: '🌺', name: 'May', season: 'Spring', days: 31, position: 5 },
            { emoji: '☀️', name: 'June', season: 'Summer', days: 30, position: 6 },
            { emoji: '🎆', name: 'July', season: 'Summer', days: 31, position: 7 },
            { emoji: '🏖️', name: 'August', season: 'Summer', days: 31, position: 8 },
            { emoji: '🍎', name: 'September', season: 'Autumn', days: 30, position: 9 },
            { emoji: '🎃', name: 'October', season: 'Autumn', days: 31, position: 10 },
            { emoji: '🦃', name: 'November', season: 'Autumn', days: 30, position: 11 },
            { emoji: '🎄', name: 'December', season: 'Winter', days: 31, position: 12 },
        ];
    }

    getContinents() {
        return [
            { emoji: '🌍', name: 'Africa', countries: 54, description: 'Second largest continent', famous: ['Pyramids', 'Safari'] },
            { emoji: '🌏', name: 'Asia', countries: 48, description: 'Largest continent', famous: ['Great Wall', 'Taj Mahal'] },
            { emoji: '🌍', name: 'Europe', countries: 44, description: 'Small but famous', famous: ['Eiffel Tower', 'Colosseum'] },
            { emoji: '🌎', name: 'North America', countries: 23, description: 'Third largest', famous: ['Statue of Liberty', 'Grand Canyon'] },
            { emoji: '🌎', name: 'South America', countries: 12, description: 'Fourth largest', famous: ['Machu Picchu', 'Amazon'] },
            { emoji: '🌏', name: 'Australia', countries: 1, description: 'Smallest continent', famous: ['Kangaroos', 'Opera House'] },
            { emoji: '❄️', name: 'Antarctica', countries: 0, description: 'Coldest continent', famous: ['Penguins', 'Ice'] },
        ];
    }

    getLandmarks() {
        return [
            { emoji: '🗼', name: 'Eiffel Tower', location: 'Paris, France', country: 'France', type: 'Tower' },
            { emoji: '🗽', name: 'Statue of Liberty', location: 'New York, USA', country: 'USA', type: 'Statue' },
            { emoji: '🏛️', name: 'Parthenon', location: 'Athens, Greece', country: 'Greece', type: 'Temple' },
            { emoji: '🕌', name: 'Mosque', location: 'Middle East', country: 'Various', type: 'Religious' },
            { emoji: '🛕', name: 'Hindu Temple', location: 'India', country: 'India', type: 'Religious' },
            { emoji: '🌉', name: 'Golden Gate Bridge', location: 'San Francisco', country: 'USA', type: 'Bridge' },
            { emoji: '🎠', name: 'Carousel', location: 'Parks', country: 'Various', type: 'Amusement' },
            { emoji: '🎡', name: 'Ferris Wheel', location: 'Amusement Parks', country: 'Various', type: 'Amusement' },
            { emoji: '🎢', name: 'Roller Coaster', location: 'Amusement Parks', country: 'Various', type: 'Amusement' },
            { emoji: '🚂', name: 'Train Station', location: 'Cities', country: 'Various', type: 'Transport' },
        ];
    }

    // ==================== QUIZ GENERATION METHODS ====================

    generateSpaceQuiz() {
        const spaceData = this.getSpaceData();
        const target = spaceData[Math.floor(Math.random() * spaceData.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = spaceData[Math.floor(Math.random() * spaceData.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'space',
            target: target,
            options: shuffledOptions,
            answer: target.name,
            fact: target.fact
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🚀 What is this space object?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateBodyPartsQuiz() {
        const bodyParts = this.getBodyParts();
        const target = bodyParts[Math.floor(Math.random() * bodyParts.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = bodyParts[Math.floor(Math.random() * bodyParts.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'body-parts',
            target: target,
            options: shuffledOptions,
            answer: target.name,
            fact: target.fact
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🧠 What body part is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateFruitsQuiz() {
        const fruits = this.getFruits();
        const target = fruits[Math.floor(Math.random() * fruits.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = fruits[Math.floor(Math.random() * fruits.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'fruits',
            target: target,
            options: shuffledOptions,
            answer: target.name,
            fact: target.fact
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🍎 What fruit is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateVegetablesQuiz() {
        const vegetables = this.getVegetables();
        const target = vegetables[Math.floor(Math.random() * vegetables.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = vegetables[Math.floor(Math.random() * vegetables.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'vegetables',
            target: target,
            options: shuffledOptions,
            answer: target.name,
            fact: target.fact
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🥕 What vegetable is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateColorsQuiz() {
        const colors = this.getColors();
        const target = colors[Math.floor(Math.random() * colors.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = colors[Math.floor(Math.random() * colors.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'colors',
            target: target,
            options: shuffledOptions,
            answer: target.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🎨 What color is this?</h2>
                <div class="quiz-emoji" style="background: ${target.hex}; border-radius: 50%; padding: 20px; font-size: 6rem;">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn emoji-btn';
            btn.innerHTML = `${opt.emoji} ${opt.name}`;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateShapesQuiz() {
        const shapes = this.getShapes();
        const target = shapes[Math.floor(Math.random() * shapes.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = shapes[Math.floor(Math.random() * shapes.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'shapes',
            target: target,
            options: shuffledOptions,
            answer: target.name,
            description: target.description
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">📐 What shape is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateTransportQuiz() {
        const transport = this.getTransport();
        const target = transport[Math.floor(Math.random() * transport.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = transport[Math.floor(Math.random() * transport.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'transport',
            target: target,
            options: shuffledOptions,
            answer: target.name,
            fact: target.fact
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🚗 What vehicle is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateProfessionsQuiz() {
        const professions = this.getProfessions();
        const target = professions[Math.floor(Math.random() * professions.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = professions[Math.floor(Math.random() * professions.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'professions',
            target: target,
            options: shuffledOptions,
            answer: target.name,
            fact: target.fact
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">👨‍⚕️ What job is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateWeatherQuiz() {
        const weather = this.getWeather();
        const target = weather[Math.floor(Math.random() * weather.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = weather[Math.floor(Math.random() * weather.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'weather',
            target: target,
            options: shuffledOptions,
            answer: target.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🌤️ What weather is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn emoji-btn';
            btn.innerHTML = `${opt.emoji} ${opt.name}`;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateSeasonsQuiz() {
        const seasons = this.getSeasons();
        const target = seasons[Math.floor(Math.random() * seasons.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = seasons[Math.floor(Math.random() * seasons.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'seasons',
            target: target,
            options: shuffledOptions,
            answer: target.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🌸 What season is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn emoji-btn';
            btn.innerHTML = `${opt.emoji} ${opt.name}`;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateDaysQuiz() {
        const days = this.getDays();
        const target = days[Math.floor(Math.random() * days.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = days[Math.floor(Math.random() * days.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'days',
            target: target,
            options: shuffledOptions,
            answer: target.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">📅 What day of the week is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateMonthsQuiz() {
        const months = this.getMonths();
        const target = months[Math.floor(Math.random() * months.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = months[Math.floor(Math.random() * months.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'months',
            target: target,
            options: shuffledOptions,
            answer: target.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">📆 What month is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn emoji-btn';
            btn.innerHTML = `${opt.emoji} ${opt.name}`;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateContinentsQuiz() {
        const continents = this.getContinents();
        const target = continents[Math.floor(Math.random() * continents.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = continents[Math.floor(Math.random() * continents.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'continents',
            target: target,
            options: shuffledOptions,
            answer: target.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🌍 What continent is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    generateLandmarksQuiz() {
        const landmarks = this.getLandmarks();
        const target = landmarks[Math.floor(Math.random() * landmarks.length)];
        const options = [target];
        
        while (options.length < 4) {
            const random = landmarks[Math.floor(Math.random() * landmarks.length)];
            if (!options.find(o => o.name === random.name)) {
                options.push(random);
            }
        }
        
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        
        this.currentProblem = {
            type: 'landmarks',
            target: target,
            options: shuffledOptions,
            answer: target.name
        };
        
        const display = document.getElementById('activityDisplay');
        display.innerHTML = `
            <div class="nature-quiz">
                <h2 class="quiz-title">🏛️ What landmark is this?</h2>
                <div class="quiz-emoji">${target.emoji}</div>
                <div class="quiz-options" id="quizOptions"></div>
            </div>
        `;
        
        const container = document.getElementById('quizOptions');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.name;
            btn.addEventListener('click', () => this.checkAnswer(opt.name, btn));
            container.appendChild(btn);
        });
    }

    checkAnswer(userAnswer, btnElement) {
        if (userAnswer === this.currentProblem.answer) {
            btnElement.classList.add('correct');
            this.handleCorrectAnswer();
            setTimeout(() => this.generateActivity(), 2000);
        } else {
            btnElement.classList.add('wrong');
            this.handleIncorrectAnswer(userAnswer);
            setTimeout(() => {
                btnElement.classList.remove('wrong');
            }, 1000);
        }
    }

    showHint() {
        this.hintLevel++;
        this.playTone(700, 0.15);

        const maxHints = 3;

        if (this.hintLevel > maxHints) {
            this.hintLevel = maxHints;
        }

        document.getElementById('hintCounter').textContent = `${this.hintLevel}/${maxHints}`;

        const mascot = document.getElementById('mascot');
        mascot.classList.add('talking');
        setTimeout(() => mascot.classList.remove('talking'), 500);

        let hintMessage = '';

        switch(this.currentProblem.type) {
            case 'animal-names':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Look at the emoji carefully! What animal does it look like?`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🌟 This animal starts with the letter "${this.currentProblem.answer[0]}"!`;
                } else {
                    hintMessage = `💡 It's a ${this.currentProblem.answer}!`;
                }
                break;
            case 'bird-names':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Look at the emoji carefully! What bird does it look like?`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🌟 This bird starts with the letter "${this.currentProblem.answer[0]}"!`;
                } else {
                    hintMessage = `💡 It's a ${this.currentProblem.answer}!`;
                }
                break;
            case 'animal-sounds':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Think about which animals make the sound "${this.currentProblem.sound}"!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🌟 This animal is ${this.currentProblem.target.emoji}!`;
                } else {
                    hintMessage = `💡 It's the ${this.currentProblem.answer}!`;
                }
                break;
            case 'bird-sounds':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Think about which birds make the sound "${this.currentProblem.sound}"!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🌟 This bird is ${this.currentProblem.target.emoji}!`;
                } else {
                    hintMessage = `💡 It's the ${this.currentProblem.answer}!`;
                }
                break;
            case 'habitats':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 Think about where ${this.currentProblem.target.name}s like to live!`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🌟 This habitat has ${this.currentProblem.targetHabitat.emoji}!`;
                } else {
                    hintMessage = `💡 The ${this.currentProblem.target.name} lives in the ${this.currentProblem.answer}!`;
                }
                break;
            case 'baby-names':
                if (this.hintLevel === 1) {
                    hintMessage = `👀 A "${this.currentProblem.babyName}" is a baby animal. Which one?`;
                } else if (this.hintLevel === 2) {
                    hintMessage = `🌟 This animal is ${this.currentProblem.target.emoji}!`;
                } else {
                    hintMessage = `💡 The ${this.currentProblem.answer} has a baby called ${this.currentProblem.babyName}!`;
                }
                break;
        }

        document.getElementById('hintContent').innerHTML = hintMessage;
        document.getElementById('hintContent').style.animation = 'none';
        setTimeout(() => {
            document.getElementById('hintContent').style.animation = 'fadeIn 0.5s ease-out';
        }, 10);

        if (this.hintLevel === 1) {
            this.stars += 1;
            this.updateStats();
            this.saveStats();
        }

        this.showFeedback(this.getRandomEncouragement(), 'correct');
    }

    mascotClick() {
        const mascot = document.getElementById('mascot');
        const messages = [
            '🦊 Hi there! Ready to explore nature?',
            '🦊 Animals are amazing! 🦁',
            '🦊 You\'re doing great! 🌟',
            '🦊 Birds are so beautiful! 🦅',
            '🦊 Keep learning! 📚',
            '🦊 Click me anytime! 🎉',
            '🦊 Nature is wonderful! 🌲',
            '🦊 You\'re a nature expert! 🏆'
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

    startTutorial() {
        this.tutorialStep = 0;
        this.tutorialSteps = this.createTutorialSteps();
        this.renderTutorialSteps();
        document.getElementById('tutorialOverlay').classList.add('active');
        this.updateTutorialUI();
        this.playTone(600, 0.2);
    }

    closeTutorial() {
        document.getElementById('tutorialOverlay').classList.remove('active');
        this.playTone(400, 0.2);
    }

    createTutorialSteps() {
        const problem = this.currentProblem;
        
        switch(problem.type) {
            case 'animal-names':
                return [
                    {
                        title: '📊 Step 1: Look at the Emoji',
                        explanation: `Study the emoji: ${problem.target.emoji}`,
                        highlight: 'emoji'
                    },
                    {
                        title: '🧮 Step 2: Think About the Animal',
                        explanation: `What animal looks like ${problem.target.emoji}?`,
                        highlight: 'think'
                    },
                    {
                        title: '🎯 Step 3: Choose the Name',
                        explanation: `Click on "${problem.answer}"!`,
                        highlight: 'answer'
                    }
                ];
            case 'bird-names':
                return [
                    {
                        title: '📊 Step 1: Look at the Emoji',
                        explanation: `Study the emoji: ${problem.target.emoji}`,
                        highlight: 'emoji'
                    },
                    {
                        title: '🧮 Step 2: Think About the Bird',
                        explanation: `What bird looks like ${problem.target.emoji}?`,
                        highlight: 'think'
                    },
                    {
                        title: '🎯 Step 3: Choose the Name',
                        explanation: `Click on "${problem.answer}"!`,
                        highlight: 'answer'
                    }
                ];
            case 'animal-sounds':
                return [
                    {
                        title: '📊 Step 1: Listen to the Sound',
                        explanation: `The sound is: "${problem.sound}!"`,
                        highlight: 'sound'
                    },
                    {
                        title: '🧮 Step 2: Match Sound to Animal',
                        explanation: `Which animal says "${problem.sound}"?`,
                        highlight: 'match'
                    },
                    {
                        title: '🎯 Step 3: Choose the Animal',
                        explanation: `Click on "${problem.answer}"!`,
                        highlight: 'answer'
                    }
                ];
            case 'bird-sounds':
                return [
                    {
                        title: '📊 Step 1: Listen to the Sound',
                        explanation: `The sound is: "${problem.sound}!"`,
                        highlight: 'sound'
                    },
                    {
                        title: '🧮 Step 2: Match Sound to Bird',
                        explanation: `Which bird says "${problem.sound}"?`,
                        highlight: 'match'
                    },
                    {
                        title: '🎯 Step 3: Choose the Bird',
                        explanation: `Click on "${problem.answer}"!`,
                        highlight: 'answer'
                    }
                ];
            case 'habitats':
                return [
                    {
                        title: '📊 Step 1: Look at the Animal',
                        explanation: `The animal is: ${problem.target.emoji} ${problem.target.name}`,
                        highlight: 'animal'
                    },
                    {
                        title: '🧮 Step 2: Think About Home',
                        explanation: `Where do ${problem.target.name}s live?`,
                        highlight: 'home'
                    },
                    {
                        title: '🎯 Step 3: Choose the Habitat',
                        explanation: `Click on "${problem.answer}"!`,
                        highlight: 'answer'
                    }
                ];
            case 'baby-names':
                return [
                    {
                        title: '📊 Step 1: Read the Baby Name',
                        explanation: `The baby is called: "${problem.babyName}"`,
                        highlight: 'baby'
                    },
                    {
                        title: '🧮 Step 2: Match Baby to Parent',
                        explanation: `Which animal has a baby called ${problem.babyName}?`,
                        highlight: 'match'
                    },
                    {
                        title: '🎯 Step 3: Choose the Animal',
                        explanation: `Click on "${problem.answer}"!`,
                        highlight: 'answer'
                    }
                ];
            default:
                return [
                    {
                        title: '📊 Step 1: Understand',
                        explanation: 'Look at the problem carefully!',
                        highlight: 'understand'
                    },
                    {
                        title: '🧮 Step 2: Solve',
                        explanation: 'Think about the answer!',
                        highlight: 'solve'
                    },
                    {
                        title: '🎯 Step 3: Answer',
                        explanation: 'Great job!',
                        highlight: 'answer'
                    }
                ];
        }
    }

    renderTutorialSteps() {
        const container = document.getElementById('tutorialSteps');
        container.innerHTML = '';

        this.tutorialSteps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = `tutorial-step ${index === 0 ? 'active' : ''}`;
            stepDiv.id = `step-${index}`;

            stepDiv.innerHTML = `
                <div class="tutorial-step-title">${step.title}</div>
                <div class="tutorial-visual">
                    ${this.createTutorialVisual(step, index)}
                </div>
                <div class="tutorial-explanation">${step.explanation}</div>
            `;

            container.appendChild(stepDiv);
        });
    }

    createTutorialVisual(step, stepIndex) {
        const problem = this.currentProblem;
        
        switch(problem.type) {
            case 'animal-names':
            case 'bird-names':
                return `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 20px; align-items: center;">
                        <div style="font-size: 6rem; animation: bounce 1s infinite;">${problem.target.emoji}</div>
                        <div style="font-size: 1.5rem; color: #6c5ce7; background: #f8f9fa; padding: 15px 30px; border-radius: 15px;">
                            ${stepIndex === 2 ? problem.answer : '?'}
                        </div>
                    </div>
                `;
            case 'animal-sounds':
            case 'bird-sounds':
                return `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 20px; align-items: center;">
                        <div style="font-size: 4rem; animation: pulse 1s infinite;">🔊</div>
                        <div style="font-size: 1.5rem; color: #fd79a8; background: #f8f9fa; padding: 15px 30px; border-radius: 15px; font-weight: bold;">
                            "${problem.sound}!"
                        </div>
                        <div style="font-size: 3rem;">${stepIndex === 2 ? problem.target.emoji : '❓'}</div>
                    </div>
                `;
            case 'habitats':
                return `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 20px; align-items: center;">
                        <div style="font-size: 4rem;">${problem.target.emoji}</div>
                        <div style="font-size: 1.5rem; color: #74b9ff;">${problem.target.name}</div>
                        <div style="font-size: 3rem;">${stepIndex === 2 ? problem.targetHabitat.emoji : '🏠'}</div>
                        <div style="font-size: 1.2rem; color: #6c5ce7; background: #f8f9fa; padding: 10px 20px; border-radius: 10px;">
                            ${stepIndex === 2 ? problem.answer : 'Where do I live?'}
                        </div>
                    </div>
                `;
            case 'baby-names':
                return `
                    <div class="tutorial-problem" style="flex-direction: column; gap: 20px; align-items: center;">
                        <div style="font-size: 1.5rem; color: #fd79a8; font-weight: bold;">Baby: ${problem.babyName}</div>
                        <div style="font-size: 4rem;">${stepIndex === 2 ? problem.target.emoji : '👶'}</div>
                        <div style="font-size: 1.2rem; color: #6c5ce7; background: #f8f9fa; padding: 10px 20px; border-radius: 10px;">
                            ${stepIndex === 2 ? problem.answer : 'Who is my parent?'}
                        </div>
                    </div>
                `;
            default:
                return `
                    <div class="tutorial-problem" style="flex-direction: row; justify-content: center; gap: 20px;">
                        <span style="font-size: 3rem;">🦋</span>
                    </div>
                `;
        }
    }

    nextTutorialStep() {
        if (this.tutorialStep < this.tutorialSteps.length - 1) {
            this.tutorialStep++;
            this.updateTutorialUI();
            this.playTone(600, 0.1);
        }
    }

    prevTutorialStep() {
        if (this.tutorialStep > 0) {
            this.tutorialStep--;
            this.updateTutorialUI();
            this.playTone(500, 0.1);
        }
    }

    updateTutorialUI() {
        document.querySelectorAll('.tutorial-step').forEach((step, index) => {
            step.classList.toggle('active', index === this.tutorialStep);
        });

        document.getElementById('stepIndicator').textContent =
            `Step ${this.tutorialStep + 1} of ${this.tutorialSteps.length}`;

        document.getElementById('prevStep').disabled = this.tutorialStep === 0;
        document.getElementById('nextStep').disabled = this.tutorialStep === this.tutorialSteps.length - 1;
    }

    handleCorrectAnswer() {
        this.streak++;
        const bonus = this.usedHint ? 1 : 2;
        this.stars += bonus;

        this.updateStats();
        this.saveStats();
        this.showFeedback(`Great job! ${this.getCelebrationEmoji()}`, 'correct');
        this.playSuccessSound();

        if (this.streak % 5 === 0) {
            this.showCelebration();
        }
    }

    handleIncorrectAnswer(userAnswer) {
        this.streak = 0;
        this.updateStats();
        this.saveStats();

        let message = `Oops! Try again! 💪`;

        if (this.currentProblem.type === 'animal-names' || this.currentProblem.type === 'bird-names') {
            message = `Oops! That's a ${userAnswer}. The answer is ${this.currentProblem.answer}!`;
        } else if (this.currentProblem.type === 'animal-sounds' || this.currentProblem.type === 'bird-sounds') {
            message = `Oops! The ${userAnswer} doesn't say "${this.currentProblem.sound}". It's the ${this.currentProblem.answer}!`;
        } else if (this.currentProblem.type === 'habitats') {
            message = `Oops! The ${this.currentProblem.target.name} doesn't live in the ${userAnswer}. It lives in the ${this.currentProblem.answer}!`;
        } else if (this.currentProblem.type === 'baby-names') {
            message = `Oops! The ${userAnswer} doesn't have a baby called ${this.currentProblem.babyName}. It's the ${this.currentProblem.answer}!`;
        } else if (this.currentProblem.type === 'space') {
            message = `Oops! That's not ${userAnswer}. It's ${this.currentProblem.answer}! ${this.currentProblem.fact}`;
        } else if (this.currentProblem.type === 'body-parts') {
            message = `Oops! That's not ${userAnswer}. It's your ${this.currentProblem.answer}! ${this.currentProblem.fact}`;
        } else if (this.currentProblem.type === 'fruits') {
            message = `Oops! That's not ${userAnswer}. It's a ${this.currentProblem.answer}! ${this.currentProblem.fact}`;
        } else if (this.currentProblem.type === 'vegetables') {
            message = `Oops! That's not ${userAnswer}. It's a ${this.currentProblem.answer}! ${this.currentProblem.fact}`;
        } else if (this.currentProblem.type === 'colors') {
            message = `Oops! That's not ${userAnswer}. It's ${this.currentProblem.answer}!`;
        } else if (this.currentProblem.type === 'shapes') {
            message = `Oops! That's not ${userAnswer}. It's a ${this.currentProblem.answer}! ${this.currentProblem.description}`;
        } else if (this.currentProblem.type === 'transport') {
            message = `Oops! That's not ${userAnswer}. It's a ${this.currentProblem.answer}! ${this.currentProblem.fact}`;
        } else if (this.currentProblem.type === 'professions') {
            message = `Oops! That's not ${userAnswer}. It's a ${this.currentProblem.answer}! ${this.currentProblem.fact}`;
        } else if (this.currentProblem.type === 'weather') {
            message = `Oops! That's not ${userAnswer}. It's ${this.currentProblem.answer}! ${this.currentProblem.target.description}`;
        } else if (this.currentProblem.type === 'seasons') {
            message = `Oops! That's not ${userAnswer}. It's ${this.currentProblem.answer}! ${this.currentProblem.target.description}`;
        } else if (this.currentProblem.type === 'days') {
            message = `Oops! That's not ${userAnswer}. It's ${this.currentProblem.answer}! ${this.currentProblem.target.description}`;
        } else if (this.currentProblem.type === 'months') {
            message = `Oops! That's not ${userAnswer}. It's ${this.currentProblem.answer}! This month has ${this.currentProblem.target.days} days.`;
        } else if (this.currentProblem.type === 'continents') {
            message = `Oops! That's not ${userAnswer}. It's ${this.currentProblem.answer}! Famous for: ${this.currentProblem.target.famous.join(', ')}`;
        } else if (this.currentProblem.type === 'landmarks') {
            message = `Oops! That's not ${userAnswer}. It's the ${this.currentProblem.answer} in ${this.currentProblem.target.location}!`;
        }

        this.showFeedback(message, 'incorrect');
        this.playErrorSound();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GeneralKnowledgeGame();
});
