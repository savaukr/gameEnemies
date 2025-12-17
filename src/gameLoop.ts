import { Enemies } from "./enemy/enemies";

export function gameLoop(enemies: Enemies) {
    // console.log("ok");
    enemies.update();
}
