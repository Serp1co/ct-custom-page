class Audioplayer {
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
}
