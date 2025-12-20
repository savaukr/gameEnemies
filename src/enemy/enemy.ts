import { TPosition, TSpeed } from "../types/types";
import { Assets, FederatedPointerEvent, Sprite, Texture } from "pixi.js";
import { app } from "../index";
import { getCanvasSize } from "../utils/calculateCanvasZize";
import { EnymeHeight, EnymeWidth, maxSpeed } from "../const/const";
import { random } from "../utils/getRandom";
import { SoundManager } from "../soundManager/soundManager";
import { ELevel } from "../configuration/configLevel";

export class Enemy {
    enemy: Sprite | null = null;
    position: TPosition = {
        x: getCanvasSize().width - (this.enemy?.width || 100),
        y: getCanvasSize().height - (this.enemy?.height || 100),
    };
    speed: TSpeed = { x: 1, y: -1 };
    timeInterval = Date.now();
    currentLevel: ELevel = ELevel.FIRST;

    constructor(position: TPosition, speed: { x: number; y: number }) {
        this.position = position;
        this.speed = speed;
    }

    init() {
        const enemyTexture: Texture = Assets.get("enemy");
        const enemy: Sprite = Sprite.from(enemyTexture);
        enemy.position = this.position;
        enemy.anchor.set(0);
        // enemy.zIndex = 10;
        app.stage.addChild(enemy);
        enemy.eventMode = "static";
        enemy.cursor = "cell";
        this.enemy = enemy;
    }

    kill(event: FederatedPointerEvent): boolean {
        const isKilled =
            this.enemy &&
            event.x > this.enemy.position.x &&
            event.x < this.enemy.position.x + EnymeWidth &&
            event.y > this.enemy.position.y &&
            event.y < this.enemy.position.y + EnymeHeight;
        if (isKilled) {
            this.enemy?.parent.removeChild(this.enemy);
            this.killingSound(isKilled);
            return true;
        }
        return false;
    }

    run(): void {
        this.updSpeed();
        if (this.enemy) {
            const x = this.enemy.position.x;
            const y = this.enemy.position.y;
            const canvasSize = getCanvasSize();

            if (x < 0) {
                this.enemy.position.x = canvasSize.width;
            } else if (x > canvasSize.width) {
                this.enemy.position.x = 0;
            } else {
                this.enemy.position.x = x + this.speed.x;
            }

            if (y < 0) {
                this.enemy.position.y = canvasSize.height;
            } else if (y > canvasSize.height) {
                this.enemy.position.y = 0;
            } else {
                this.enemy.position.y = y + this.speed.y;
            }
        }
    }

    killingSound(isKilled: boolean | null): void {
        if (isKilled) {
            const soundManager = SoundManager.getInstance();
            soundManager.playSoundKill();
        }
    }

    updSpeed() {
        if (this.timeInterval + random(2000, 3000) > Date.now()) {
            return;
        }
        this.speed = {
            x: random(-maxSpeed, maxSpeed) * this.currentLevel,
            y: random(-maxSpeed, maxSpeed) * this.currentLevel,
        };
        this.timeInterval = Date.now();
    }

    updCurrentLevel(level?: number): void {
        if (level) {
            this.currentLevel = level;
        } else {
            this.currentLevel = this.currentLevel > 1 ? this.currentLevel-- : 1;
        }
    }
}
