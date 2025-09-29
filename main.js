let modeidx = 0;
const modeseq = [
    { value: 4, text: "4B" },
    { value: 5, text: "5B" },
    { value: 6, text: "6B" },
    { value: 8, text: "8B" },
];
let gearidx = 0;
const gearseq = [
    { value: "center", text: "M" },
    { value: "right", text: "R" },
    { value: "left", text: "L" },
];
document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const modeBtn = document.getElementById("button-mode");
    const gear = document.getElementById("gear");
    const gearBtn = document.getElementById("gear-button");
    const tracks = document.querySelectorAll(".normal");
    modeBtn.addEventListener("click", () => {
        modeidx = (modeidx + 1) % 4;
        modeBtn.textContent = modeseq[modeidx].text;
        modeBtn.value = modeseq[modeidx].value;
        root.style.setProperty("--button-mode", modeseq[modeidx].value);
        tracks[2].dataset.type = "odd";
        tracks[3].dataset.type = "odd";
        tracks[4].dataset.type = "odd";
        switch (modeseq[modeidx].value) {
            case 4:
                tracks[2].dataset.type = "even";
                break;
            case 5:
                tracks[3].dataset.type = "even";
                break;
            case 6:
            case 8:
                tracks[4].dataset.type = "even";
                break;
        }
    });
    gearBtn.addEventListener("click", () => {
        gearidx = (gearidx + 1) % 3;
        gearBtn.textContent = gearseq[gearidx].text;
        gearBtn.value = gearseq[gearidx].value;
        gear.className = gearseq[gearidx].value;
    });
});
