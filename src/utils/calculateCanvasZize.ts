import { Sprite } from "pixi.js";
import { app } from "../index";
const offsetX = 100;
const offsetY = 100;
export const calculateCanvasSize = (background: Sprite): { width: number; height: number } => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setBackgroundSize(width, height, background);
    return { width, height };
};

async function setBackgroundSize(width: number, height: number, background: Sprite): Promise<void> {
    background.position.x = -offsetX / 2;
    background.position.y = -offsetX / 2;
    background.width = width < height ? height : width + offsetX;
    background.height = width >= height ? width : height + offsetY;
}

export function getCanvasSize(): { width: number; height: number } {
    return { width: app.screen?.width, height: app.screen?.height };
}
