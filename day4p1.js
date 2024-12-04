let data = document.body.innerText.trim()

// Convert to 2D array for ease of access, and numbers for comparison efficiency
numMap = {
    "X": 0,
    "M": 1,
    "A": 2,
    "S": 3,
}
data = data.split("\n").map(line => line.split("").map(char => numMap[char]))

// Offseter utilities
let offsets = [ // I could generate this in 1 line in python smh
    [1,1],
    [1,0],
    [1,-1],
    [0,1],
    [0,0],
    [0,-1],
    [-1,1],
    [-1,0],
    [-1,-1],
]

function addOffset(point, offsetNum) {
    const thisOffset = offsets[offsetNum];
    if (point[0] + thisOffset[0] < 0 || 
        point[0] + thisOffset[0] >= data[0].length ||
        point[1] + thisOffset[1] < 0 ||
        point[1] + thisOffset[1] >= data.length ) {
        return false;
    }
    return [
        point[0] + thisOffset[0], 
        point[1] + thisOffset[1], 
        thisOffset // allows us to follow two points in the line they create
    ]
}

// Scan for all X locations
let xmases = 0;
data.forEach((line, lineNum) => {
    line.forEach((char, charNum) => {
        if (char !== 0) return;
        
        // For every x, save the point and check in all dirrections
        const thisPoint = [charNum, lineNum];

        // Check every dirrection we could go from here
        for (var offsetNum = 0; offsetNum < 9; offsetNum++) {
            let tempPoint = thisPoint
            for (let i = 1; i <= 3; i++) {
                const potentialCell = addOffset(tempPoint, offsetNum);
                if (potentialCell && data[potentialCell[1]][potentialCell[0]] == i) { // correct next cell
                    // Bump up the current scan index to the last cell we checked if this one was good
                    if (i == 3) { xmases++ }
                    else tempPoint = potentialCell; 
                } else {
                    i = 3; // Invalid cell, exit the scan.
                }
            }
        }
        
    })
})
