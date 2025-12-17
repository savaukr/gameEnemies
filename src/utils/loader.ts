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
    window.addEventListener("resize", () => calculateCanvasSize(background));
}
