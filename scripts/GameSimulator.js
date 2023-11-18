class GameSimulator {
    constructor() {
        this.gameState = {
            resources: {
                clones: 0,
                sticks: 0,
                vines: 0,
                rocks: 0,
                fish: 0,
                wood: 0,
                ponder: 0,
                ore: 0,
                sand: 0,
                wheat: 0,
                freshwater: 0,
                hides: 0,
                clay: 0,
                herbs: 0,
                game: 0,
                husks: 0,
                violence: 0,
                sharprocks: 0,
                rope: 0,
                handle: 0,
                staff: 0,
                fishingrod: 0,
                spear: 0,
                axe: 0,
                pickaxe: 0,
                glass: 0,
                paper: 0,
                gold: 0,
                iron: 0,
                silver: 0,
                bricks: 0,
                bread: 0,
                steel: 0,
                beams: 0,
                crates: 0,
                nails: 0,
                slabs: 0,
                medicine: 0,
                leather: 0,
                concrete: 0,
            },
            maxes: {
                "clones": 0,
                "sticks": 50,
                "vines": 50,
                "rocks": 30,
                "fish": 10,
                "wood": 40,
                "ponder": 20,
                "ore": 20,
                "sand": 20,
                "wheat": 20,
                'freshwater': 50,
                'hides': 50,
                'clay': 50,
                'herbs': 50,
                'game': 50,
                'husks': 1000,
                'violence': 100
            },

            buildings: {
                animal_pen: 0,
                bakery: 0,
                barn: 0,
                barracks: 0,
                campfire: 0,
                desk: 0,
                drying_racks: 0,
                fish_traps: 0,
                fishery: 0,
                forge: 0,
                garden: 0,
                grove: 0,
                herbalist_hut: 0,
                hospital: 0,
                house: 0,
                hut: 0,
                irrigation: 0,
                library: 0,
                lumber_yard: 0,
                marketplace: 0,
                military_school: 0,
                mine: 0,
                observatory: 0,
                reservoir: 0,
                rock_role: 0,
                sand_scoop: 0,
                shed: 0,
                shelter: 0,
                stockpile: 0,
                stone_depot: 0,
                stone_quarry: 0,
                tannery: 0,
                teepee: 0,
                telescope: 0,
                tower: 0,
                traps: 0,
                vineyard: 0,
                warehouse: 0,
                water_pump: 0,
                windmill: 0,
                workshop: 0,
            },
            time: 0
        };
        this.log = [];
    }

    buildingsConst = require('./json/buildings').buildings;
    buyBuilding(buildingName) {
        // Similar logic to the original buyBuilding,
        // but works on this.gameState instead of the global game state
        // Calculate costs
        let cost = {};
        for (const [key, value] of Object.entries(this.buildingsConst[buildingName].basecost)) {
            cost[key] = value * Math.pow(this.buildingsConst[buildingName].ratio, this.gameState.buildings[buildingName]);
        }
        // console.log(cost);
        // Check if enough resources are available
        let canBuy = true;
        for (let c in cost) {
            if (this.gameState.resources[c] < cost[c]) {
                canBuy = false;
                return;
            }
        }

        // Buy building if enough resources are available
        if (canBuy) {
            for (let c in cost) {
                this.gameState.resources[c] -= cost[c];
            }
            this.gameState.buildings[buildingName] += 1;

            if (this.storage.includes(buildingName)) {
                // Increase the max storage
                for (const [r, val] of Object.entries(this.buildingsConst[buildingName].effects)) {
                    this.gameState.maxes[r] += val;
                }
            }
        }
    }

    simulateTick() {
        // Simulate a single tick of the game
        this.performActions();
        this.updateResources();
        this.gameState.time += 1; // Increment time
        this.logGameState();
    }

    housing = ['hut', 'shelter', 'house', 'barracks', 'hospital', 'teepee'];
    storage = ['shed', 'stockpile', 'workshop', 'warehouse', 'drying_racks', 'water_pump', 'military_school', 'barn', 'herbalist_hut', 'mine', 'bakery', 'animal_pen', 'reservoir', 'stone_depot'];
    buildingPriority = [...this.housing, ...this.storage];
    performActions() {
        // Define player actions here, e.g., buy buildings, craft resources
        for (let b of Object.values(this.buildingPriority)) {
            try { this.buyBuilding(b); }
            catch (error) { console.error('Failed to buy', b, error); }
        }
        // ... other actions ...
    }

    resourcesToGather = ['sticks'];
    updateResources() {
        // Update resources based on buildings, actions, etc.
        // Example:

        for (let [i, key] of Object.entries(this.resourcesToGather)) {
            let gathering = 0;
            if (key === 'sticks' || key === 'vines' || key === 'wood' || key === 'rocks' || key === 'fish' || key === 'ore') gathering = 1;
            this.gameState.resources[key] += (gathering + .25 * this.gameState.resources.clones) / this.resourcesToGather.length;

            if (Object.keys(this.gameState.maxes).includes(key) && this.gameState.resources[key] > this.gameState.maxes[key]) {
                this.gameState.resources[key] = this.gameState.maxes[key];
                if (key === 'vines' && Math.random() > 0.5) {
                    // Craft vines into rope
                    this.gameState.resources['rope'] += this.gameState.resources.vines / 3;
                    this.gameState.resources.vines = 0;
                }
                if (key === 'wood' && Math.random() > 0.5) {
                    // craft wood into paper
                    this.gameState.resources['paper'] += this.gameState.resources.wood / 12;
                    this.gameState.resources.wood = 0;
                }
                if (key === 'ore' && Math.random() > 0.5) {
                    // craft ore into iron or gold
                    if (Math.random() > 0.5) {
                        this.gameState.resources['iron'] += this.gameState.resources.ore / 20;
                        this.gameState.resources.ore = 0;
                    }
                    else {
                        this.gameState.resources['gold'] += this.gameState.resources.ore / 100;
                        this.gameState.resources.ore = 0;
                    }
                }
                if (key === 'sand' && Math.random() > 0.5) {
                    // craft sand into paper
                    this.gameState.resources['paper'] += this.gameState.resources.sand / 10;
                    this.gameState.resources.sand = 0;
                }
                if (key === 'clay' && Math.random() > 0.5) {
                    // craft clay into bricks
                    this.gameState.resources['bricks'] += this.gameState.resources.clay / 15;
                    this.gameState.resources.clay = 0;
                }
            }
        }

        if (this.gameState.resources.sticks >= 10 && !this.resourcesToGather.includes('vines')) {
            this.resourcesToGather.push('vines'); // Push 'vines' only if it's not already in the array
            console.warn(this.resourcesToGather);
        }
        if (this.gameState.resources.vines >= 10 && !this.resourcesToGather.includes('rocks')) {
            this.resourcesToGather.push('rocks'); // Push 'vines' only if it's not already in the array
            console.warn(this.resourcesToGather);
        }
        if (this.gameState.resources.rocks >= 10 && !this.resourcesToGather.includes('fish')) {
            this.resourcesToGather.push('fish'); // Push 'vines' only if it's not already in the array
            console.warn(this.resourcesToGather);
        }
        if (this.gameState.resources.fish >= 10 && !this.resourcesToGather.includes('wood')) {
            this.resourcesToGather.push('wood'); // Push 'vines' only if it's not already in the array
            console.warn(this.resourcesToGather);
        }
        if (this.gameState.resources.wood >= 10 && !this.resourcesToGather.includes('ore')) {
            this.resourcesToGather.push('ore'); // Push 'vines' only if it's not already in the array
            console.warn(this.resourcesToGather);
        }

        if (this.gameState.resources.clones >= 1 && !this.resourcesToGather.includes('ponder')) {
            this.resourcesToGather.push('ponder'); // Push 'vines' only if it's not already in the array
            console.warn(this.resourcesToGather);
        }
        if (this.gameState.resources.clones >= 3 && !this.resourcesToGather.includes('sand')) {
            this.resourcesToGather.push('sand'); // Push 'vines' only if it's not already in the array
            console.warn(this.resourcesToGather);
        }
        if (this.gameState.resources.clones >= 4 && !this.resourcesToGather.includes('clay')) {
            this.resourcesToGather.push('clay'); // Push 'vines' only if it's not already in the array
            console.warn(this.resourcesToGather);
        }
        // this.gameState.resources.sticks += (1 + .25 * this.gameState.resources.clones) / this.resourcesToGather.length;
        // this.gameState.resources.vines += (1 + .25 * this.gameState.resources.clones) / this.resourcesToGather.length;
        // this.gameState.resources.sand += (.25 * this.gameState.resources.clones) / this.resourcesToGather.length;
        // this.gameState.resources.clay += (.25 * this.gameState.resources.clones) / this.resourcesToGather.length;
        // this.gameState.resources.rocks += (1 + .25 * this.gameState.resources.clones) / this.resourcesToGather.length;
        this.gameState.resources.clones = this.gameState.buildings.shelter +
            this.gameState.buildings.hut +
            this.gameState.buildings.house * 2 +
            this.gameState.buildings.hospital * 3 +
            this.gameState.buildings.teepee * 2 +
            this.gameState.buildings.barracks;
        // ... other resource updates ...
    }

    logGameState() {
        // Log a deep copy of the current state for later analysis
        const stateCopy = JSON.parse(JSON.stringify(this.gameState));
        this.log.push({ time: this.gameState.time, ...stateCopy });
    }

    runSimulation(duration) {
        for (let i = 0; i < duration; i++) {
            this.simulateTick();
        }
        this.outputResults();
    }

    outputResults() {
        // Output the results in a format suitable for visualization
        // Example: console logging, for more advanced use cases, consider generating CSV or JSON files
        // console.table(this.log);
        function convertToCSV(data) {
            // Create a header row with keys from buildings and resources
            const buildingsKeys = Object.keys(data[0].buildings);
            const resourcesKeys = Object.keys(data[0].resources);
            const maxesKeys = Object.keys(data[0].maxes);
            const otherKeys = Object.keys(data[0]).filter(key => key !== 'buildings' && key !== 'resources');
            const header = [...otherKeys, ...buildingsKeys, ...resourcesKeys];

            const csv = [header.join(',')];

            data.forEach((row) => {
                const values = header.map((key) => {
                    // Check if the key is in buildings or resources and handle accordingly
                    if (row.buildings && row.buildings.hasOwnProperty(key)) {
                        return row.buildings[key];
                    } else if (row.resources && row.resources.hasOwnProperty(key)) {
                        return row.resources[key];
                    } else {
                        return row[key];
                    }
                });
                csv.push(values.join(','));
            });

            return csv.join('\n');
        }

        const csvData = convertToCSV(this.log);

        // Step 3: Create a data URI for the CSV string
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        // Step 4: Create a downloadable link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        link.textContent = 'Download CSV';

        // Append the link to the document
        document.body.appendChild(link);
        console.table(this.log);
    }
}

exports.GameSimulator = GameSimulator;
// window.runSimulation = simulator.runSimulation;
