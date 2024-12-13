let input = this?.document.body.innerText;
`
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`

// Process into efficient format
const charMap = {};
let charMapIndex = 0;
input = input.trim().split("\n").map(row => row.split("").map(cell => 
    charMap[cell] || (charMap[cell] = ++charMapIndex)
))

let offsets = [
    // [1,1],
    [1,0],
    // [1,-1],
    [0,1],
    // [0,0],
    [0,-1],
    // [-1,1],
    [-1,0],
    // [-1,-1],
]


// Ugh for this to work I didn't realize I need to process each "X" region separately
// Let's jerryrig a solution to floodfill groups, splice, and rename.... yes I'd rather write this than fix my solution
let reformatedInput = input.map(row => Array(row.length).fill(null));
let reformattedIndex = 0;
input.forEach((row, y) => {
    row.forEach((cell, x) => {
        if (!cell) return; // we'll mark processed regions as null to not waste time

        // Floodfill search region
        let queue = [ [x, y] ]
        reformattedIndex++;
        while (queue.length > 0) {
            let batch = []
            queue.forEach(queueCell => {
                // Mark as visited, add to reformatedInput
                reformatedInput[queueCell[1]][queueCell[0]] = reformattedIndex;
                input[queueCell[1]][queueCell[0]] = null;
                
                // Scan surrounding cells for same region
                offsets.forEach(offset => {
                    const checkPos = [queueCell[0]+offset[0], queueCell[1]+offset[1]]
                    if (input[checkPos[1]]?.[checkPos[0]] == cell) {
                        batch.push(checkPos);
                        input[checkPos[1]][checkPos[0]] = null; // prevent reading this cell again
                    }
                })
            })
            queue = batch;
        }
    })
})
input = reformatedInput;


const regions = { }
input.forEach((row, y) => {
    row.forEach((cell, x) => {
        const cellPos = [x, y];

        // First, increase the "area" of this type
        regions[cell] = regions[cell] || {area: 0, perim: 0};
        regions[cell].area++;

        offsets.forEach(offset => {
            const testPos = [cellPos[0]+offset[0], cellPos[1]+offset[1]]
            const testCell = input[testPos[1]]?.[testPos[0]];

            // If the testCell is not the same type as cell, it's a perimeter
            if (cell !== testCell) {
                regions[cell].perim++;
            }
        })
    })
})

// Calculate price
let price = 0;
for (let key in regions) {
    const region = regions[key];
    price += region.area * region.perim;
}

console.log(price)
// console.log(regions)

