const watch = document.getElementById('watch');
const player = document.getElementById('player');
const screen = document.getElementById('screen');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');

let score = 0;
let time = 340;
let gameStarted = false;
const playerSize = 20;  // This is the collision size, smaller than the image

const avoidItems = [
    "Create a new movie",
    "Film an AVGN ep",
    "Edit a video",
    "Write a script",
	"Address a controversy",
	"Play an NES Game",
    "Respond to fans",
    "Meet deadlines",
    "Acknowledge mistakes",
    "Learn new skills"
];

const collectItems = [
    "Perform Rex Viper show",
    "Watch muh kids",
    "Tape stuff to ceiling",
    "Plagiarize a script",
	"Duck walk",
	"Hawk a VPN service",
    "Forget about Bootsy",
    "Complain about no time",
    "Mispronounce words",
    "Reminisce about past"
];


const gameOverMessages = [
    "Game Over! Take a wild guess why!",
    "Game Over! Muh kids need watching!",
    "Game Over! Do you want Bimmy to suffer?",
    "Game Over! This reminds me of 9/11!",
    "Game Over! The dragon in your dreams woke up!",
    "Game Over! The slobs are waiting!",
    "Game Over! Bpril is waiting for you!",
	"Game Over! It's 5:40!",
    "Game Over! No time to explain!",
    "Game Over! The onion's too big!",
    "Game Over! You ran out of sponsors!",
    "Game Over! Rex Viper needs you on stage!",
    "Game Over! This mowden is too high!",
    "Game Over! Your autobiography needs another chapter!",
    "Game Over! The podcast ran out of topics!",
    "Game Over! Your teleprompter malfunctioned!",
    "Game Over! The VPN couldn't hide your location!",
    "Game Over! You ran out of ways to say 'ass'!",
    "Game Over! The gengar escaped!",
    "Game Over! Your AVGN shirt shrunk in the wash!"
];

function showStartScreen() {
    screen.innerHTML = `
        <div id="start-screen">
            <h1>NO TIME</h1>
            <p>Use "W" and "S" to move</p>
            <p>Click or press any key to start</p>
        </div>
    `;
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        screen.innerHTML = '';
        screen.appendChild(player);
        screen.appendChild(scoreElement);
        screen.appendChild(timeElement);
        gameLoop();
    }
}

function movePlayer(direction) {
    if (!gameStarted) return;
    
    const currentBottom = parseInt(player.style.bottom || '13');
    const step = 15;
    const maxHeight = screen.offsetHeight - player.offsetHeight;
    
    if (direction === 'up' && currentBottom < maxHeight) {
        player.style.bottom = `${Math.min(currentBottom + step, maxHeight)}px`;
    }
    if (direction === 'down' && currentBottom > 0) {
        player.style.bottom = `${Math.max(currentBottom - step, 0)}px`;
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameStarted) {
        startGame();
    } else {
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') movePlayer('up');
        if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') movePlayer('down');
    }
});

watch.addEventListener('click', startGame);

upButton.addEventListener('click', () => movePlayer('up'));
downButton.addEventListener('click', () => movePlayer('down'));

function createItem() {
    if (!gameStarted) return;

    const item = document.createElement('div');
    item.className = 'item';
    item.style.bottom = `${Math.floor(Math.random() * (screen.offsetHeight - 20))}px`;
    
    const isAvoidItem = Math.random() < 0.6;  // 60% chance of avoid item
    const itemText = isAvoidItem ? 
        avoidItems[Math.floor(Math.random() * avoidItems.length)] :
        collectItems[Math.floor(Math.random() * collectItems.length)];
    
    item.textContent = itemText;
    item.isAvoidItem = isAvoidItem;
    screen.appendChild(item);

    const moveInterval = setInterval(() => {
        const currentRight = parseInt(item.style.right || '0');
        item.style.right = `${currentRight + 3}px`;
        if (currentRight > screen.offsetWidth) {
            clearInterval(moveInterval);
            screen.removeChild(item);
        }

        if (checkCollision(player, item)) {
            clearInterval(moveInterval);
            screen.removeChild(item);
            if (item.isAvoidItem) {
                gameOver();
            } else {
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
            }
        }
    }, 50);
}

function checkCollision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    
    // Adjust player rectangle for collision
    const adjustedARect = {
        top: aRect.top + (aRect.height - playerSize) / 2,
        left: aRect.left + (aRect.width - playerSize) / 2,
        right: aRect.left + (aRect.width + playerSize) / 2,
        bottom: aRect.top + (aRect.height + playerSize) / 2,
        width: playerSize,
        height: playerSize
    };

    return !(
        adjustedARect.bottom < bRect.top ||
        adjustedARect.top > bRect.bottom ||
        adjustedARect.right < bRect.left ||
        adjustedARect.left > bRect.right
    );
}

function gameOver() {
    gameStarted = false;
    const randomMessage = gameOverMessages[Math.floor(Math.random() * gameOverMessages.length)];
    alert(randomMessage);
    resetGame();
}

function resetGame() {
    score = 0;
    time = 340;
    scoreElement.textContent = 'Score: 0';
    timeElement.textContent = 'Time: 5:40';
    player.style.bottom = '13px';
    showStartScreen();
}

function gameLoop() {
    const itemInterval = setInterval(createItem, 2000);
    const timeInterval = setInterval(() => {
        if (!gameStarted) {
            clearInterval(itemInterval);
            clearInterval(timeInterval);
            return;
        }
        time--;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timeElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (time <= 0) {
            gameOver();
        }
    }, 1000);
}

showStartScreen();