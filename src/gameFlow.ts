import { enemies } from "./enemy/enemiesManager";
import { ELevel } from "./configuration/configLevel";
import { app } from "./index";
import { loadAssets, setBackground } from "./utils/loader";
import { Assets } from "pixi.js";
import { menu } from "./menu/menu";

import { modalTextes } from "./configuration/configModal";
import { ERating, ModalWin } from "./modal/modalWIn";
import { Modal } from "./modal/modal";
import { getRating } from "./utils/getRating";

export async function gameFlow() {
    try {
        await loadAssets();
        if (Assets.resolver.hasBundle("game-screen")) {
            setBackground();
            menu.init();
        }
    } catch (error) {
        console.log("ERROR", error);
    }
    let resolver: (value: unknown) => void;
    let waiterClick = new Promise((resolve) => {
        resolver = resolve;
    });

    app.stage.eventMode = "static";
    app.stage.cursor = "default";
    app.stage.on("pointerdown", (event) => {
        resolver(event);
        enemies?.updEnemyList(event);
        waiterClick = new Promise((resolve) => {
            resolver = resolve;
        });
    });

    let level: ELevel = ELevel.FIRST;
    let rating: ERating = ERating.ZERO;
    let timeRemaining: number;
    let isWin,
        isLose = false;
    let isStartNextLevel = false;
    let isRepeatLevel = false;
    const modalLose: Modal = new Modal(modalTextes.loseModal.text);
    const modalWin: ModalWin = new ModalWin(modalTextes.winModal.text);
    app.stage.addChild(modalLose);
    app.stage.addChild(modalWin);
    enemies.subscribOnStart();

    (async (): Promise<void> => {
        while (true) {
            await waiterClick;
            timeRemaining = menu.getRemainingTime();
            isWin = enemies.getEnimies().length && timeRemaining >= 0 ? false : true;
            if (isWin) {
                rating = getRating(timeRemaining, level);
                modalWin.updLevelRating(rating);
                isStartNextLevel = await modalWin.open();
                modalWin.resetRating();
                isWin = false;
            }
            if (isStartNextLevel) {
                level < ELevel.THIRD ? level++ : "";
                menu.setLevel(level);
                enemies.removeAllEnmies();
                enemies.initAllEnemies(level);
                menu.resetCounter();
                isStartNextLevel = false;
            }
            if (isLose) {
                isRepeatLevel = await modalLose.open();
                isLose = false;
            }
            if (isRepeatLevel) {
                enemies.initAllEnemies(level);
                menu.resetCounter();
                isRepeatLevel = false;
            }
            if ((!isStartNextLevel && !isRepeatLevel && !enemies.getEnimies().length) || timeRemaining <= 0) {
                enemies.removeAllEnmies();
                menu.resetCounter();
                menu.showStartBtn();
            }
        }
    })();
}
