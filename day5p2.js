let [rules, updates] = document.body.innerText
        .split("\n\n").map(section => section.trim().split("\n"))

// Create a lookup table for each set of numbers in the format of:  
//  sort(x, y): aocOrder(x, y)
// I'd think that would be pretty efficient? And likely easily optimized by JIT?
let rulesJson = {};
rules = rules.filter( rule => {
    const ruleData = rule.split("|").map(Number);
    rulesJson[ruleData.slice().sort().join('|')] = ruleData;
})

// Save updates
const originalUpdates = updates.slice()

// Sort updates, and check for changes
sum = 0;
updates.forEach((list, index) => {
    // Sort 
    list = list.split(",").map(Number);
    list.sort((a, b) => {
        const lookupKey = [a, b].sort().join('|')
        const order = rulesJson[lookupKey];
        if (!order) return 0; // some entries don't have a specific order, leave them alone
        if (order[0] == a) { // fast check for if a is first
            return -1; // a should come before b
        }
        return 1;
    });
    list = list.join(',');

    // Compare to original
    if (list !== originalUpdates[index]) {
        const split = list.split(','); // lotta splittin going on.. would prefer to leave one way or the other but easier to check strings
        sum += +split[split.length >> 1] // integer division by 2
    }
})
