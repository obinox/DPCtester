function loadXML() {
    var xmlInput = document.getElementById("xmlInput");
    var file = xmlInput.files[0];

    if (file) {
        var reader = new FileReader();
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
                buttonMode = !!sideL + !!button1 + !!button2 + !!button3 + !!button4 + !!button5 + !!button6 + !!sideR + !!L1 + !!R1 - 2;
                console.log("Button Mode:", buttonMode);
            }
            drawNote = (track, name, type) => {
                if (track) {
                    var element = document.getElementById(name);
                    element.innerHTML = "";
                    for (var i = 0; i < track.length; i++) {
                        var tick = track[i].tick;
                        var dur = track[i].dur;
                        var dv = document.createElement("div");
                        dv.className = type;
                        dv.style.top = tick + "px";
                        if (dur) {
                            dv.style.height = dur + "px";
                        } else {
                            dv.style.height = "10px";
                        }
                        element.appendChild(dv);
                    }
                }
            };
            var buttonColor = [];
            for (let i = 0; i < buttonMode / 2; i++) {
                if (i % 2 == 0) {
                    buttonColor.push("note note-odd");
                } else {
                    buttonColor.push("note note-even");
                }
            }
            for (let i = 0; i < (buttonMode + 1) / 2; i++) {
                if (i % 2 == 0) {
                    buttonColor.push("note note-even");
                } else {
                    buttonColor.push("note note-odd");
                }
            }
            for (let i = buttonMode; i < 6; i++) {
                buttonColor.push("note");
            }
            drawNote(sideL, "sideL", "note note-side");
            drawNote(sideR, "sideR", "note note-side");
            drawNote(L1, "L1", "note note-trigger");
            drawNote(R1, "R1", "note note-trigger");
            drawNote(button1, "button1", buttonColor[0]);
            drawNote(button2, "button2", buttonColor[1]);
            drawNote(button3, "button3", buttonColor[2]);
            drawNote(button4, "button4", buttonColor[3]);
            drawNote(button5, "button5", buttonColor[4]);
            drawNote(button6, "button6", buttonColor[5]);
        };
        reader.readAsText(file);
    } else {
    }
}
