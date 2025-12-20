import configuration from "../configuration/configEnemies.json";
import { Enemy } from "./enemy";
import { FederatedPointerEvent } from "pixi.js";
import { SoundManager } from "../soundManager/soundManager";
import { EventEmitters } from "../eventEmitters/eventEmitters";
import { menu } from "../menu/menu";
import { ELevel } from "../configuration/configLevel";

export class EnemiesManager {
    onEnemiesCount = new EventEmitters<number>();
    private enemyList: (Enemy | null)[] = [];
    private static instance: EnemiesManager;
    isStart: boolean = false;
    level: number = ELevel.FIRST;

    static getInstance() {
        if (EnemiesManager.instance) {
            return this.instance;
        }
        this.instance = new EnemiesManager();
        return this.instance;
    }
    subscribOnStart() {
        menu.onGameStart.subscibe((isStart) => {
            this.isStart = isStart;
        });
    }

    initAllEnemies(level: ELevel = ELevel.FIRST) {
        this.level = level;
        configuration.enemies.forEach((itemConfig) => {
            const enemy = new Enemy({ x: itemConfig.x, y: itemConfig.y }, itemConfig.speed);
            enemy.updCurrentLevel(level);
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
        this.onEnemiesCount.emit(this.enemyList.length);
    }

    run(): void {
        this.enemyList?.forEach((enemy) => {
            enemy?.run();
        });
    }

    update() {
        if (this.isStart) {
            this.run();
        }
    }
    getEnimies() {
        return this.enemyList;
    }
    removeAllEnmies() {
        this.enemyList = [];
    }
}
export const enemies = EnemiesManager.getInstance();
