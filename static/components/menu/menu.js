class CookieCutter {
    static getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = document.cookie;
        let ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}

class Menu {
    constructor(audiomanager, background) {
        this.startBtn = document.querySelector("#startbtn");
        this.menunav = document.querySelector("#menu-nav");
        this.startBtn.addEventListener("mouseover", _ => {
            if (this.menunav.classList.contains("hidden"))
                return;
            audiomanager.effectManager.playAudio("nav");
        })
        this.startBtn.addEventListener("click", () => {
            if (this.menunav.classList.contains("hidden"))
                return;
            audiomanager.effectManager.playAudio("ok");
            this.menunav.classList.add("hidden");
            document.querySelector("#section").classList.remove("hidden");
            audiomanager.musicManager.audioCtx.resume().then(_ => {
                audiomanager.musicManager.loadAudio().then(() => {
                    background.loop();
                    document.querySelector("#section").classList.remove("hidden");
                });
            })
        })
    }
}