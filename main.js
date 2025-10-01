let modeidx = 0;
const modeseq = [
    { value: 4, text: "4B", button: 4 },
    { value: 5, text: "5B", button: 5 },
    { value: 6, text: "6B", button: 6 },
    { value: 8, text: "8B", button: 6 },
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
const notetext = document.getElementById("note-text");
const judgeL = document.getElementById("judgeL");
const judgeLL = document.getElementById("judgeLL");
const judgeR = document.getElementById("judgeR");
const judgeRR = document.getElementById("judgeRR");
const judgeText = document.getElementById("judge");
const fakeL = document.getElementById("fakeL");
const fakeR = document.getElementById("fakeR");

const notetracks = document.querySelectorAll(".normal");
const tracks = document.getElementById("tracks");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const rectnotes = [];
const recttriggersL = [];
const recttriggersR = [];
const rectsides = [];
const rectbars = [];
var noteheight = 0;
var notewidth = 0;

var tempo = 0;
var tpm = 0;
var start_tick = 0;
var end_tick = 0;
var tick = 0;
var ms = 0;
var track_cnt = 0;
var tps = 0;

const tickntempo = [];

const canvnotes = [];
const canvbars = [];
var currtime = 0;

function modeRender() {
    modeBtn.textContent = modeseq[modeidx].text;
    modeBtn.value = modeseq[modeidx].value;
    root.style.setProperty("--button-mode", modeseq[modeidx].value);
    notetracks[2].dataset.type = "odd";
    notetracks[3].dataset.type = "odd";
    notetracks[4].dataset.type = "odd";
    switch (modeseq[modeidx].value) {
        case 4:
            notetracks[2].dataset.type = "even";
            break;
        case 5:
            notetracks[3].dataset.type = "even";
            break;
        case 6:
        case 8:
            notetracks[4].dataset.type = "even";
            break;
    }
    if (modeidx == 3) {
        fakeL.style.display = "block";
        fakeR.style.display = "block";
    } else {
        fakeL.style.display = "none";
        fakeR.style.display = "none";
    }
    resize();
}

function gearRender() {
    gearBtn.textContent = gearseq[gearidx].text;
    gearBtn.value = gearseq[gearidx].value;
    gear.className = gearseq[gearidx].value;
    resize();
}

function velocityRender() {
    if (velocity < 10) {
        velocity = 10;
    }
    if (velocity > 90) {
        velocity = 90;
    }
    notevelL.textContent = "◀";
    notevelR.textContent = "▶";
    notetext.textContent = Math.floor(velocity / 10) + "." + (velocity % 10);
    resize();
}

function judgeRender() {
    if (judge < -500) {
        judge = -500;
    }
    if (judge > 500) {
        judge = 500;
    }
    judgeText.textContent = judge;
    resize();
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

            canvbars.length = 0;
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
                    canvbars.push(t);
                }
            }

            // var tempoElement = xmlDoc.querySelector("tempo");
            // var tempos = null;
            // tickntempo.length = 0;
            // if (tempoElement) {
            //     tempos = tempoElement.querySelectorAll("tempo");
            //     console.log("Tempo Count:", tempos.length);
            //     for (var i = 0; i < tempos.length; i++) {
            //         var t = tempos.item(i);
            //         var tick = t.getAttribute("tick");
            //         var tempo = t.getAttribute("tempo");
            //         var tps = t.getAttribute("tps");
            //         //same
            //         console.log("Tempo " + (i + 1) + ":", {
            //             tick: tick,
            //             tempo: tempo,
            //             tps: tps,
            //         });
            //     }
            // }

            var notelistElement = xmlDoc.querySelector("note_list");
            canvnotes.length = 0;

            if (notelistElement) {
                var note = notelistElement.querySelectorAll("track");
                for (var i = 0; i < note.length; i++) {
                    var track = note.item(i);
                    var idx = track.getAttribute("idx");
                    var notes = track.querySelectorAll("note");
                    var name = "";
                    if (idx == 2) {
                        name = "sideL";
                    } else if (idx == 3) {
                        name = "button1";
                    } else if (idx == 4) {
                        name = "button2";
                    } else if (idx == 5) {
                        name = "button3";
                    } else if (idx == 6) {
                        name = "button4";
                    } else if (idx == 7) {
                        name = "button5";
                    } else if (idx == 8) {
                        name = "button6";
                    } else if (idx == 9) {
                        name = "sideR";
                    } else if (idx == 10) {
                        name = "triggerL1";
                    } else if (idx == 11) {
                        name = "triggerR1";
                    }
                    for (var j = 0; j < notes.length; j++) {
                        var n = notes.item(j);
                        var tick = n.getAttribute("tick");
                        var dur = n.getAttribute("dur");
                        canvnotes.push({ tick: tick, dur: dur, track: name });
                    }
                }
            }

            sampling();
        };
        reader.readAsText(file);
    } else {
    }
}

function resize() {
    canvas.width = tracks.clientWidth;
    canvas.height = tracks.clientHeight;
    noteheight = (canvas.width * 9) / 160;
    notewidth = canvas.width / modeseq[modeidx].button;
    sampling();
}

function grad2(color0, color1, x0, y0, x1, y1, n) {
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    for (let i = 0; i < n; i++) {
        grad.addColorStop(i / n, color0);
        grad.addColorStop((i + 1 / 2) / n, color1);
    }
    grad.addColorStop(1, color0);
    return grad;
}

function grad4(color0, color1, color2, x0, y0, x1, y1, n) {
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    for (let i = 0; i < n; i++) {
        grad.addColorStop(i / n, color0);
        grad.addColorStop((i + 1 / 4) / n, color1);
        grad.addColorStop((i + 1 / 2) / n, color2);
        grad.addColorStop((i + 3 / 4) / n, color1);
    }
    grad.addColorStop(1, color0);
    return grad;
}

function sampling() {
    const whitenote = grad4("#555", "#999", "#ccc", 0, 0, canvas.width, 0, modeseq[modeidx].button);
    const bluenote = grad4("#04f", "#39d", "#0cf", 0, 0, canvas.width, 0, modeseq[modeidx].button);

    const redtrigger = grad2("#f0a", "#f15", 0, 0, canvas.width, 0, 2);
    const greenside = grad2("#3bb", "#9ef", 0, 0, canvas.width, 0, 2);

    rectbars.length = 0;
    rectnotes.length = 0;
    rectsides.length = 0;
    recttriggersL.length = 0;
    recttriggersR.length = 0;

    const judgeoff = (judge + 6) * 32;
    const notecoef = (30 * velocity) / tps;

    for (let i = 0; i < canvbars.length; i++) {
        const n = canvbars[i];
        const barchartpos = (n * (96 * 16) * canvas.width) / 480;
        const barpos = (barchartpos + judgeoff) * notecoef;

        const nn = [0, barpos, canvas.width, 1, "gray"];
        rectbars.push(nn);
    }

    for (let i = 0; i < canvnotes.length; i++) {
        const n = canvnotes[i];
        var fillcolor = "";
        var trackidx = 0;

        const notechartpos = ((n.tick - 96 * 16) * canvas.width) / 480;

        const notepos = (notechartpos + judgeoff) * notecoef;

        var notedur = noteheight;
        var notesize = notewidth;

        if (n.dur) {
            notedur = ((n.dur * canvas.width) / 480) * notecoef;
        }
        switch (n.track) {
            case "button1":
                fillcolor = whitenote;
                trackidx = 0;
                break;
            case "button2":
                fillcolor = bluenote;
                trackidx = 1;
                break;
            case "button3":
                if (modeidx == 0) {
                    fillcolor = bluenote;
                } else {
                    fillcolor = whitenote;
                }
                trackidx = 2;
                break;
            case "button4":
                if (modeidx == 1) {
                    fillcolor = bluenote;
                } else {
                    fillcolor = whitenote;
                }
                trackidx = 3;
                break;
            case "button5":
                if (modeidx > 1) {
                    fillcolor = bluenote;
                } else {
                    fillcolor = whitenote;
                }
                trackidx = 4;
                break;
            case "button6":
                fillcolor = whitenote;
                trackidx = 5;
                break;
            case "sideL":
                fillcolor = greenside;
                trackidx = 0;
                notesize = canvas.width / 2;
                break;
            case "sideR":
                fillcolor = greenside;
                trackidx = 1;
                notesize = canvas.width / 2;
                break;
            case "triggerL1":
                fillcolor = redtrigger;
                trackidx = 0;
                notesize = canvas.width / 2;
                break;
            case "triggerR1":
                fillcolor = redtrigger;
                trackidx = 1;
                notesize = canvas.width / 2;
                break;
            default:
                break;
        }

        const nn = [trackidx * notesize, notepos - noteheight / 2, notesize, notedur, fillcolor];
        switch (n.track) {
            case "button1":
            case "button2":
            case "button3":
            case "button4":
            case "button5":
            case "button6":
                rectnotes.push(nn);
                break;
            case "sideL":
                rectsides.push(nn);
                break;
            case "sideR":
                rectsides.push(nn);
                break;
            case "triggerL1":
                recttriggersL.push(nn);
                break;
            case "triggerR1":
                recttriggersR.push(nn);
                break;
            default:
                break;
        }
    }
}

function drawnotes(arr, timeoffest = 0, judgeoff = 0) {
    for (let i = 0; i < arr.length; i++) {
        const n = arr[i];
        const x = n[0];
        const y = -n[1] + timeoffest - judgeoff;
        const w = n[2];
        const h = -n[3];

        if (x + w < canvas.width / -2 || x > (canvas.width * 3) / 2) continue;
        if (y < canvas.width / -2 || y + h > (canvas.height * 3) / 2) continue;

        ctx.fillStyle = n[4];
        ctx.fillRect(x, y, w, h);
    }
}

function drawtriggers(arr, timeoffest = 0, judgeoff = 0, right = 0) {
    for (let i = 0; i < arr.length; i++) {
        const n = arr[i];
        const x = n[0];
        const y = -n[1] + timeoffest - judgeoff;
        const w = n[2];
        const h = -n[3];

        if (x + w < canvas.width / -2 || x > (canvas.width * 3) / 2) continue;
        if (y < canvas.width / -2 || y + h > (canvas.height * 3) / 2) continue;

        ctx.fillStyle = n[4];
        ctx.beginPath();
        ctx.moveTo(x, y);
        if (right == 0) {
            ctx.lineTo(x, y + h + noteheight / 2);
            ctx.lineTo(x + noteheight / 2, y + h);
            ctx.lineTo(x + w, y + h);
        } else {
            ctx.lineTo(x, y + h);
            ctx.lineTo(x + w - noteheight / 2, y + h);
            ctx.lineTo(x + w, y + h + noteheight / 2);
        }
        ctx.lineTo(x + w, y);
        ctx.closePath();
        ctx.fill();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (player && typeof player.getCurrentTime === "function") {
        currtime = player.getCurrentTime();
    } else {
        currtime = 0;
    }
    var timeoffest = (currtime * velocity * canvas.width) / 16 + canvas.height;
    var judgeoffset = 0;

    drawnotes(rectbars, timeoffest, judgeoffset);
    drawnotes(rectsides, timeoffest, judgeoffset);
    drawtriggers(recttriggersL, timeoffest, judgeoffset, 0);
    drawtriggers(recttriggersR, timeoffest, judgeoffset, 1);
    drawnotes(rectnotes, timeoffest, judgeoffset);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
resize();
window.addEventListener("resize", resize);
