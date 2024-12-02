let list1 = [];
let list2 = [];
let sum = 0;
document.body.innerText.trim().split("\n").forEach(ids => {
    let [a, b] = ids.split(/\s+/)
    list1.push(+a);
    list2.push(+b);
})
list1.sort()
list2.sort()
for (let index = 0; index < list1.length; index++) {
    console.log(sum)
    sum += Math.abs(list1[index] - list2[index])
}
