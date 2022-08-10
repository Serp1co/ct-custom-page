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
    static _can_play = true;
    static _muted = false;
    static _instance;

    constructor(background, glitch, effectManager, musicManager) {
        this.btnList = document.querySelectorAll(".menu-item-btn");
        this.btnList.forEach(e => {
            e.addEventListener("mouseover", _ => {
                if (!Menu._can_play && Menu._muted)
                    return;
                effectManager.playAudio("nav");
            });
            e.addEventListener("click", _ => {
                if (!Menu._can_play && Menu._muted)
                    return;
                effectManager.playAudio("ok");
                Menu._can_play = false;
            });
        })
        this.ashleyBtn = document.querySelector("#aslheybtn");
        this.menunav = document.querySelector("#menu-nav");
        this.ashleyBtn.addEventListener("click", () => {
            if (this.menunav.classList.contains("hidden"))
                return;
            this.menunav.classList.add("hidden");
            document.querySelector("#ashley").classList.remove("hidden");
            document.querySelector("#backgroundcanvas").classList.remove("hidden");
            background.draw();
            musicManager.audioCtx.resume().then(_ => {
                musicManager.loadAudio().then(() => {
                    glitch.start();
                });
            })
        })
    }
}