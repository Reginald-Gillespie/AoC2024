// Improvements I made to my original code I used to get the answer.

const isProduction = this?.document?.body.innerHTML; 
let input = isProduction ? document.body.innerHTML :
`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`


const start = Date.now();

// Numbers for efficiency again
let key = {
    "." : 0,
    "#" : 1,
    "X" : 3,
    "O" : 4,
    "^" : 9,
    // ">" : 8,
    // "<" : 7,
    // "v" : 6,
}


function visualizeMap(input, ob, guardPos) {
    const keysKeys = Object.keys(key);
    const reverseKey = {}
    keysKeys.forEach(k => reverseKey[key[k]] = k);

    const localInput = JSON.parse(JSON.stringify(input))

    // Insert obstructions
    if (ob) localInput[ob[1]][ob[0]] = 4

    // Insert guard
    if (guardPos) localInput[guardPos[1]][guardPos[0]] = 9
    
    const visualized = localInput.map(line => line.map(
        cell => typeof(cell) == "object" ? "X" : reverseKey[cell]
    ).join("") ).join("\n");

    console.log(visualized)
    return visualized;
}

function getCoord(arr, target) {
    for (let y = 0; y < arr.length; y++) {
        const x = arr[y].indexOf(target);
        if (x !== -1) return [ x, y ];
    }
    return null;
}

function incrementDirection(currentDirection) {
    let dir = currentDirection[0] + "" + currentDirection[1];
    switch (dir) {
        case "01":
            return [-1, 0]
        case "10":
            return [0, 1]
        case "0-1":
            return [1, 0]
        case "-10":
            return [0, -1]
    }
}

input = input.trim().split("\n").map(p => p.split("").map(c => key[c]))
// input = JSON.parse(JSON.stringify(input)) // reconstruct data to mark it as PACKED_SMI_ELEMENTS in JIT and enable some optimizations

const guardStartLocation = getCoord(input, 9);

let obstructionPositions = [];

function runGuard(obstructionPos=false) {
    // Reset variables for this upcoming run
    let stepNum = 0;
    let guardLocation = guardStartLocation;
    let direction = [0, -1]
    let runInput = JSON.parse(JSON.stringify(input));

    // Now, assume we placed an object on xPos,yPos
    if (obstructionPos) runInput[obstructionPos[1]][obstructionPos[0]] = key["#"]

    let createsLoop = false;

    while (true) {
        // if (!isProduction) console.log(`Step: ${stepNum++}/${maxSteps}`)

        const nextPossibleLocation = [guardLocation[0]+direction[0], guardLocation[1]+direction[1]]
        let nextPossibleCell = runInput?.[nextPossibleLocation[1]]?.[nextPossibleLocation[0]]

        // Exit loop when the guard exits
        if (nextPossibleCell === undefined || nextPossibleCell === null) 
            break;

        // Check if we've hit a loop on the square we're on rn
        const thisSquare = runInput?.[guardLocation[1]]?.[guardLocation[0]];
        if (typeof(thisSquare) == "object") {
            // Check if we've been on this cell going this direction before
            for (var i = 0; i < thisSquare.length; i++) {
                const thisDirection = thisSquare[i];
                if (thisDirection[0] == direction[0] && thisDirection[1] == direction[1]) {
                    // We've been this exact direction on this exact square before, therefore it is a loop
                    createsLoop = true;
                    break
                }
            }
        }
        
        // Easier type-checking of cell
        if (typeof(nextPossibleCell) == "object") {
            // Mark as just generally visited without metadata for easier checking
            nextPossibleCell = key["X"];
        }

        if (createsLoop) 
            break; // I forget the scope of my breaks

        switch (nextPossibleCell) {
            case key["."]:
            case key["X"]:
                // Mark as visited
                if (typeof(runInput[guardLocation[1]][guardLocation[0]]) !== "object") runInput[guardLocation[1]][guardLocation[0]] = []
                runInput[guardLocation[1]][guardLocation[0]].push(direction);

                // Mark and move up guard pos
                guardLocation = nextPossibleLocation;
                break

            case key["#"]:
                // Can't move, rotate
                direction = incrementDirection(direction)
                break
        }
    }

    runInput[guardLocation[1]][guardLocation[0]] = [] // mark this as position guard has been at

    return [createsLoop, runInput]
}

// Stats
const maxSteps = isProduction ? 5705 : 54;
let loopCount = 0;

// First, we'll collect all the squares it travels on as possible obstructions
const [_, normalPath] = runGuard();
let possibleObstructions = [];
normalPath.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
        if (typeof(cell) == "object") possibleObstructions.push([cellIndex, rowIndex]);
    })
})

// Loop through all places that could redirrect the guard
for (let i = 0; i < possibleObstructions.length; i++) {
    if (!isProduction) console.log(`Run: ${i}/${possibleObstructions.length}`)
    
    const obstruction = possibleObstructions[i];

    const createsLoop = runGuard(obstruction)[0];

    if (createsLoop) {
        loopCount++;
    }
}

const end = Date.now();
console.log(`Took ${(end-start)/1000} seconds`)
console.log(`Num loops: ${loopCount}`)

console.log(obstructionPositions)
