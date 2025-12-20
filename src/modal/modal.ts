import * as PIXI from "pixi.js";
import { app } from "../index";
import { Assets, Sprite, Texture } from "pixi.js";
// type Resolver<T> = (value: T) => void;

export class Modal extends PIXI.Container {
    private overlay: PIXI.Graphics;
    private container: PIXI.Container;
    resolver: ((value: boolean) => void) | null = null;
    stars: Sprite[] = [];

    constructor(innerText: string, width = 340, height = 360) {
        super();
        this.width = width;
        this.height = height;
        this.overlay = new PIXI.Graphics()
            .beginFill(0x000000, 0.8)
            .drawRect(0, 0, app.screen.width, app.screen.height)
            .endFill();

        this.overlay.interactive = true; // блокує кліки
        this.addChild(this.overlay);

        this.container = new PIXI.Container();
        this.container.x = app.screen.width / 2;
        this.container.y = app.screen.height / 2;
        this.container.pivot.set(width / 2, height / 2);
        this.addChild(this.container);

        const bg = new PIXI.Graphics().beginFill(0x9bbbd8).drawRoundedRect(0, 0, width, height, 16).endFill();

        this.container.addChild(bg);

        const closeBtn = new PIXI.Text("✕", {
            fontSize: 24,
            fill: 0x000000,
        });

        closeBtn.x = width - 32;
        closeBtn.y = 12;
        closeBtn.interactive = true;
        closeBtn.cursor = "pointer";

        closeBtn.on("pointerdown", () => this.close(false));
        this.container.addChild(closeBtn);

        const noBtn = new PIXI.Text(" NO", {
            fontSize: 24,
            fill: 0x4b001d,
        });
        noBtn.x = width / 2 - 120;
        noBtn.y = height - 60;
        noBtn.interactive = true;
        noBtn.cursor = "pointer";
        noBtn.on("pointerdown", () => this.close(false)); // true
        this.container.addChild(noBtn);

        const yesBtn = new PIXI.Text("YES", {
            fontSize: 24,
            fill: 0x10412f,
        });
        yesBtn.x = width / 2 + 65;
        yesBtn.y = height - 60;
        yesBtn.interactive = true;
        yesBtn.cursor = "pointer";
        yesBtn.on("pointerdown", () => this.close(true)); // true
        this.container.addChild(yesBtn);

        const text = new PIXI.Text(innerText, {
            fontSize: 32,
            fill: 0x000000,
            align: "center",
            wordWrap: true,
            wordWrapWidth: width * 0.8,
        });

        text.anchor.set(0.5);
        text.x = width / 2;
        text.y = height / 2;

        this.container.addChild(text);

        this.visible = false;
        this.createStars();
        // window.addEventListener("resize", () => this.calculateModalSize());
    }

    open(): Promise<boolean> {
        return new Promise((resolve) => {
            this.visible = true;
            console.log("open modal");
            this.resolver = resolve;
            return true;
        });
    }

    close(result: boolean): void {
        this.visible = false;
        console.log("close modal");
        if (this.resolver !== null) {
            this.resolver(result);
            this.resolver = null;
        }
    }

    createStar(assetKey: string): Sprite {
        const starTexture: Texture = Assets.get(assetKey);
        const star: Sprite = Sprite.from(starTexture);
        app.stage.addChild(star);
        star.cursor = "default";
        return star;
    }
    createStars() {
        [0, 1, 2].forEach(() => {
            const star = this.createStar("activeStar");
            this.container.addChild(star);
        });
    }

    // calculateModalSize() {
    //     "resize for modal"
    // }
}
