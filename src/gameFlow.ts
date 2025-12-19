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
            enemies.initAllEnemies();
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

    app.stage.eventMode = "static";
    app.stage.cursor = "default";
    app.stage.on("pointerdown", (event) => {
        resolver(event);
        enemies?.updEnemyList(event);
        waiter = new Promise((resolve) => {
            resolver = resolve;
        });
    });

    const isStarted: boolean = false;
    const level: ELevel = ELevel.FIRST;
    const timeRemaining: number = maxTimerConfig[level];

    const modalLose: Modal = new Modal(modalTextes.loseModal.text);
    const modalWin: Modal = new Modal(modalTextes.winModal.text);
    app.stage.addChild(modalLose);
    app.stage.addChild(modalWin);

    (async (): Promise<void> => {
        while (true) {
            await waiter;
            console.log("game function  isStarted=", isStarted, "  timeRemaining=", timeRemaining);
            console.log("level=", level);
            if (isWin) {
                await modalWin.open();
                isWin = false;
            }
            if (isLose) {
                await modalLose.open();
                isLose = false;
            }
        }
    })();
}
