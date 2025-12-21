import { MenuHeight } from "../const/const";
import { BtnConfig, CounterConfig, maxTimerConfig } from "../configuration/configMenu";
import configuration from "../configuration/configEnemies.json";
import { SoundManager } from "../soundManager/soundManager";
import { enemies } from "../enemy/enemiesManager";
import { app } from "../index";
import { EventEmitters } from "../eventEmitters/eventEmitters";
import { ELevel } from "../configuration/configLevel";
import Timer from "easytimer.js";

export class Menu {
    private static instance: Menu;
    onGameStart = new EventEmitters<boolean>();
    menuElement: HTMLDivElement | null = null;
    startBtn: HTMLButtonElement | null = null;
    menuItemMap = new Map<string, HTMLElement>();
    soundManager = SoundManager.getInstance();
    isStarted = false;
    isMuted = true;
    isPause = true;
    level: number = ELevel.FIRST;
    remainingRoundTime: number = maxTimerConfig[this.level];
    setIntervalId: ReturnType<typeof setInterval> | null = null;
    timer = new Timer();
    constructor() {
        this.menuElement = document.createElement("div");
        this.menuElement.classList.add("menu-wrapper");
        this.menuElement.style.height = MenuHeight + "px";
        const body = document.getElementsByTagName("body")[0];
        body.insertBefore(this.menuElement, body.firstChild);
    }
    static getInstance() {
        if (Menu.instance) {
            return this.instance;
        }
        this.instance = new Menu();
        return this.instance;
    }
    init() {
        this.createBtnStart();
        Object.values(CounterConfig).forEach((className) => {
            this.createCounter(className);
        });
        Object.values(BtnConfig).forEach((className) => {
            this.createBtn(className);
        });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.setPauseText(BtnConfig.PAUSE);
                this.pause();
            }
        });
        const counter = this.menuItemMap.get(CounterConfig.ENEMIES);
        if (counter) {
            enemies.onEnemiesCount.subscibe((enemiesCount) => {
                counter.innerText = `${Object.keys(configuration.enemies[this.level]).length} / ${enemiesCount}`;
            });
        }
        this.timer.addEventListener("secondsUpdated", () => {
            this.updCounter(CounterConfig.TIMER);
        });
    }
    createBtnStart() {
        this.startBtn = document.createElement("button");
        this.startBtn.classList.add("startBtn", "menuItem");
        this.startBtn.innerText = "START";
        this.menuElement?.appendChild(this.startBtn);
        this.startBtn.addEventListener("click", () => {
            this.menuItemMap.get(BtnConfig.PAUSE)?.classList.remove("disabled");
            const btn = this.menuItemMap.get(BtnConfig.PAUSE);
            if (btn) {
                (btn as HTMLButtonElement).disabled = false;
            }
            this.clickStartBtn();
        });
    }
    createCounter(className: string) {
        const counter = document.createElement("div");
        counter.classList.add("menuItem", "menuCounter", className);
        this.menuElement?.appendChild(counter);
        this.menuItemMap.set(className, counter);
        this.updCounter(className);
        return counter;
    }

    createBtn(className: (typeof BtnConfig)[keyof typeof BtnConfig]) {
        const btn = document.createElement("button");
        btn.classList.add("menuItem", "menuBtn", className);
        btn.innerText = className;
        btn.addEventListener("click", () => this.clickMenuBtn(className));
        this.menuItemMap.set(className, btn);
        if (className == BtnConfig.PAUSE) {
            btn.classList.add("disabled");
            btn.disabled = true;
        }
        if (className == BtnConfig.MUTE) {
            this.soundManager.muteAllSounds(this.isMuted);
            this.getMuteText(this.isMuted);
        }
        this.menuElement?.appendChild(btn);
        return btn;
    }

    clickMenuBtn(className: (typeof BtnConfig)[keyof typeof BtnConfig]) {
        const btn = this.menuItemMap.get(className);
        switch (className) {
            case BtnConfig.PAUSE:
                this.setPauseText(className);
                this.isPause ? this.restore() : this.pause();
                break;
            case BtnConfig.BOOSTER:
                break;
            case BtnConfig.MUTE:
                const soundManager = SoundManager.getInstance();
                if (btn) {
                    this.isMuted = !this.isMuted;
                    this.getMuteText(this.isMuted);
                }
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
                    if (
                        this.isStarted &&
                        !this.isPause &&
                        this.remainingRoundTime > 0 &&
                        enemies.getEnimies().length > 0
                    ) {
                        this.remainingRoundTime = maxTimerConfig[this.level] - this.timer.getTimeValues().seconds;
                    }
                    counter.innerText =
                        this.remainingRoundTime > 0 ? `${Math.floor(this.remainingRoundTime)} s` : "0 s";
                    break;
                case CounterConfig.ENEMIES:
                    counter.innerText = `${Object.keys(configuration.enemies[this.level]).length} / ${
                        enemies.getEnimies().length || 0
                    } `;
                    break;
                default:
                    console.log("unknown counter");
            }
        }
    }
    clickStartBtn() {
        enemies.initAllEnemies(this.level);
        this.updCounter(CounterConfig.ENEMIES);
        this.isPause = false;
        this.isStarted = true;
        this.timer.start();
        this.menuItemMap.get(BtnConfig.PAUSE)?.classList.remove("disabled");
        this.startBtn?.classList.toggle("hide");
        this.onGameStart.emit(true);
    }

    pause() {
        this.timer.pause();
        app.ticker.stop();
        this.setIntervalId = null;
        this.isPause = true;
        this.soundManager.muteAllSounds(true);
    }

    restore() {
        app.ticker.start();
        this.setIntervalId = setInterval(() => {
            this.updCounter(CounterConfig.TIMER);
        }, 1000);
        this.isPause = false;
        this.timer.start();
        this.soundManager.muteAllSounds(this.isMuted);
    }

    setPauseText(className: string) {
        const btn = this.menuItemMap.get(BtnConfig.PAUSE);
        if (this.isPause) {
            btn ? (btn.innerText = className) : "";
        } else {
            btn ? (btn.innerText = "restore") : "";
        }
    }
    getMuteText(isMuted: boolean) {
        const btn = this.menuItemMap.get(BtnConfig.MUTE);
        if (isMuted) {
            btn?.innerText ? (btn.innerText = "🔇") : "";
        } else {
            btn?.innerText ? (btn.innerText = "🔊") : "";
        }
    }
    setLevel(level: ELevel): void {
        this.level = level;
    }
    getRemainingTime(): number {
        return this.remainingRoundTime;
    }
    showStartBtn() {
        if (this.startBtn) {
            this.startBtn.classList.remove("hide");
        }
    }
    resetCounter() {
        this.setIntervalId = null;
        this.remainingRoundTime = maxTimerConfig[this.level];
        this.timer.reset();
        this.updCounter(CounterConfig.TIMER);
        this.updCounter(CounterConfig.ENEMIES);
    }
}

export const menu = Menu.getInstance();
