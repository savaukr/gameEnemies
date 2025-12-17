import { Sprite } from "pixi.js";
import { app } from "../index";

export const calculateCanvasSize = (background: Sprite): { width: number; height: number } => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setBackgroundSize(width, height, background);
    return { width, height };
};

async function setBackgroundSize(width: number, height: number, background: Sprite): Promise<void> {
    background.width = width < height ? height : width;
    background.height = width >= height ? width : height;
}

export function getCanvasSize(): { width: number; height: number } {
    return { width: app.screen?.width, height: app.screen?.height };
}
