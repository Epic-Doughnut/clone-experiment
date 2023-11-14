// script.js
function createBalls(team, count) {
    const arena = document.getElementById('arena');
    for (let i = 0; i < count; i++) {
        const ball = document.createElement('div');
        ball.className = `ball ${team}`;
        ball.style.left = `${team === 'player' ? 10 : 270}px`; // Starting positions
        ball.style.top = `${10 + i * 30}px`;
        arena.appendChild(ball);
        if (team === 'player') playerTroops.push(ball);
        else enemyTroops.push(ball);
    }
}
let playerTroops = [];
let enemyTroops = [];
function startAnimation() {
    const balls = document.querySelectorAll('.ball');
    balls.forEach(ball => {
        const isplayerTeam = ball.classList.contains('player');
        const targetX = isplayerTeam ? 280 : -280; // Target positions
        console.log(ball, targetX);
        ball.animate([
            { transform: `translateX(${targetX}px)` }
        ], {
            duration: 2000,
            fill: 'forwards'
        }).finished.then(() => {
            ball.remove(); // Remove ball after reaching target
        });
    });
    update();
}

function checkForWin() {
    const playerBalls = document.querySelectorAll('.player').length;
    const enemyBalls = document.querySelectorAll('.enemy').length;
    if (playerBalls === 0 || enemyBalls === 0) {
        alert(`${playerBalls === 0 ? 'enemy' : 'player'} team wins!`);
    }
}
function detectCollisions(player, enemy) {
    for (let i = 0; i < player.length; i++) {
        for (let j = 0; j < enemy.length; j++) {
            if (isColliding(playerTroops[i], enemyTroops[j])) {
                // Handle the collision
                handleCollision(playerTroops[i], enemyTroops[j]);
            }
        }
    }
}

function isColliding(ball1, ball2) {
    const rect1 = ball1.getBoundingClientRect();
    const rect2 = ball2.getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function handleCollision(ball1, ball2) {
    // Example: Remove balls on collision
    ball1.remove();
    ball2.remove();
}

// Call this function continuously, e.g., using requestAnimationFrame
function update() {
    const balls = document.querySelectorAll('.ball');
    detectCollisions(playerTroops, enemyTroops);
    requestAnimationFrame(update);
}

function setupGame(playerCount, enemyCount) {
    createBalls('player', playerCount);
    createBalls('enemy', enemyCount);
    startAnimation();
}

// Example usage
// setupGame(5, 5); // 5 balls for each team
exports.setupGame = setupGame;