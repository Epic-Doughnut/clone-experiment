// const { resources } = require('./json/resources');

const resourceList = document.getElementById('resourceList');
const goldAmountEl = document.getElementById('goldAmount');
let goldAmount = 1000; // Sample starting amount
const tradeBonus = 0.9; // 10% discount

function generateTradeTable(resources) {
    Object.keys(resources).forEach(resource => {
        const row = document.createElement('tr');
        const price = Math.floor(Math.random() * 100) + 10; // Random price between 10 and 110 for this example.

        row.innerHTML = `
            <td>${resource}</td>
            <td>${price}</td>
            <td>
                <button onclick="buyResource('${resource}', ${price * tradeBonus})">Buy</button>
                <button onclick="sellResource('${resource}', ${price * tradeBonus})">Sell</button>
            </td>
        `;

        resourceList.appendChild(row);
    });

}

function buyResource(resource, price) {
    if (goldAmount >= price) {
        goldAmount -= price;
        goldAmountEl.textContent = goldAmount.toFixed(2);
        alert(`You bought ${resource} for ${price.toFixed(2)} gold!`);
    } else {
        alert("You don't have enough gold!");
    }
}

function sellResource(resource, price) {
    goldAmount += price;
    goldAmountEl.textContent = goldAmount.toFixed(2);
    alert(`You sold ${resource} for ${price.toFixed(2)} gold!`);
}

exports.generateTradeTable = generateTradeTable;