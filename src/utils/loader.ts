import { Assets, Sprite, Texture } from "pixi.js";
import { calculateCanvasSize } from "./calculateCanvasZize";
import { app } from "../index";

export async function loadAssets(): Promise<void> {
    await Assets.init({ manifest: "../assets/manifest.json" });
    await Assets.loadBundle(["game-screen", "sounds"]);
}

export function setBackground() {
    const backgroundTexture: Texture = Assets.get("background"); // Це Texture
    const background: Sprite = Sprite.from(backgroundTexture);
    app.stage.addChild(background);
    calculateCanvasSize(background);
    let time = 0;
    const startX = background.x;
    const startY = background.y;
    app.ticker.add((delta) => {
        time += 0.05 * delta;
        background.x = startX + Math.sin(time) * 20;
        background.y = startY + Math.cos(time * 0.5) * 10;
    });
    window.addEventListener("resize", () => calculateCanvasSize(background));
}
