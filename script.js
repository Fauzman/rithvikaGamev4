const player = document.getElementById('player');
const mainWorld = document.getElementById('main-world');
const miniGameScreen = document.getElementById('mini-game-screen');
const miniGameBanner = document.getElementById('mini-game-banner');
const exitButton = document.getElementById('exit-button');
const miniGameAreas = document.querySelectorAll('.mini-game-area');
const archeryGame = document.getElementById('archery-game');
const runningGame = document.getElementById('running-game');
const swimmingGame = document.getElementById('swimming-game');
const obstacleGame = document.getElementById('obstacle-game');
const memoryGame = document.getElementById('memory-game');
const shootingGame = document.getElementById('shooting-game');

let playerX = 0;
let playerY = 0;
let currentGame = null;
let score = 0;

// Player Movement
document.addEventListener('keydown', (event) => {
    const speed = 10;
    switch (event.key) {
        case 'ArrowUp':
            playerY -= speed;
            break;
        case 'ArrowDown':
            playerY += speed;
            break;
        case 'ArrowLeft':
            playerX -= speed;
            break;
        case 'ArrowRight':
            playerX += speed;
            break;
    }
    player.style.top = `${playerY}px`;
    player.style.left = `${playerX}px`;

    // Check if player enters a mini-game area
    if (currentGame === null) {
        miniGameAreas.forEach(area => {
            const rect = area.getBoundingClientRect();
            if (
                playerX >= rect.left &&
                playerX <= rect.right &&
                playerY >= rect.top &&
                playerY <= rect.bottom
            ) {
                startMiniGame(area.dataset.game);
            }
        });
    }
});

// Start Mini-Game
function startMiniGame(game) {
    currentGame = game;
    mainWorld.style.display = 'none';
    miniGameScreen.style.display = 'block';
    miniGameBanner.textContent = `${game.charAt(0).toUpperCase() + game.slice(1)} Game`;
    miniGameBanner.style.display = 'block';
    exitButton.style.display = 'block';

    // Hide all mini-games
    document.querySelectorAll('.mini-game').forEach(game => game.style.display = 'none');

    // Show the selected mini-game
    document.getElementById(`${game}-game`).style.display = 'block';

    // Initialize the mini-game
    if (game === 'archery') {
        startArchery();
    } else if (game === 'running') {
        startRunning();
    } else if (game === 'swimming') {
        startSwimming();
    } else if (game === 'obstacle') {
        startObstacle();
    } else if (game === 'memory') {
        startMemory();
    } else if (game === 'shooting') {
        startShooting();
    }
}

// Exit Mini-Game
exitButton.addEventListener('click', () => {
    mainWorld.style.display = 'block';
    miniGameScreen.style.display = 'none';
    currentGame = null;
    score = 0; // Reset score
});

// Archery Game
function startArchery() {
    for (let i = 0; i < 5; i++) {
        const target = document.createElement('div');
        target.className = 'target';
        target.style.top = `${Math.random() * 80}vh`;
        target.style.left = `${Math.random() * 80}vw`;
        archeryGame.appendChild(target);

        // Move target horizontally
        let direction = Math.random() > 0.5 ? 1 : -1;
        setInterval(() => {
            const left = parseFloat(target.style.left);
            if (left <= 0 || left >= window.innerWidth - 30) {
                direction *= -1;
            }
            target.style.left = `${left + direction * 2}px`;
        }, 20);

        // Click to remove target
        target.addEventListener('click', () => {
            target.remove();
            score++;
            if (score >= 5) {
                alert('You won the Archery Game!');
                exitButton.click();
            }
        });
    }
}

// Running Race
function startRunning() {
    const finishLine = document.createElement('div');
    finishLine.style.position = 'absolute';
    finishLine.style.width = '100%';
    finishLine.style.height = '10px';
    finishLine.style.backgroundColor = 'green';
    finishLine.style.bottom = '0';
    runningGame.appendChild(finishLine);

    // Check if player reaches the finish line
    const checkWin = setInterval(() => {
        if (playerY + 50 >= window.innerHeight - 10) {
            alert('You won the Running Race!');
            clearInterval(checkWin);
            exitButton.click();
        }
    }, 100);
}

// Swimming
function startSwimming() {
    const coins = document.querySelectorAll('.coin');
    coins.forEach(coin => {
        coin.addEventListener('click', () => {
            coin.remove();
            score++;
            if (score >= 2) {
                alert('You won the Swimming Game!');
                exitButton.click();
            }
        });
    });

    // Move waves
    const wave = document.querySelector('.wave');
    let waveDirection = 1;
    setInterval(() => {
        const left = parseFloat(wave.style.left || 0);
        if (left <= -100 || left >= 0) {
            waveDirection *= -1;
        }
        wave.style.left = `${left + waveDirection * 2}px`;
    }, 20);
}

// Obstacle Course
function startObstacle() {
    const obstacles = document.querySelectorAll('.obstacle');
    const checkCollision = setInterval(() => {
        obstacles.forEach(obstacle => {
            const rect = obstacle.getBoundingClientRect();
            if (
                playerX + 50 >= rect.left &&
                playerX <= rect.right &&
                playerY + 50 >= rect.top &&
                playerY <= rect.bottom
            ) {
                alert('You hit an obstacle! Game over.');
                clearInterval(checkCollision);
                exitButton.click();
            }
        });

        // Check if player reaches the end
        if (playerX + 50 >= window.innerWidth - 100 && playerY + 50 >= window.innerHeight - 100) {
            alert('You won the Obstacle Course!');
            clearInterval(checkCollision);
            exitButton.click();
        }
    }, 100);
}

// Memory Game
function startMemory() {
    const cards = document.querySelectorAll('.memory-card');
    let flippedCards = [];
    let matchedPairs = 0;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                card.classList.add('flipped');
                card.style.backgroundColor = 'white';
                card.textContent = card.dataset.value;
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    const [card1, card2] = flippedCards;
                    if (card1.dataset.value === card2.dataset.value) {
                        matchedPairs++;
                        if (matchedPairs === 2) {
                            alert('You won the Memory Game!');
                            exitButton.click();
                        }
                    } else {
                        setTimeout(() => {
                            card1.classList.remove('flipped');
                            card2.classList.remove('flipped');
                            card1.style.backgroundColor = 'purple';
                            card2.style.backgroundColor = 'purple';
                            card1.textContent = '';
                            card2.textContent = '';
                        }, 1000);
                    }
                    flippedCards = [];
                }
            }
        });
    });
}

// Shooting Gallery
function startShooting() {
    for (let i = 0; i < 5; i++) {
        const target = document.createElement('div');
        target.className = 'shooting-target';
        target.style.top = `${Math.random() * 80}vh`;
        target.style.left = `${Math.random() * 80}vw`;
        shootingGame.appendChild(target);

        // Move target vertically
        let direction = Math.random() > 0.5 ? 1 : -1;
        setInterval(() => {
            const top = parseFloat(target.style.top);
            if (top <= 0 || top >= window.innerHeight - 30) {
                direction *= -1;
            }
            target.style.top = `${top + direction * 2}px`;
        }, 20);

        // Click to shoot target
        target.addEventListener('click', () => {
            target.remove();
            score++;
            if (score >= 5) {
                alert('You won the Shooting Gallery!');
                exitButton.click();
            }
        });
    }
}
