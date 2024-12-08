const input = this?.document?.body.innerText || 
`
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`


// Process input
const antennas = {}
input.trim().split("\n").forEach((col, ci) => {
    col.split("").forEach((cell, ri) => {
        if (cell !== '.') {
            const coords = [ri, ci]
            antennas[cell] = (antennas[cell] || []).concat([coords])
        }
    })
})

// Calculate antinode positions
let antinodes = [];
for (antennaType in antennas) {
    const antennaAntinodes = new Set();
    const theseAntennas = antennas[antennaType];

    // Every single antenna produces at lest two antinodes with every single other antenna
    for (var i = 0;  i < theseAntennas.length-1; i++) {
        for (var ii = i+1;  ii < theseAntennas.length; ii++) {
            if (i !== ii) {
                const a = theseAntennas[i];
                const b = theseAntennas[ii];

                const slope = [a[0]-b[0], a[1]-b[1]]
        
                antennaAntinodes.add([a[0]+slope[0], a[1]+slope[1]])
                antennaAntinodes.add([b[0]-slope[0], b[1]-slope[1]])
            }
        }
    }

    // Add in our new antinodes for this freq
    antinodes = antinodes.concat([...antennaAntinodes])
}

// I didn't re = alize overlaps were counted as one
// antinodes = [...new Set(antinodes)]
antinodes =antinodes.filter(
    (row, index, self) =>
      index === self.findIndex((r) => JSON.stringify(r) === JSON.stringify(row))
  );
  

// Count in-bounds nodes
let dimensions = [input.split("\n").length, input.split("\n")[1].length]
antinodes = antinodes.filter(node => {
    return (
        node[0] >= 0 && 
        node[0] < dimensions[0]-1 && // why is this -1? idek
        node[1] >= 0 &&
        node[1] < dimensions[1]
    )
})

// Visualize
let tempInput = input.trim().split("\n").map(line => line.split(""));
antinodes.forEach(node => {
    tempInput[node[1]][node[0]] = "#"
})
tempInput = tempInput.map(line => line.join("")).join("\n")


console.log(tempInput)

console.log(antinodes.length)
