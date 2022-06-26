class FadeInLoop {
    ctx;
    audioBuffer;
    gainNode;
    isPlaying = true;
  
    constructor(ctx, url) {
      this.ctx = ctx;
      this.audioBuffer = fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer));
  
      this.gainNode = ctx.createGain();
      this.gainNode.connect(ctx.destination);
    }
  
    async start() {
      this.isPlaying = true;
      const source = ctx.createBufferSource();
      this.source = source;
      source.addEventListener('ended', e => {
        if (this.isPlaying) { // repeat unless stop() was called
          this.start();
        }
      })
  
      source.connect(this.gainNode);
      source.buffer = await this.audioBuffer;
      const now = this.ctx.currentTime;
      this.gainNode.gain.setValueAtTime(Number.EPSILON, now);
      this.gainNode.gain.exponentialRampToValueAtTime(1, now + 0.055);
      source.start(0);
    }
  
    async stop() {
      this.isPlaying = false;
      this.source?.stop();
    }
  }
  
  function switch_audio(exit_loop, entry_loop) {
    exit_loop.stop().then(() => entry_loop.start());
  }

  const ctx = new AudioContext({ latencyHint: 'interactive' })
  const first_loop = new FadeInLoop(ctx, 'https://audio.jukehost.co.uk/jdWaU4FggWzEnDzqrXbwVt5p1ZByzlqq')  
  const second_loop = new FadeInLoop(ctx, 'https://audio.jukehost.co.uk/jdWaU4FggWzEnDzqrXbwVt5p1ZByzlqq')  
  const third_loop = new FadeInLoop(ctx, 'https://audio.jukehost.co.uk/jdWaU4FggWzEnDzqrXbwVt5p1ZByzlqq')  