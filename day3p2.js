let sum = 0;
let input = document.body.innerText;
let doing = true;
while(true) {
    // Find
    const nextSwap = input.match(/do(n't)?\(\)/);
    const multi = input.match(/mul\((\d{1,3}),(\d{1,3})\)/)

    // Update processed amount and break if we need to
    if (!multi?.index) break;
    input = input.substring((multi.index+1));

    // Update doing
    if (nextSwap?.index < multi?.index) {
        if (nextSwap[0] == "do()") {
            doing = true;
        }
        else {
            doing = false;
        }
    }

    // Sum
    if (doing) sum += multi[1] * multi[2];
}
    
