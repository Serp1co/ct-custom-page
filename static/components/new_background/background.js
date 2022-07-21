class Coreographer {

    static particleamount = 101;
    particlesArray = [];
    ctx;

    constructor(canvas) {
        this.generateParticles(Coreographer.particleamount);
        this.canvas = canvas;
        if (canvas.getContext) {
            this.ctx = canvas.getContext('2d');
            // drawing code here
        } else {
            throw ("Canvas not supported");
        }
    }

    loop() {
        requestAnimationFrame(this.loop.bind(this));
        //this.particlesArray.forEach((particle) => particle.render(this.context));
    }

    generateParticles(amount) {
        for (let i = 0; i < amount; i++) {
            this.particlesArray[i] = new Particle(this);
        }
    }

}

class Particle {
    constructor(background, strokeColor) {
        this.background = background;
        this.strokeColor = strokeColor;
        this.x = 0;
        this.y = 0;
    }

    render(ctx) {
    }

}