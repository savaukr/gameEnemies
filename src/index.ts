import { Application, Assets } from "pixi.js";
import "./style.css";
import { loadAssets, setBackground } from "./utils/loader";
import { gameLoop } from "./gameLoop";
import { Enemies } from "./enemy/enemies";

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

let enemies: Enemies | null = null;
try {
    loadAssets().then(() => {
        if (Assets.resolver.hasBundle("game-screen")) {
            setBackground();
            enemies = new Enemies();
            enemies.initAllEnemies();
            console.log(enemies.enemyList);
        }
    });
} catch (error) {
    console.log("ERROR", error);
}
app.stage.eventMode = "static";
app.stage.cursor = "default";
app.stage.on("pointerdown", (event) => {
    console.log("Клік на canvas:", event.global.x, event.global.y);
    enemies?.updEnemyList(event);
});
app.ticker.add(() => {
    try {
        if (enemies) {
            gameLoop(enemies);
        }
    } catch (err) {
        console.log("ERROR", err);
    }
});
