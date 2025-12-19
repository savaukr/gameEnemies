import { Application } from "pixi.js";
import "./style.css";
import { gameLoop } from "./gameLoop";
import { enemies } from "./enemy/enemiesManager";
import { gameFlow } from "./gameFlow";

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

gameFlow();
app.ticker.add(() => {
    try {
        gameLoop(enemies);
    } catch (err) {
        console.log("ERROR", err);
    }
});
