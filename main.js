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
let velocity = 52;
let judge = 0;
const root = document.documentElement;
const modeBtn = document.getElementById("button-mode");
const gear = document.getElementById("gear");
const gearBtn = document.getElementById("gear-button");
const notevelL = document.getElementById("note-velocityL");
const notevelR = document.getElementById("note-velocityR");
const judgeL = document.getElementById("judgeL");
const judgeLL = document.getElementById("judgeLL");
const judgeR = document.getElementById("judgeR");
const judgeRR = document.getElementById("judgeRR");
const judgeText = document.getElementById("judge");
const fakeL = document.getElementById("fakeL");
const fakeR = document.getElementById("fakeR");

const tracks = document.querySelectorAll(".normal");

function modeRender() {
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
    if (modeidx == 3) {
        fakeL.style.opacity = "1";
        fakeR.style.opacity = "1";
    } else {
        fakeL.style.opacity = "0";
        fakeR.style.opacity = "0";
    }
}

function gearRender() {
    gearBtn.textContent = gearseq[gearidx].text;
    gearBtn.value = gearseq[gearidx].value;
    gear.className = gearseq[gearidx].value;
}

function velocityRender() {
    if (velocity < 10) {
        velocity = 10;
    }
    if (velocity > 90) {
        velocity = 90;
    }
    notevelL.textContent = "◀ " + Math.floor(velocity / 10);
    notevelR.textContent = (velocity % 10) + " ▶";
    root.style.setProperty("--note-velocity", velocity);
}

function judgeRender() {
    if (judge < -500) {
        judge = -500;
    }
    if (judge > 500) {
        judge = 500;
    }
    judgeText.textContent = judge;
    root.style.setProperty("--judge-tick", judge);
}

modeRender();
gearRender();
velocityRender();
judgeRender();

document.addEventListener("DOMContentLoaded", () => {
    modeBtn.addEventListener("click", () => {
        modeidx = (modeidx + 1) % 4;
        modeRender();
    });
    gearBtn.addEventListener("click", () => {
        gearidx = (gearidx + 1) % 3;
        gearRender();
    });
    notevelL.addEventListener("click", () => {
        velocity--;
        velocityRender();
    });
    notevelR.addEventListener("click", () => {
        velocity++;
        velocityRender();
    });
    judgeL.addEventListener("click", () => {
        judge--;
        judgeRender();
    });
    judgeR.addEventListener("click", () => {
        judge++;
        judgeRender();
    });
    judgeLL.addEventListener("click", () => {
        judge -= 10;
        judgeRender();
    });
    judgeRR.addEventListener("click", () => {
        judge += 10;
        judgeRender();
    });
});

window.addEventListener("keydown", (event) => {
    // protect nulls
    const targetNodeName = event.target.nodeName;
    if (targetNodeName === "INPUT" || targetNodeName === "TEXTAREA") {
        return;
    }

    let handled = true;
    switch (event.code) {
        case "Digit1":
            velocity--;
            velocityRender();
            break;
        case "Digit2":
            velocity++;
            velocityRender();
            break;
        case "Digit4":
            modeidx = 0;
            modeRender();
            break;
        case "Digit5":
            modeidx = 1;
            modeRender();
            break;
        case "Digit6":
            modeidx = 2;
            modeRender();
            break;
        case "Digit8":
            modeidx = 3;
            modeRender();
            break;
        case "PageUp":
            break;
        case "PageDown":
            break;
        default:
            handled = false;
            break;
    }

    if (handled) {
        event.preventDefault();
    }
});
