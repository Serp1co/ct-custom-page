class FadeInLoop {
    ctx;
    audioBuffer;
    gainNode;
    isPlaying = true;
  
    constructor(ctx, url) {
      this.ctx = ctx;
      this.audioBuffer = get_audio_buffer(url);
      this.gainNode = ctx.createGain();
      this.gainNode.connect(ctx.destination);
    }
    
    async get_audio_buffer(url) {
        return await fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer));
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
      source.buffer = this.audioBuffer;
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
    if(exit_loop.isPlaying && !entry_loop.isPlaying)
        exit_loop.stop().then(() => entry_loop.start());
  }