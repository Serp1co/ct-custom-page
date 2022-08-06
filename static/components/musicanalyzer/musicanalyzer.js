class MusicAnalyzer {
    constructor(canvas, width, height, audiomanager) {
        this.w = canvas.width = width;
        this.h = canvas.height = height;
        this.ctx = canvas.getContext('2d');
        let musicmanager = audiomanager.musicManager;
        this.analyser = musicmanager.audioCtx.createAnalyser();
        musicmanager.source.connect(this.analyser);
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.ctx.clearRect(0, 0, width, height);
    }

    draw() {
        let drawVisual = requestAnimationFrame(this.draw.bind(this));
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'rgb(125, 0, 0)';
        this.ctx.beginPath();
        const sliceWidth = this.w * 1.0 / this.bufferLength;
        let x = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = v * this.h/2;
            if(i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        this.ctx.lineTo(this.w, this.h/2);
        this.ctx.stroke();
    }

    reset() {

    }
}

class ParticleManager {
    particles = [];
    constructor(particle_n) {
        this.particles = [...Array(particle_n).keys()].map(() => new Particle());
    }
}

class Particle {

    constructor() {
    }

    reset() {
    }

    step() {
    }

}