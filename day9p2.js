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

    // console.log(visualizeDisk(disk));

    while (iteration < MAX_ITERATIONS) {
        // Find the last allocated unsorted block
        let lastAllocatedIndex = -1
        let sizeNeeded = -1;
        for (let i = disk.length - 1; i >= 0; i--) {
            if (disk[i].allocated && !disk[i].sorted && disk[i].length > 0) {
                lastAllocatedIndex = i
                sizeNeeded = disk[i].length;
                break
            }
        }
        if (lastAllocatedIndex === -1) break
        let lastAllocatedBlock = disk[lastAllocatedIndex]

        // Find the first unallocated block that will fit it
        let unallocatedIndex = disk.findIndex(block => !block.allocated && block.length >= sizeNeeded)

        // If we found a working block, move
        if (unallocatedIndex !== -1 && unallocatedIndex < lastAllocatedIndex) { // Only move if we're moving it backwards

            // Insert a new block with the same ID before the unallocated block
            disk.splice(unallocatedIndex, 0, {
                allocated: true,
                id: lastAllocatedBlock.id,
                length: lastAllocatedBlock.length
            })

            // Removed used space from free, and set allocated space as unallocated
            disk[unallocatedIndex + 1].length -= lastAllocatedBlock.length;
            lastAllocatedBlock.allocated = false;
            delete lastAllocatedBlock.id;

            // Remove blocks with zero length
            disk = disk.filter(block => block.length > 0)

            // console.log(visualizeDisk(disk));
        }

        // Mark this block as processed even if we couldn't move it
        lastAllocatedBlock.sorted = true;

        iteration++
    }

    // Calculate checksum
    let checksumIndex = 0
    let checksum = 0
    for (let block of disk) {
        for (let i = 0; i < block.length; i++) {
            if (block.allocated) checksum += checksumIndex * block.id
            checksumIndex++
        }
    }

    return {
        finalDisk: visualizeDisk(disk),
        checksum: checksum,
    }
}

// Actual input
let input = "<input>"
const result = compressDisk(input)
console.log("Final Disk State:", result.finalDisk)
console.log("Checksum:", result.checksum)
