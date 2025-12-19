import { enemies } from "./enemy/enemiesManager";
import { ELevel } from "./configuration/configLevel";
import { maxTimerConfig } from "./configuration/configMenu";
import { app } from "./index";
import { loadAssets, setBackground } from "./utils/loader";
import { Assets } from "pixi.js";
import { menu } from "./menu/menu";
import { Modal } from "./modal/modal";
import { modalTextes } from "./configuration/configModal";

export async function gameFlow() {
    try {
        await loadAssets();
        if (Assets.resolver.hasBundle("game-screen")) {
            setBackground();
            enemies.initAllEnemies(ELevel.FIRST);
            menu.init();
        }
    } catch (error) {
        console.log("ERROR", error);
    }
    let resolver: (value: unknown) => void;
    let waiter = new Promise((resolve) => {
        resolver = resolve;
    });
    let isWin,
        isLose = false;
    let isStartNextLevel = false;
    let isRepeatLevel = false;

    app.stage.eventMode = "static";
    app.stage.cursor = "default";
    app.stage.on("pointerdown", (event) => {
        resolver(event);
        enemies?.updEnemyList(event);
        waiter = new Promise((resolve) => {
            resolver = resolve;
        });
    });

    let isStarted: boolean = false;
    let level: ELevel = ELevel.FIRST;
    let timeRemaining: number = maxTimerConfig[level];

    const modalLose: Modal = new Modal(modalTextes.loseModal.text);
    const modalWin: Modal = new Modal(modalTextes.winModal.text);
    app.stage.addChild(modalLose);
    app.stage.addChild(modalWin);

    (async (): Promise<void> => {
        while (true) {
            await waiter;
            timeRemaining = menu.getRemainingTime();
            console.log("game function timeRemaining=", timeRemaining);
            console.log("isStarted=", isStarted);
            isWin = enemies.getEnimies().length ? false : true;
            if (isWin) {
                isStartNextLevel = await modalWin.open();
                console.log("isStartNextLevel=", isStartNextLevel);
                isWin = false;
            }
            if (isStartNextLevel) {
                level < ELevel.THIRD ? level++ : "";
                menu.setLevel(level);
                enemies.initAllEnemies(level);
                isStarted = true;
                isStartNextLevel = false;
            }
            if (isLose) {
                isRepeatLevel = await modalLose.open();
                isLose = false;
            }
            if (isRepeatLevel) {
                enemies.initAllEnemies(level);
                isRepeatLevel = false;
                isStarted = true;
            }
        }
    })();
}
