class AudioManager {

    static async adjustVolume(
        element,
        newVolume,
        duration = 1000,
        interval = 13,
        easing = AudioManager.swing,
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
        this.render();
        window.onresize = () => {
            this.resize();
        };
    }

    initCanvas() {
        this.tick = 0;
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
            console.log("click")
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
            "DmiVCHVOiJ7HF63YCD1LZW9xE3nxQuze",
            "mI1aacZuN0qjbyhcfRY16WPe2Y6ic8x4",
            "8jri18G4pLGNn1omwFYKpX7YaiGZFK3A"
        ];

        this.songTitles = [
            "Pop Smoke - Invincible",
            "Noyz Narcos - Aspetta la Notte",
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

    async loadAudio() {
        return await fetch(this.baseURL + this.fileNames[this.currentSong - 1], {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        })
            .then((response) => response.blob())
            .then((data) => {
                this.loader.classList.remove("hidden");
                this.playAudio(data);
            })
            .catch((exception) => console.error(exception))
    }

    playAudio(data) {
        this.loader.classList.add("hidden");
        this.title.innerHTML = this.songTitles[this.currentSong - 1];
        this.audio.src = window.URL.createObjectURL(data);
        this.audio.play();
    }

    async nextAudio() {
        this.currentSong = this.currentSong > 1 ?
            this.currentSong - 1 :
            this.fileNames.length;
        await this.loadAudio();
    }

    async previousAudio() {
        this.currentSong = this.currentSong < this.fileNames.length ?
            this.currentSong + 1 :
            1;
        await this.loadAudio();
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