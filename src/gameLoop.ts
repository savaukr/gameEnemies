import { EnemiesManager } from "./enemy/enemiesManager";

export function gameLoop(enemies: EnemiesManager) {
    enemies.update();
}
