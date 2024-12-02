let safe = 0
document.body.innerText.trim().split("\n").forEach(reportStr => {
    const report = reportStr.split(" ").map(Number);
    // ugh, inefficient but I don't have time
    let increaseing = report[0] - report[1] > 0;
    for (var i = 0; i < report.length - 1; i++) {
        const diff = report[i] - report[i+1];
        if (
            (increaseing && diff >= 1 && diff <= 3) ||
            (!increaseing && diff <= -1 && diff >= -3)
        ){}
        else {
            return;
        }
    }
    safe++;
})
