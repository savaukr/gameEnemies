import configuration from "../configuration/configEnemies.json";
import { Enemy } from "./enemy";
import { FederatedPointerEvent } from "pixi.js";
import { SoundManager } from "../soundManager/soundManager";

export class EnemiesManager {
    enemyList: (Enemy | null)[] = [];
    private static instance: EnemiesManager;
    static getInstance() {
        if (EnemiesManager.instance) {
            return this.instance;
        }
        this.instance = new EnemiesManager();
        return this.instance;
    }

    initAllEnemies() {
        configuration.enemies.forEach((itemConfig) => {
            const enemy = new Enemy({ x: itemConfig.x, y: itemConfig.y }, itemConfig.speed);
            enemy.init();
            this.enemyList?.push(enemy);
        });
        const soundManager = SoundManager.getInstance();
        soundManager.playBg();
    }

    updEnemyList(event: FederatedPointerEvent): void {
        const indexesKilled: Set<number> = new Set<number>();
        this?.enemyList?.forEach(async (enemy, ind) => {
            if (enemy?.kill(event)) {
                indexesKilled.add(ind);
                enemy = null;
            }
        });
        this.enemyList = this.enemyList?.filter((_, ind) => !indexesKilled.has(ind));
        console.log(this?.enemyList);
    }

    run(): void {
        this.enemyList?.forEach((enemy) => {
            enemy?.run();
        });
    }

    update() {
        this.run();
    }
}
export const enemies = EnemiesManager.getInstance();
