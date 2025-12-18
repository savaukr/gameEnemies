import { EnemiesManager } from "./enemy/enemiesManager";

export function gameLoop(enemies: EnemiesManager) {
    // console.log("ok");
    enemies.update();
}
