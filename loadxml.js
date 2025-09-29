function loadXML() {
    const root = document.documentElement;
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
