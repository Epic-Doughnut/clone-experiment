const { getMaterial } = require("./getMaterial");


const lootTable = {
    husks: { probability: 0.05, quantity: 1 },
    sticks: { probability: 0.15, quantity: 100 },
    vines: { probability: 0.10, quantity: 50 },
    rocks: { probability: 0.20, quantity: 150 },
    fish: { probability: 0.10, quantity: 60 },
    wood: { probability: 0.15, quantity: 100 },
    // ... add other resources similarly ...
    silver: { probability: 0.01, quantity: 20 },
    bricks: { probability: 0.05, quantity: 80 },
    steel: { probability: 0.02, quantity: 30 },
    // ... continue for all resources ...
};

function generateLoot() {
    let loot = {};
    for (const resource in lootTable) {
        if (Math.random() < lootTable[resource].probability) {
            const quantity = Math.floor(lootTable[resource].quantity * (Math.random() * .4 + .8)); // Get loot 80% - 120%
            if (quantity > 0) loot[resource] = quantity;
        }
    }
    return loot;
}



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
        const combatResult = document.getElementById('combatResult');
        combatResult.textContent = (`${playerBalls === 0 ? 'The Enemy' : 'You'} won!`);
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
    checkForWin();
    requestAnimationFrame(update);
}

function calcRounding() {
    const playerMight = calculatePlayerMight();
    const enemyMight = calculateEnemyMight();

    const ballCount = 12;
    const playerRounding = Math.ceil(playerMight / ballCount);
    const enemyRounding = Math.ceil(enemyMight / ballCount);

    const higherRounding = Math.max(playerRounding, enemyRounding);
    const playerCount = Math.floor(playerMight / higherRounding);
    const enemyCount = Math.floor(enemyMight / higherRounding);

    const approxElement = document.getElementById('approximateBall');
    approxElement.textContent = higherRounding.toString();

    return [playerCount, enemyCount];
}

function combat() {
    // Round down the balls to 12
    let [playerCount, enemyCount] = calcRounding();

    createBalls('player', playerCount);
    createBalls('enemy', enemyCount);


    startAnimation();
}

function calculatePlayerMight() {
    let might = getMaterial('violence') + getMaterial('spear');
    if (stance === 'aggressive') might *= 1.2;
    else if (stance === 'careful') might *= 0.8;
    return might;
}
function calculateEnemyMight() {
    return 400;
}
function calculateWinChance() {

    const chanceSpread = 200; // Larger means smaller armies have higher chance to beat larger armies
    const playerMight = calculatePlayerMight();
    const enemyMight = calculateEnemyMight();
    const chance = 100 / (1 + Math.pow(10, (enemyMight - playerMight) / chanceSpread));

    const playerMightElement = document.getElementById('playerMight');
    playerMightElement.textContent = playerMight.toFixed(0);
    playerMightElement.setAttribute('tooltipdesc', `${getMaterial('violence')} violence + ${getMaterial('spear')} spears`);

    const enemyMightElement = document.getElementById('enemyMight');
    enemyMightElement.textContent = enemyMight.toFixed(0);

    const chanceElement = document.getElementById('chanceToWin');
    chanceElement.textContent = (chance).toFixed(1) + '%';

    chanceElement.style.color = (`hsl(${((chance / 100) * 120).toString(10)},100%,50%)`);

    return chance;
}

let stance = 'balanced';
const stanceButtons = document.querySelectorAll('button.stance');
function switchStance(newStance) {
    console.log('switch stance to ', newStance);
    stanceButtons.forEach(element => {
        element.disabled = false;
    });
    document.querySelector(`#${newStance}Stance`).disabled = true;
    stance = newStance;
}
window.switchStance = switchStance;


function refreshValues() {
    const battleLoot = generateLoot();
    const lootList = document.getElementById('lootList');
    lootList.innerHTML = '';
    for (const [resource, quantity] of Object.entries(battleLoot)) {
        lootList.innerHTML += `<span>${resource} (${quantity})</span> <br>`;
    }

    calcRounding();
}


// Example usage
// setupGame(5, 5); // 5 balls for each team
exports.combat = combat;
exports.calculateWinChance = calculateWinChance;
exports.refreshValues = refreshValues;