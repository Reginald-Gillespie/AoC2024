let list1 = [];
let list2NumOccurs = []
let similarity = 0;
document.body.innerText.trim().split("\n").forEach(ids => {
    let [a, b] = ids.split(/\s+/)
    a = +a
    b = +b
    list1.push(a);
    list2NumOccurs[b] = list2NumOccurs[b] + 1 || 1
})
for (let id of list1) {
    let occ2 = list2NumOccurs[id]
    if (occ2) similarity += id * occ2
}
