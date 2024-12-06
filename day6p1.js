let input = document.body.innerText;

// Numbers for efficiency again
let key = {
    "." : 0,
    "#" : 1,
    "X" : 3,
    "^" : 9,
}

function visualizeMap(input) {
    const keysKeys = Object.keys(key);
    const reverseKey = {}
    keysKeys.forEach(k => reverseKey[key[k]] = k);

    const visualized = input.map(line => line.map(cell => reverseKey[cell]).join("") ).join("\n");
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
input = JSON.parse(JSON.stringify(input)) // reconstruct data to mark it as PACKED_SMI_ELEMENTS in JIT and enable some optimizations

let direction = [0, -1]
let guardLocation = getCoord(input, 9);


// Now, we're good to just do a simple process loop. Make it simple.
while (true) {
    const nextPossibleLocation = [guardLocation[0]+direction[0], guardLocation[1]+direction[1]]
    const nextPossibleCell = input?.[nextPossibleLocation[1]]?.[nextPossibleLocation[0]]

    // Exit loop when the guard exits
    visualizeMap(input)
    if (nextPossibleCell === undefined) break;

    switch (nextPossibleCell) {
        case key["."]:
        case key["X"]:
            // Mark as visited
            input[guardLocation[1]][guardLocation[0]] = key["X"]; 

            // Mark and move up guard pos
            input[nextPossibleLocation[1]][nextPossibleLocation[0]] = key["^"];
            guardLocation = nextPossibleLocation;
            break

        case key["#"]:
            // Can't move, rotate
            direction = incrementDirection(direction)
            break
    }
}

// Now count X's
console.log(input.flat().reduce(
    (p, c) => c == key["X"] || c == key["^"] ? p + 1 : p)
)

