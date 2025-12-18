import { Application, Assets } from "pixi.js";
import "./style.css";
import { loadAssets, setBackground } from "./utils/loader";
import { gameLoop } from "./gameLoop";
import { enemies } from "./enemy/enemiesManager";
import { menu } from "./menu/menu";
import { Modal } from "./modal/modal";
import { loseModal } from "./configuration/configModal";

declare global {
    interface Window {
        __PIXI_APP__?: Application;
    }
}

export const app = new Application<HTMLCanvasElement>({
    background: "#2b2846",
    resizeTo: window,
});

window.__PIXI_APP__ = app;

document.body.appendChild(app.view);

try {
    loadAssets().then(() => {
        if (Assets.resolver.hasBundle("game-screen")) {
            setBackground();
            enemies.initAllEnemies();
            menu.init();
            const modal = new Modal(loseModal.text);
            app.stage.addChild(modal);

            // modal.open();
        }
    });
} catch (error) {
    console.log("ERROR", error);
}
app.stage.eventMode = "static";
app.stage.cursor = "default";
app.stage.on("pointerdown", (event) => {
    enemies?.updEnemyList(event);
});
app.ticker.add(() => {
    try {
        gameLoop(enemies);
    } catch (err) {
        console.log("ERROR", err);
    }
});
