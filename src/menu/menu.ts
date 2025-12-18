import { MenuHeight } from "../const/const";
import { BtnConfig, CounterConfig, maxTimerConfig } from "../configuration/configMenu";
import { app } from "../index";
import { SoundManager } from "../soundManager/soundManager";

export class Menu {
    menuElement: HTMLDivElement | null = null;
    startBtn: HTMLButtonElement | null = null;
    menuItemMap = new Map<string, HTMLElement>();
    isMuted = true;
    isPause = true;
    level: number = 0;
    // currentTime: number = 0;
    prevTime: number = 0;
    pauseTime: number = 0;
    remainingTime: number = maxTimerConfig[this.level];
    setIntervalId: ReturnType<typeof setInterval> | null = null;
    constructor() {
        this.menuElement = document.createElement("div");
        this.menuElement.classList.add("menu-wrapper");
        this.menuElement.style.height = MenuHeight + "px";
        const body = document.getElementsByTagName("body")[0];
        body.insertBefore(this.menuElement, body.firstChild);
    }
    init() {
        this.createBtnStart();
        Object.values(CounterConfig).forEach((className) => {
            this.menuItemMap.set(className, this.createCounter(className));
        });
        Object.values(BtnConfig).forEach((className) => {
            this.menuItemMap.set(className, this.createBtn(className));
        });
        // const tempThis = this;
        const soundManager = SoundManager.getInstance();
        soundManager.muteAllSounds(this.isMuted);
        console.log(this.menuItemMap);
    }
    createBtnStart() {
        this.startBtn = document.createElement("button");
        this.startBtn.classList.add("startBtn", "menuItem");
        this.startBtn.innerText = "START";
        this.menuElement?.appendChild(this.startBtn);
        this.startBtn.addEventListener("click", () => this.clickStartBtn());
    }
    createCounter(className: string) {
        const counter = document.createElement("div");
        counter.classList.add("menuItem", "menuCounter", className);
        this.menuElement?.appendChild(counter);
        this.menuItemMap.set(className, counter);
        this.updCounter(className);
        return counter;
    }

    createBtn(className: string) {
        const btn = document.createElement("button");
        btn.classList.add("menuItem", "menuBtn", className);
        btn.innerText = className;
        this.menuElement?.appendChild(btn);
        btn.addEventListener("click", () => this.clickMenuBtn(className));
        if (className == BtnConfig.MUTE) {
            if (this.isMuted) {
                btn.innerText = "🔇";
            } else {
                btn.innerText = "🔊";
            }
        }
        return btn;
    }

    clickMenuBtn(className: string) {
        const btn = this.menuItemMap.get(className);
        switch (className) {
            case BtnConfig.PAUSE:
                if (this.isPause) {
                    btn ? (btn.innerText = className) : "";
                    this.restore();
                } else {
                    btn ? (btn.innerText = "restore") : "";
                    this.pause();
                }
                break;
            case BtnConfig.BOOSTER:
                break;
            case BtnConfig.MUTE:
                const soundManager = SoundManager.getInstance();
                if (this.isMuted) {
                    btn?.innerText ? (btn.innerText = "🔊") : "";
                } else {
                    btn?.innerText ? (btn.innerText = "🔇") : "";
                }
                this.isMuted = !this.isMuted;
                soundManager.muteAllSounds(this.isMuted);
                break;
            default:
                console.log("unknown menu item ");
        }
    }
    updCounter(className: string) {
        const counter = this.menuItemMap.get(className);
        if (counter) {
            switch (className) {
                case CounterConfig.TIMER:
                    if (!this.isPause && this.remainingTime > 0) {
                        this.remainingTime =
                            maxTimerConfig[this.level] - (Date.now() - this.prevTime - this.pauseTime) / 1000;
                    }
                    counter.innerText = this.remainingTime > 0 ? `${Math.floor(this.remainingTime)} s` : "0 s";
                    console.log("this.prevTime=", this.prevTime / 1000);
                    console.log("this.pauseTime=", this.pauseTime / 1000);
                    console.log(`${Math.floor(this.remainingTime)} s`);
                    break;
                case CounterConfig.ENEMIES:
                    counter.innerText = "enemies:";
                    break;
                default:
                    console.log("unknown counter");
            }
        }
        console.log("update counter", className);
    }
    clickStartBtn() {
        this.isPause = false;
        this.prevTime = Date.now();
        this.setIntervalId = setInterval(() => {
            this.updCounter(CounterConfig.TIMER);
        }, 1000);
        this.startBtn?.classList.toggle("hide");
        console.log("click start btn");
    }

    pause() {
        app.ticker.stop();
        this.setIntervalId = null;
        this.isPause = true;
        this.pauseTime = Date.now();
    }

    restore() {
        app.ticker.start();
        this.setIntervalId = setInterval(() => {
            this.updCounter(CounterConfig.TIMER);
        }, 1000);
        this.isPause = false;
        this.pauseTime = Date.now() - this.pauseTime;
    }

    updTimer() {
        // if (this.prevTime) this.currentTime = Date.now() - this.prevTime;
    }
}
