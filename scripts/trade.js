const { getMaterial } = require('./getMaterial');

const resourceList = document.getElementById('resourceList');
const goldAmountEl = document.getElementById('goldAmount');
// let goldAmount = 1000; // Sample starting amount
// const tradeBonus = 0.9; // 10% discount

function generateTradeTable(resources) {
    for (let resource in resources) {
        const row = document.createElement('tr');
        const price = Math.floor(Math.random() * 100) + 10; // Random price between 10 and 110 for this example.

        row.innerHTML = `
            <td class="tradetd">${resource}</td>
            <td class="tradetd">${price}</td>
            <td class="tradetd" style="display:flex; flex-direction:row;">
                <button class="buyBtn" data-resource="${resource}" data-price="${price}">Buy</button>
                <button class="sellBtn" data-resource="${resource}" data-price="${price}">Sell</button>
            </td>
        `;

        resourceList.appendChild(row);
    }

    // Add event listeners for the buy and sell buttons
    document.querySelectorAll('.buyBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // @ts-ignore
            const resource = e.target.getAttribute('data-resource');
            // @ts-ignore
            const price = parseFloat(e.target.getAttribute('data-price'));
            buyResource(resource, price);
        });
    });
    document.querySelectorAll('.sellBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // @ts-ignore
            const resource = e.target.getAttribute('data-resource');
            // @ts-ignore
            const price = parseFloat(e.target.getAttribute('data-price'));
            sellResource(resource, price);
        });
    });

    // Similarly, you can add event listeners for sell buttons here
}

exports.generateTradeTable = generateTradeTable;

exports.buyResource = buyResource;
exports.sellResource = sellResource;

function buyResource(resource, price) {
    let goldAmount = getMaterial('gold', require('./json/resources').resources);
    if (goldAmount >= price) {
        goldAmount -= price;
        goldAmountEl.textContent = goldAmount.toFixed(2);
        alert(`You bought ${resource} for ${price.toFixed(2)} gold!`);
    } else {
        alert("You don't have enough gold!");
    }
}

function sellResource(resource, price) {
    let goldAmount = getMaterial('gold', require('./json/resources').resources);
    goldAmount += price;
    goldAmountEl.textContent = goldAmount.toFixed(2);
    alert(`You sold ${resource} for ${price.toFixed(2)} gold!`);
}