const start = Date.now()

const input = (this?.document?.body.innerText || `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`).trim().split("\n").map(row => {
    const temp = row.split(":");
    return [+temp[0], temp[1].trim().split(" ").map(Number)];
})

const operations = {
    '*': multiply = (a, b) => a * b,
    '+': add = (a, b) => a + b,
}
const operationsKey = Object.keys(operations);

// console.log(input)

let sumWork = 0;
input.forEach(line => {
    const [expectedResult, test] = line;
    let queue = [ test ]; // 81, 40, 27
    
    // For each pair of numbers in the test, add in all possible configurations of options
    for (let i = 0; i < test.length - 1; i++) {
        let batch = [];
        const spliceIndex = i * 2 + 1; // this gets a little messy since splicing in operations changes the array processed size
        queue.forEach( test => {
            operationsKey.forEach( operationKey => {
                // Splice in the operation reference to each
                const perm = test.slice();
                perm.splice(spliceIndex, 0, operationKey)

                // Add this permutation to this batch
                batch.push(perm)
            })
        })

        // Update the queue with the new batch
        queue = batch;
    }
    
    // console.log(queue)

    // Now, calculate each permutation
    for (let testI = 0; testI < queue.length; testI++) {
        const perm = queue[testI];

        // Calculate
        let result = perm[0]
        for (let i = 1; i < perm.length - 1; i += 2) {
            const [a, op, b] = perm.slice(i-1, i+2);
            result = operations[op](result, b);
        }
    
        if (expectedResult == result) {
            sumWork += expectedResult;
            testI = queue.length; // exit
            // continue
        }
    }
})


console.log(`Took ${(Date.now() - start)/1000} seconds`)

console.log(sumWork);
