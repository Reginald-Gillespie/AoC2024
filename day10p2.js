let input = this.document?.body.innerText || `
.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....
`

input = input.trim().split("\n").map(line => line.split("").map(Number))

function removeDuplicates(array) {
    const seen = new Set();
    return array.filter(([a, b]) => {
      const key = `${a},${b}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function scoreOfCoord(coord) {
    let height = 0;
    let queue = [ coord ]
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
    while (queue.length > 0) {
        batch = []
        queue.forEach(pos => {
            offsets.forEach(offset => {
                const testPos = [pos[0]+offset[0], pos[1]+offset[1]];
                if (input[testPos[1]]?.[testPos[0]] === height+1) {
                    batch.push(testPos)
                }
            })
        })
        // batch = removeDuplicates(batch)

        height++;
        if (height == 9) return batch.length

        queue = batch;
    }
    return 0
}

let sum = 0;
input.forEach((line, lineIndex) => {
    line.forEach((number,cellIndex) => {
        if (number == 0) {
            const score = scoreOfCoord([cellIndex, lineIndex]);
            console.log(`Score: ${score}`)
            sum += score
        }
    })
});

console.log(sum)
