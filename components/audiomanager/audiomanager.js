class AudioManager {

    static async adjustVolume(
        element,
        newVolume,
        duration = 1000,
        interval = 13,
        easing = Audioplayer.swing,
    ) {
        return new Promise(resolve => {
            const originalVolume = element.volume;
            const delta = newVolume - originalVolume;

            if (!delta || !duration || !easing || !interval) {
                element.volume = newVolume;
                resolve();
            }

            const ticks = Math.floor(duration / interval);
            let tick = 1;

            const timer = setInterval(() => {
                element.volume = originalVolume + (
                    easing(tick / ticks) * delta
                );

                if (++tick === ticks + 1) {
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        })
    }

    static swing(p) {
        return 0.5 - Math.cos(p * Math.PI) / 2;
    }

    constructor() {
        this.initCanvas();
        this.initUI();
        this.initAudio();
        console.log("starting");
        this.startBtn = document.querySelector(".start");
        this.startBtn.addEventListener("click", () => {
            this.audioCtx.resume();
            this.loadAudio();
            this.startBtn.classList.add("hidden");
        });
        this.render();
        window.onresize = () => {
            this.resize();
        };
    }

    initCanvas() {
        this.tick = 0;
        this.dimensions = {};
        this.resize();
    }

    resize() {
    }

    initUI() {
        this.progressBar = document.querySelector("#progress-bar");
        this.controls = {
            volume: document.querySelector("#btn-volume")
        };
        this.controls.volume.onclick = () => {
            let i = this.controls.volume.getElementsByTagName("i")[0];
            this.volume = this.volume > 0 ? 0 : 1;
            switch (this.volume) {
                case 1:
                    i.classList.remove("fa-volume-off");
                    i.classList.add("fa-volume-up");
                    break;
                case 0:
                    i.classList.remove("fa-volume-up");
                    i.classList.add("fa-volume-off");
                    break;
                default:
                    break;
            }
            this.gainNode.gain.value = this.volume;
        };
        this.title = document.getElementById("audiotitle");
        this.loader = document.getElementById("loader");
    }

    initAudio() {
        this.currentSong = 1;
        this.volume = 1;
        this.baseURL = "https://audio.jukehost.co.uk/";
        this.fileNames = [
            "mI1aacZuN0qjbyhcfRY16WPe2Y6ic8x4",
            "DmiVCHVOiJ7HF63YCD1LZW9xE3nxQuze",
            "8jri18G4pLGNn1omwFYKpX7YaiGZFK3A"
        ];

        this.songTitles = [
            "Noyz Narcos - Aspetta la Notte",
            "Pop Smoke - Invincible",
            "Kavinsky - Nightcall"
        ];

        this.audio = document.getElementById("audio");
        this.audio.addEventListener("ended", () => {
            this.audio.currentTime = 0;
        });
        this.audio.addEventListener("timeupdate", () => {
            this.progressBar.style = `transform: scaleX(${this.audio.currentTime / this.audio.duration})`;
        });
        this.audioCtx = new AudioContext();
        this.source = this.audioCtx.createMediaElementSource(this.audio);
        this.gainNode = this.audioCtx.createGain();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.92;
        this.analyser.fftSize = 2048;
        this.analyser.minDecibels = -125;
        this.analyser.maxDecibels = -10;
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        this.gainNode.gain.value = this.volume;
        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    loadAudio() {
        let request = new XMLHttpRequest();
        request.open(
            "GET",
            this.baseURL + this.fileNames[this.currentSong - 1],
            true);
        this.loader.classList.remove("hidden");
        request.responseType = "blob";
        request.onprogress = () => {
            if (request.response)
                this.playAudio(request.response);
        };
        request.send();
    }

    playAudio(data) {
        this.loader.classList.add("hidden");
        this.title.innerHTML = this.songTitles[this.currentSong - 1];
        this.audio.src = window.URL.createObjectURL(data);
        this.audio.play();
    }

    update() {

    }

    render() {
        this.tick++;
        this.analyser.getByteFrequencyData(this.freqData);
        this.update();
        window.requestAnimationFrame(this.render.bind(this));
    }
}


window.requestAnimationFrame = (() => {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        });

})();