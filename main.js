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
    const cont = document.getElementById("yt-selector");

    const trigger = cont.querySelector(".select-trigger");
    const optionul = cont.querySelector(".options");

    const optionils = optionul.querySelectorAll(".option");

    trigger.addEventListener("click", () => {
        cont.classList.toggle("open");
    });
    optionils.forEach((o) => {
        o.addEventListener("click", () => {
            const selectedValue = o.dataset.value;
            const selectedText = o.textContent;

            trigger.querySelector("span").textContent = selectedText;

            optionils.forEach((e) => e.classList.remove("selected"));
            o.classList.add("selected");

            cont.classList.remove("open");

            loadVideoById(selectedValue);
        });
    });

    // close when click other territory
    document.addEventListener("click", (e) => {
        if (!cont.contains(e.target)) {
            cont.classList.remove("open");
        }
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

function loadXML() {
    const xmlInput = document.getElementById("xml-input");
    const xmlLabel = document.getElementById("xml-label");

    var file = xmlInput.files[0];

    if (file) {
        var reader = new FileReader();
        xmlLabel.textContent = file.name;
        reader.onload = function (e) {
            var xmlString = e.target.result;
            var xmlDoc = new DOMParser().parseFromString(xmlString, "text/xml");
            console.log("XML loaded:", xmlDoc);

            var songinfoElement = xmlDoc.querySelector("songinfo");
            var tempo = null;
            var tpm = null;
            var start_tick = null;
            var end_tick = null;
            var tick = null;
            var ms = null;
            var track_cnt = null;
            var tps = null;

            var measure = document.getElementById("measure");
            measure.innerHTML = "";

            if (songinfoElement) {
                tempo = songinfoElement.getAttribute("tempo");
                tpm = songinfoElement.getAttribute("tpm");
                start_tick = songinfoElement.getAttribute("start_tick");
                end_tick = songinfoElement.getAttribute("end_tick");
                tick = songinfoElement.getAttribute("tick");
                ms = songinfoElement.getAttribute("ms");
                track_cnt = songinfoElement.getAttribute("track_cnt");
                tps = songinfoElement.getAttribute("tps");
                console.log("Song Info:", {
                    tempo: tempo,
                    tpm: tpm,
                    start_tick: start_tick,
                    end_tick: end_tick,
                    tick: tick,
                    ms: ms,
                    track_cnt: track_cnt,
                    tps: tps,
                });

                root.style.setProperty("--xml-tps", tps);

                const bars = (end_tick - start_tick) / (96 * 16);
                for (let t = 0; t < bars + 5; t++) {
                    var dv = document.createElement("div");
                    dv.className = "bar";
                    dv.style.top = `calc(var(--curr-time) * var(--tps-const) * var(--note-velocity) * 1px - (${t * 96 * 16}px + var(--judge-tick) * 32px) * var(--tps-const) * var(--note-velocity) / var(--xml-tps) - 1px + var(--gear-height) * var(--judge-coef))`;
                    measure.appendChild(dv);
                }
            }

            var tempoElement = xmlDoc.querySelector("tempo");
            var tempos = null;
            if (tempoElement) {
                tempos = tempoElement.querySelectorAll("tempo");
                console.log("Tempo Count:", tempos.length);
                for (var i = 0; i < tempos.length; i++) {
                    var t = tempos.item(i);
                    var tick = t.getAttribute("tick");
                    var tempo = t.getAttribute("tempo");
                    var tps = t.getAttribute("tps");
                    //same
                    console.log("Tempo " + (i + 1) + ":", {
                        tick: tick,
                        tempo: tempo,
                        tps: tps,
                    });
                }
            }

            var notelistElement = xmlDoc.querySelector("note_list");
            var sideL = null;
            var button1 = null;
            var button2 = null;
            var button3 = null;
            var button4 = null;
            var button5 = null;
            var button6 = null;
            var sideR = null;
            var L1 = null;
            var R1 = null;
            var buttonMode = 0;

            if (notelistElement) {
                var note = notelistElement.querySelectorAll("track");
                for (var i = 0; i < note.length; i++) {
                    var track = note.item(i);
                    var idx = track.getAttribute("idx");
                    var notes = track.querySelectorAll("note");

                    getNotes = (n) => {
                        var notearr = [];
                        for (var j = 0; j < n.length; j++) {
                            var note = n.item(j);
                            var tick = note.getAttribute("tick");
                            var dur = note.getAttribute("dur");
                            notearr.push({ tick: tick, dur: dur });
                        }
                        return notearr;
                    };

                    if (idx == 2) {
                        sideL = getNotes(notes);
                    } else if (idx == 3) {
                        button1 = getNotes(notes);
                    } else if (idx == 4) {
                        button2 = getNotes(notes);
                    } else if (idx == 5) {
                        button3 = getNotes(notes);
                    } else if (idx == 6) {
                        button4 = getNotes(notes);
                    } else if (idx == 7) {
                        button5 = getNotes(notes);
                    } else if (idx == 8) {
                        button6 = getNotes(notes);
                    } else if (idx == 9) {
                        sideR = getNotes(notes);
                    } else if (idx == 10) {
                        L1 = getNotes(notes);
                    } else if (idx == 11) {
                        R1 = getNotes(notes);
                    }
                }
                console.log("Button Mode:", buttonMode);
            }
            drawNote = (track, name) => {
                var element = document.getElementById(name);
                element.innerHTML = "";
                if (track) {
                    for (var i = 0; i < track.length; i++) {
                        var tick = track[i].tick;
                        var dur = track[i].dur;
                        var dv = document.createElement("div");
                        dv.className = "note";
                        if (dur) {
                            dv.style.height = `calc(${dur}px * var(--tps-const) * var(--note-velocity) / var(--xml-tps))`;
                            dv.style.top = `calc(var(--curr-time) * var(--tps-const) * var(--note-velocity) * 1px - (${tick - 96 * 16}px + var(--judge-tick) * 32px) * var(--tps-const) * var(--note-velocity) / var(--xml-tps) - ${dur}px * var(--tps-const) * var(--note-velocity) / var(--xml-tps) + var(--note-height) / 2 + var(--gear-height) * var(--judge-coef))`;
                        } else {
                            dv.style.top = `calc(var(--curr-time) * var(--tps-const) * var(--note-velocity) * 1px - (${tick - 96 * 16}px + var(--judge-tick) * 32px) * var(--tps-const) * var(--note-velocity) / var(--xml-tps) - var(--note-height) / 2 + var(--gear-height) * var(--judge-coef))`;
                        }
                        element.appendChild(dv);
                    }
                }
            };
            drawNote(sideL, "sideL");
            drawNote(sideR, "sideR");
            drawNote(L1, "L1");
            drawNote(R1, "R1");
            drawNote(button1, "button1");
            drawNote(button2, "button2");
            drawNote(button3, "button3");
            drawNote(button4, "button4");
            drawNote(button5, "button5");
            drawNote(button6, "button6");
        };
        reader.readAsText(file);
    } else {
    }
}
