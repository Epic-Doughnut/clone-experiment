class Card {
    constructor(id, flavorText, effects, damage, heal) {
        this.id = id;
        this.flavorText = flavorText;
        this.effects = effects; // { add: [], consume: [] }
        this.damage = damage;
        this.heal = heal;
    }

    executeCard(orbs, log) {
        // Check if we can consume the necessary orbs
        for (let orb of this.effects.consume) {
            if (!orbs.includes(orb)) {
                logMessage(`Cannot execute card ${this.id}: missing ${orb} orb.`, log);
                return false; // Cannot execute this card
            }
        }

        // Consume orbs
        this.effects.consume.forEach(orb => {
            const index = orbs.indexOf(orb);
            orbs.splice(index, 1);
        });

        // Add orbs
        orbs.push(...this.effects.add);

        // Deal damage or heal
        if (this.damage > 0) {
            logMessage(`Card ${this.id} deals ${this.damage} damage.`, log);
        }
        if (this.heal > 0) {
            logMessage(`Card ${this.id} heals for ${this.heal}.`, log);
        }

        return true; // Successfully executed
    }
}

const orbs = [];
const cards = [];
const log = document.getElementById('log');

// Add your cards
cards.push(new Card(0, "Blessing of the Nile", { add: ['blue'], consume: ['red'] }, 0, 5));
cards.push(new Card(1, "Strike of Anubis", { add: ['red'], consume: [] }, 10, 0));

function logMessage(message, logElement) {
    const entry = document.createElement('div');
    entry.textContent = message;
    logElement.appendChild(entry);
}

function renderOrbs(orbs) {
    const orbRow = document.getElementById('orb-row');
    orbRow.innerHTML = ''; // Clear current orbs
    orbs.forEach(orb => {
        const orbElement = document.createElement('div');
        orbElement.classList.add('orb', orb);
        orbRow.appendChild(orbElement);
    });
}
// ... (keep previous code here)

let dragSrcEl = null; // This will store the element that is being dragged
let currentCardOrder = cards.map((card, index) => index); // Initialize with default order

function handleDragStart(e) {
    dragSrcEl = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragSrcEl.getAttribute('data-card-id'));
    e.target.classList.add('dragging');
    setTimeout(() => { // Delay hiding the element to ensure the drag effect
        e.target.style.display = 'none';
        document.querySelector('.placeholder').style.display = 'inline-block';
    }, 10);
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    const placeholder = document.querySelector('.placeholder');
    const playerCards = document.getElementById('player-cards');
    const afterElement = getDragAfterElement(playerCards, e.clientY);
    if (afterElement == null) {
        playerCards.appendChild(placeholder);
    } else {
        playerCards.insertBefore(placeholder, afterElement);
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    e.target.style.display = 'inline-block'; // Ensure the card is visible again
    document.querySelector('.placeholder').style.display = 'none';
}

let inventory = []; // Array to keep track of cards in the inventory

function handleDrop(e) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    // let cardElement = document.getElementById(cardId);

    // If dropped in the inventory
    if (e.target.id === "inventory") {
        // Remove the card from the current order and add to inventory
        let cardIndex = currentCardOrder.findIndex(index => cards[index].id === cardId);
        console.log(cardIndex);
        if (cardIndex > -1) {
            currentCardOrder.splice(cardIndex, 1);
            console.log(currentCardOrder);
        }
        inventory.push(cardId);

        // Append to the inventory div
        e.target.appendChild(cardElement);
    } else {
        const afterElement = getDragAfterElement(document.getElementById('player-cards'), e.clientY);
        const newIndex = afterElement ? Array.from(afterElement.parentNode.children).indexOf(afterElement) : currentCardOrder.length - 1;
        console.log(afterElement, newIndex);
        updateCardOrder(cardId, newIndex);
    }
    renderCards(); // Re-render the cards in their new order
}

function allowDrop(event) {
    event.preventDefault();
}

function dragCard(event) {
    event.dataTransfer.setData("text", event.target.id);
}


function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateCardOrder(cardId, newIndex) {
    const oldIndex = currentCardOrder.findIndex(index => cards[index].id === cardId);
    if (newIndex > oldIndex) {
        newIndex--; // Adjust for the removal if the card is moving forwards
    }
    const [removedCardIndex] = currentCardOrder.splice(oldIndex, 1); // Remove from old position
    currentCardOrder.splice(newIndex, 0, removedCardIndex); // Insert at new position
    renderCards(); // Re-render the cards in their new order
}

// ... (keep the rest of your event listeners and functions)


// Create placeholder once outside renderCards function
const placeholder = document.createElement('div');
placeholder.classList.add('placeholder');
placeholder.style.display = 'none'; // Initially hidden

// Update the renderCards function to include drag-and-drop attributes and events
function renderCards() {
    const playerCards = document.getElementById('player-cards');
    playerCards.innerHTML = ''; // Clear the existing cards
    currentCardOrder.forEach(cardIndex => {
        const card = cards[cardIndex];
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = card.flavorText;
        cardElement.setAttribute('data-card-id', card.id);
        cardElement.setAttribute('draggable', true);

        playerCards.appendChild(cardElement);
        // playerCards.innerHTML += `<div class="card" data-card-id="${card.id}">${card.flavorText}</div>`; // Adjust as necessary
    });
    addDragAndDropEventListeners();

    playerCards.appendChild(placeholder);
}

function addDragAndDropEventListeners() {
    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        // Add other event listeners as required
    });
}

// function renderCards(cards) {
//     const playerCards = document.getElementById('player-cards');
//     playerCards.innerHTML = '';
//     cards.forEach((card, index) => {
//         const cardElement = document.createElement('div');
//         cardElement.classList.add('card');
//         cardElement.textContent = card.flavorText;
//         cardElement.id = `card-${index}`; // Unique id for each card
//         cardElement.setAttribute('draggable', true);
//         cardElement.addEventListener('dragstart', handleDragStart);
//         cardElement.addEventListener('dragend', handleDragEnd); // Add dragend listener
//         playerCards.appendChild(cardElement);
//     });

//     // Append placeholder to playerCards
//     playerCards.appendChild(placeholder);
// }
// Add event listeners for the drag and drop actions
document.getElementById('player-cards').addEventListener('dragover', handleDragOver);
document.getElementById('player-cards').addEventListener('drop', handleDrop);


function executeTurn() {
    for (let cardIndex of currentCardOrder) {
        const card = cards[cardIndex];

        if (card.executeCard(orbs, log)) {
            break; // Stop at the first successfully executed card
        }
    }
    renderOrbs(orbs); // Update the orbs display
}

document.getElementById('next-turn').addEventListener('click', executeTurn);

// Initial rendering
renderOrbs(orbs);
renderCards();
