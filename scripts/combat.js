const { getMaterial } = require("./getMaterial");
const { increaseMaterial } = require("./resources");


const lootTable = {
    husks: { probability: 0.05, quantity: 1 },

    nails: { probability: 0.10, quantity: 50 },
    slabs: { probability: 0.20, quantity: 50 },
    beams: { probability: 0.10, quantity: 60 },

    axe: { probability: 0.15, quantity: 5 },
    spear: { probability: 1, quantity: 5 },

    gold: { probability: .1, quantity: 10 },
    iron: { probability: 0.15, quantity: 50 },
    silver: { probability: 0.05, quantity: 20 },
    steel: { probability: 0.10, quantity: 30 },

    bricks: { probability: 0.15, quantity: 80 },

};

let currLoot = {};

function getCurrLoot() {
    return currLoot;
}

function generateLoot() {
    let loot = {};
    for (const resource in lootTable) {
        if (Math.random() < lootTable[resource].probability) {
            const quantity = Math.floor(lootTable[resource].quantity * (Math.random() * .4 + .8)); // Get loot 80% - 120%
            if (quantity > 0) loot[resource] = quantity;
        }
    }
    currLoot = loot;
    console.log(currLoot);
    return loot;
}



// script.js
const arena = document.getElementById('arena');
function createBalls(team, count) {
    for (let i = 0; i < count; i++) {
        const ball = document.createElement('div');
        ball.className = `ball ${team}`;
        ball.style.left = `${team === 'player' ? 10 : 90}%`; // Starting positions
        ball.style.top = `${10 + i * 30}px`;
        arena.appendChild(ball);
        if (team === 'player') playerTroops.push(ball);
        else enemyTroops.push(ball);
    }
}
let playerTroops = [];
let enemyTroops = [];
let animations = [];
function startAnimation() {

    const balls = document.querySelectorAll('.ball');
    const animTime = 3000;
    balls.forEach(ball => {
        const isplayerTeam = ball.classList.contains('player');
        const targetX = isplayerTeam ? arena.offsetWidth : -arena.offsetWidth; // Target positions
        // console.log(ball, targetX);
        animations.push(ball.animate([
            { transform: `translateX(${targetX}px)` }
        ], {
            duration: animTime,
            fill: 'none'
        }).finished.then(() => {
            ball.remove();
        }));
    });
    update();

    setTimeout(() => {
        const playerBalls = document.querySelectorAll('.player').length;
        const enemyBalls = document.querySelectorAll('.enemy').length;

        if (playerBalls === 0 || enemyBalls === 0) {
            return;
        }

        for (const ball of document.querySelectorAll('.ball')) {
            ball.remove();
        }
        // Need to battle again
        createBalls('player', playerBalls);
        createBalls('enemy', enemyBalls);
        startAnimation();

    }, animTime - 100); // Need to execute before the balls are deleted
}

let hasRewarded = false;
function checkForWin() {
    if (hasRewarded) return;
    const playerBalls = document.querySelectorAll('.player').length;
    const enemyBalls = document.querySelectorAll('.enemy').length;
    if (playerBalls === 0 || enemyBalls === 0) {
        const combatResult = document.getElementById('combatResult');
        combatResult.textContent = (`${playerBalls === 0 ? 'The Enemy' : 'You'} won!`);
        // @ts-ignore
        fightButton.disabled = false;

        // Reward the player their loot
        if (playerBalls > 0) {
            hasRewarded = true;
            let stanceMult = 1;
            if (getStance() === 'aggressive') stanceMult = .75;
            if (getStance() === 'careful') stanceMult = 1.25;

            for (const [lootName, value] of Object.entries(currLoot)) {
                increaseMaterial(lootName, value * stanceMult);
                combatResult.innerHTML += `<br>+${value * stanceMult} ${lootName}`;
            }
            generateLoot();
            refreshValues();
        }
        return true;
    }
    return false;

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

function handleCollision(playerBall, enemyBall) {
    if (Math.random() < .5) enemyBall.remove();
    else playerBall.remove();

}

// Call this function continuously, e.g., using requestAnimationFrame
function update() {
    detectCollisions(playerTroops, enemyTroops);
    if (!checkForWin() && !hasRewarded) requestAnimationFrame(update);
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

const fightButton = document.querySelector('button#startCombat');
/**
 * Main combat function, start everything
 */
function combat() {
    // Remove all balls
    for (const ball of document.querySelectorAll('.ball')) {
        ball.remove();
    }

    // for (const [i, animation] of Object.entries(animations)) {
    //     animation.pause();
    // }
    // Round down the balls to 12
    let [playerCount, enemyCount] = calcRounding();

    createBalls('player', playerCount);
    createBalls('enemy', enemyCount);

    const combatResult = document.getElementById('combatResult');
    combatResult.textContent = '';

    // @ts-ignore
    fightButton.disabled = true;
    hasRewarded = false;
    startAnimation();
}

function calculatePlayerMight() {
    let might = getMaterial('violence') + getMaterial('spear');
    if (getStance() === 'aggressive') might *= 1.2;
    else if (getStance() === 'careful') might *= 0.8;
    return might;
}
function calculateEnemyMight() {
    return 400;
}
function calculateWinChance() {

    const chanceSpread = 200; // Larger means smaller armies have higher chance to beat larger armies
    const playerMight = calculatePlayerMight();
    const enemyMight = calculateEnemyMight();
    const chance = 1 / (1 + Math.pow(10, (enemyMight - playerMight) / chanceSpread));

    const playerMightElement = document.getElementById('playerMight');
    playerMightElement.textContent = playerMight.toFixed(0);
    playerMightElement.setAttribute('tooltipdesc', `${getMaterial('violence').toFixed(0)} violence + ${getMaterial('spear').toFixed(0)} spears`);

    const enemyMightElement = document.getElementById('enemyMight');
    enemyMightElement.textContent = enemyMight.toFixed(0);

    const chanceElement = document.getElementById('chanceToWin');
    chanceElement.textContent = (chance * 100).toFixed(1) + '%';

    chanceElement.style.color = (`hsl(${(chance * 120).toString(10)},100%,50%)`);

    return chance;
}

let stance = 'balanced';

function getStance() {
    return stance;
}

function setStance(newStance) {
    stance = newStance;
}

const stanceButtons = document.querySelectorAll('button.stance');
function switchStance(newStance) {
    console.log('switch stance to ', newStance);
    stanceButtons.forEach(element => {
        // @ts-ignore
        element.disabled = false;
    });
    // @ts-ignore
    document.querySelector(`#${newStance}Stance`).disabled = true;
    setStance(newStance);
}
exports.switchStance = switchStance;
// @ts-ignore
window.switchStance = switchStance;


function refreshValues() {
    console.log(getCurrLoot());
    if (Object.keys(getCurrLoot()).length < 1) generateLoot();

    const lootList = document.getElementById('lootList');
    lootList.innerHTML = '';
    for (const [resource, quantity] of Object.entries(getCurrLoot())) {
        lootList.innerHTML += `<span>${resource} (${quantity})</span> <br>`;
    }

    calcRounding();
}


// Example usage
// setupGame(5, 5); // 5 balls for each team
exports.combat = combat;
exports.calculateWinChance = calculateWinChance;
exports.refreshValues = refreshValues;