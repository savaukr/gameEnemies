import configuration from "../configuration/config.json";
import { Enemy } from "./enemy";
import { FederatedPointerEvent } from "pixi.js";
import { SoundManager } from "../soundManager/soundManager";

export class Enemies {
    enemyList: (Enemy | null)[] = [];
    constructor() {}

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
