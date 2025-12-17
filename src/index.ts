import { Application, Assets } from "pixi.js";
import "./style.css";
import { loadAssets, setBackground } from "./utils/loader";

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
        }
    });
} catch (error) {
    console.log("ERROR", error);
}

function gameLoop() {
    console.log("ok");
}

app.ticker.add(() => {
    try {
        gameLoop();
    } catch (err) {
        console.log("ERROR", err);
    }
});
