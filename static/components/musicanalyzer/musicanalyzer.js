class MusicAnalyzer {
    constructor(canvas, width, height, audiomanager) {
        this.w = canvas.width = width;
        this.h = canvas.height = height;
        this.ctx = canvas.getContext('2d');
        let musicmanager = audiomanager.musicManager;
        this.analyser = musicmanager.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
        musicmanager.source.connect(this.analyser);
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.ctx.clearRect(0, 0, width, height);
    }

    draw(stroke = 'rgb(125, 0, 0)', line_width = 2) {
        let drawVisual = requestAnimationFrame(this.draw.bind(this, stroke, line_width));
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.lineWidth = line_width;
        this.ctx.strokeStyle = stroke;
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
        this.ctx.stroke();

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