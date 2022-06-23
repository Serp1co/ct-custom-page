class FadeInLoop {
  ctx;
  loopsAudioBuffers = [];
  gainNode;
  isPlaying = true;
  sources = [];

  constructor(ctx, urls) {
    this.ctx = ctx;
    urls.forEach((url) => fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .finally((audioData)=>  this.loopsAudioBuffers.concat(audioData)));
    this.gainNode = ctx.createGain();
    this.gainNode.connect(ctx.destination);
  }

  async start(index, ramp=0.65) {
    console.log("starting");
    this.isPlaying = true;
    const source = ctx.createBufferSource();
    this.sources[index] = source;
    source.addEventListener("ended", (e) => {
      if (this.isPlaying) {
        // repeat unless stop() was called
        this.start();
      }
    });
    source.connect(this.gainNode);
    source.buffer = await this.loopsAudioBuffers[index];
    const now = this.ctx.currentTime;
    this.gainNode.gain.setValueAtTime(Number.EPSILON, now);
    this.gainNode.gain.exponentialRampToValueAtTime(1, now + 0.65);
    source.start(0);
    console.log("started" + source.buffer.length);
  }

  stop(ramp=0.65) {
    const now = this.ctx.currentTime;
    this.gainNode.gain.exponentialRampToValueAtTime(0, now + 0.65);
    this.isPlaying = false;
    setTimeout(()=>this.source?.stop(), now + 0.65);
  }
}

const ctx = new AudioContext({ latencyHint: "interactive" });
const loop = new FadeInLoop(
  ctx,
  [
    "https://audio.jukehost.co.uk/jdWaU4FggWzEnDzqrXbwVt5p1ZByzlqq",
    "https://audio.jukehost.co.uk/1RLMWXMhzmy4NyKje72QygsKrL4dqQJ9",
    "https://audio.jukehost.co.uk/wCUNMulbMuR4u7hwMvnd5FjarS1mELvZ",
  ]
);
