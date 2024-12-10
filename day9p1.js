function compressDisk(input) {
    // Parse input into blocks
    let disk = []
    let id = 0
    for (let i = 0; i < input.length; i += 2) {
        disk.push({
            allocated: true,
            id: id,
            length: +input[i]
        })
        if (input[i+1]) {
            disk.push({
                allocated: false,
                length: +input[i+1]
            })
        }
        id++
    }

    function visualizeDisk(disk) {
        return disk.map(block => 
            String(block.allocated ? block.id : '.').repeat(block.length)
        ).join('')
    }

    function printDebug(iteration, disk) {
        console.log(`Iteration ${iteration}: ${visualizeDisk(disk)}`)
    }

    let iteration = 0
    const MAX_ITERATIONS = 100000

    while (iteration < MAX_ITERATIONS) {
        // Find the first unallocated block
        let unallocatedIndex = disk.findIndex(block => !block.allocated && block.length > 0)
        
        // If no unallocated block, we're done
        if (unallocatedIndex === -1) break

        // Find the last allocated block
        let lastAllocatedIndex = -1
        for (let i = disk.length - 1; i >= 0; i--) {
            if (disk[i].allocated && disk[i].length > 0) {
                lastAllocatedIndex = i
                break
            }
        }

        // If no allocated block, we're done
        if (lastAllocatedIndex === -1) break

        // If unallocated block is past last allocated block, we're done
        if (unallocatedIndex > lastAllocatedIndex) break

        // Move a block from the last allocated block to the unallocated space
        let lastAllocatedBlock = disk[lastAllocatedIndex]
        
        // Insert a new block with the same ID before the unallocated block
        disk.splice(unallocatedIndex, 0, {
            allocated: true,
            id: lastAllocatedBlock.id,
            length: 1
        })

        // Reduce lengths
        lastAllocatedBlock.length--
        disk[unallocatedIndex + 1].length--

        // Remove blocks with zero length
        disk = disk.filter(block => block.length > 0)

        iteration++
    }

    // Calculate checksum
    let checksumIndex = 0
    let checksum = 0
    for (let block of disk) {
        if (block.allocated) {
            for (let i = 0; i < block.length; i++) {
                checksum += checksumIndex * block.id
                checksumIndex++
            }
        }
    }

    return {
        finalDisk: visualizeDisk(disk),
        checksum: checksum,
        iterations: iteration
    }
}

// Actual input
let input = this.document?.body.innerText || "2333133121414131402"
const result = compressDisk(input)
// console.log("Final Disk State:", result.finalDisk)
console.log("Checksum:", result.checksum)
console.log("Iterations:", result.iterations)
