let sum = 0;
document.body.innerText.match(/mul\((\d{1,3}),(\d{1,3})\)/g).forEach(inst => {
    const [a, b] = inst.match(/\d+/g);
    sum += a * b;
})
