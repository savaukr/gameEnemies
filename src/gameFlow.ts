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
            console.log("level= ", level);
            timeRemaining = menu.getRemainingTime();
            isWin = !enemies.getEnimies().length && timeRemaining > 0 ? true : false;
            isLose = enemies.getEnimies().length && timeRemaining <= 0 ? true : false;
            if (isWin && level === ELevel.THIRD) {
                modalWin.setText(modalTextes.winModalAbs.text);
            }
            if (isWin) {
                rating = getRating(timeRemaining, level);
                modalWin.updLevelRating(rating);
                isStartNextLevel = await modalWin.open();
                modalWin.resetRating();
            }
            if (isStartNextLevel) {
                level < ELevel.THIRD ? level++ : "";
                menu.setLevel(level);
                enemies.removeAllEnmies();
                enemies.initAllEnemies(level);
                menu.resetCounter();
                isStartNextLevel = false;
                isWin = false;
            } else {
                if (isWin) {
                    enemies.removeAllEnmies();
                    isWin = false;
                    level = ELevel.FIRST;
                    menu.setLevel(level);
                    menu.resetCounter();
                    menu.showStartBtn();
                }
            }
            if (isLose) {
                enemies.removeAllEnmies();
                isRepeatLevel = await modalLose.open();
            }
            if (isRepeatLevel) {
                menu.resetCounter();
                enemies.initAllEnemies(level);
                isRepeatLevel = false;
                isLose = false;
            } else {
                if (isLose) {
                    menu.resetCounter();
                    isLose = false;
                    menu.showStartBtn();
                }
            }
        }
    })();
}
