let data = document.body.innerText.trim()

// Convert to 2D array for ease of access, and numbers for comparison efficiency
numMap = {
    "X": 0,
    "M": 1,
    "A": 2,
    "S": 3,
}
data = data.split("\n").map(line => line.split("").map(char => numMap[char]))

function arrayEquals(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) return false;
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) return false;
        }
    }
    return true;
}

// Scan for all X locations
let xmases = 0;
data.forEach((line, lineNum) => {
    line.forEach((char, charNum) => {
        if (char !== 2) return;
        // For every A char,

        // Diagonals
        const diagonals = [
            [ [1,1],
              [-1,-1] ],
            [ [1,-1],
              [-1,1] ]
        ].map(
            diagonal => diagonal.map(
                point => data[ lineNum+point[1] ]?.[ charNum+point[0] ]
            ).sort())

        if (arrayEquals(diagonals, [
            [1, 3],
            [1, 3]
        ])) xmases++;
    })
})

