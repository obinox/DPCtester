var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var root;

let player;
let progressInterval;

function onYouTubeIframeAPIReady() {
    root = document.documentElement;
    console.log("YouTube Ready.");
}

function loadVideoById(videoId) {
    if (!videoId) return;

    if (player) {
        player.destroy();
    }

    player = new YT.Player("player", {
        videoId: videoId,
        playerVars: {
            playerVars: {
                autoplay: 0,
                controls: 0,
                rel: 0,
                modestbranding: 1,
                fs: 0,
                loop: 0,
                iv_load_policy: 3,
                cc_load_policy: 0,
                playsinline: 1,
            },
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

function onPlayerReady(e) {
    const volumeSlider = document.getElementById("volume-slider");
    volumeSlider.addEventListener("input", (e) => {
        player.setVolume(e.target.value);
    });

    const progressBarContainer = document.getElementById("progress-bar-container");
    progressBarContainer.addEventListener("click", (e) => {
        const rect = progressBarContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const containerWidth = rect.width;
        const seekTime = (clickX / containerWidth) * player.getDuration();
        player.seekTo(seekTime, true);
    });

    const playPauseBtn = document.getElementById("play-pause-btn");
    playPauseBtn.addEventListener("click", () => {
        const playerState = player.getPlayerState();
        if (playerState === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });

    //mutebtn
    const muteBtn = document.getElementById("mute-btn");
    muteBtn.addEventListener("click", () => {
        if (player.isMuted()) {
            player.unMute();
        } else {
            player.mute();
        }
    });
    updatePlayerInfo();
    clearInterval(progressInterval);
    progressInterval = setInterval(updatePlayerInfo, 1000 / 60);
}

function onPlayerStateChange(e) {
    const playPauseBtn = document.getElementById("play-pause-btn");
    if (e.data === YT.PlayerState.PLAYING) {
        playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%"><path d="M9 19H7V5h2Zm8-14h-2v14h2Z"></path></svg>`;
    } else {
        playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%"><path d="m7 4 12 8-12 8V4z"></path></svg>`;
    }
}

function formatTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "0:00";
    }

    const totalSecondsInt = Math.floor(totalSeconds);
    const hours = Math.floor(totalSecondsInt / 3600);
    const minutes = Math.floor((totalSecondsInt % 3600) / 60);
    const seconds = totalSecondsInt % 60;

    const paddedSeconds = String(seconds).padStart(2, "0");

    if (hours > 0) {
        const paddedMinutes = String(minutes).padStart(2, "0");
        return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    } else {
        return `${minutes}:${paddedSeconds}`;
    }
}

function updatePlayerInfo() {
    // update time and progress bar
    if (player && typeof player.getCurrentTime === "function") {
        const progressBar = document.getElementById("progress-bar");
        const currentTime = player.getCurrentTime();
        root.style.setProperty("--curr-time", currentTime);
        const duration = player.getDuration();
        const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
        progressBar.style.width = progressPercent + "%";
        const timeInfo = document.getElementById("time-info");
        timeInfo.textContent = formatTime(currentTime) + " / " + formatTime(duration);
    }

    // update volume and mute btn
    const volumeSlider = document.getElementById("volume-slider");
    const muteBtn = document.getElementById("mute-btn");
    if (player.isMuted()) {
        volumeSlider.value = 0;
        muteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="m3.15 3.85 4.17 4.17L6.16 9H3v6h3.16L12 19.93v-7.22l2.45 2.45c-.15.07-.3.13-.45.18v1.04c.43-.1.83-.27 1.2-.48l1.81 1.81c-.88.62-1.9 1.04-3.01 1.2v1.01c1.39-.17 2.66-.71 3.73-1.49l2.42 2.42.71-.71-17-17-.71.71zM11 11.71v6.07L6.52 14H4v-4h2.52l1.5-1.27L11 11.71zm-.67-4.92-.71-.71L12 4.07v4.39l-1-1V6.22l-.67.57zM14 8.66V7.62c2 .46 3.5 2.24 3.5 4.38 0 .58-.13 1.13-.33 1.64l-.79-.79c.07-.27.12-.55.12-.85 0-1.58-1.06-2.9-2.5-3.34zm0-3.58V4.07c3.95.49 7 3.85 7 7.93 0 1.56-.46 3.01-1.23 4.24l-.73-.73c.61-1.03.96-2.23.96-3.51 0-3.52-2.61-6.43-6-6.92z"></path></svg>`;
    } else {
        volumeSlider.value = player.getVolume();
        muteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%"><path d="M17.5 12c0 2.14-1.5 3.92-3.5 4.38v-1.04c1.44-.43 2.5-1.76 2.5-3.34 0-1.58-1.06-2.9-2.5-3.34V7.62c2 .46 3.5 2.24 3.5 4.38zM12 4.07v15.86L6.16 15H3V9h3.16L12 4.07zm-1 2.15L6.52 10H4v4h2.52L11 17.78V6.22zM21 12c0 4.08-3.05 7.44-7 7.93v-1.01c3.39-.49 6-3.4 6-6.92s-2.61-6.43-6-6.92V4.07c3.95.49 7 3.85 7 7.93z"></path></svg>`;
    }
}

window.addEventListener("keydown", (event) => {
    // protect nulls
    if (!player || !player.getPlayerState) {
        return;
    }
    const targetNodeName = event.target.nodeName;
    if (targetNodeName === "INPUT" || targetNodeName === "TEXTAREA") {
        return;
    }

    let handled = true;
    switch (event.code) {
        case "Space":
        case "KeyK":
            // play/pause
            const playerState = player.getPlayerState();
            if (playerState === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            break;
        case "KeyJ":
            // 10s left
            player.seekTo(player.getCurrentTime() - 10, true);
            break;
        case "KeyL":
            // 10s right
            player.seekTo(player.getCurrentTime() + 10, true);
            break;
        case "ArrowRight":
            // 5s right
            player.seekTo(player.getCurrentTime() + 5, true);
            break;
        case "ArrowLeft":
            // 5s left
            player.seekTo(player.getCurrentTime() - 5, true);
            break;
        case "ArrowUp":
            // volume up
            const currentVolumeUp = player.getVolume();
            player.setVolume(Math.min(currentVolumeUp + 5, 100));
            break;
        case "ArrowDown":
            // volume down
            const currentVolumeDown = player.getVolume();
            player.setVolume(Math.max(currentVolumeDown - 5, 0));
            break;
        case "KeyM":
            // mute/unmute
            if (player.isMuted()) {
                player.unMute();
            } else {
                player.mute();
            }
            break;
        default:
            handled = false;
            break;
    }

    if (handled) {
        event.preventDefault();
    }
});
