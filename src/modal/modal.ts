import * as PIXI from "pixi.js";
import { app } from "../index";
import { Sprite } from "pixi.js";
// type Resolver<T> = (value: T) => void;

export class Modal extends PIXI.Container {
    private overlay: PIXI.Graphics;
    container: PIXI.Container;
    resolver: ((value: boolean) => void) | null = null;
    text: string = "";
    textElement: PIXI.Text | null = null;
    activeStarsList: Sprite[] = [];
    notActiveStarsList: Sprite[] = [];
    modalWidth: number;
    modalHeight: number;

    constructor(innerText: string, width = 340, height = 360) {
        super();
        this.modalWidth = width;
        this.modalHeight = height;
        this.text = innerText;
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

        this.textElement = new PIXI.Text(innerText, {
            fontSize: 32,
            fill: 0x000000,
            align: "center",
            wordWrap: true,
            wordWrapWidth: width * 0.8,
        });

        this.textElement.anchor.set(0.5);
        this.textElement.width = width * 0.9;
        this.textElement.x = width / 2;
        this.textElement.y = height / 2;

        this.container.addChild(this.textElement);

        this.visible = false;

        // window.addEventListener("resize", () => this.calculateModalSize());
    }

    open(): Promise<boolean> {
        return new Promise((resolve) => {
            this.visible = true;
            this.resolver = resolve;
            return true;
        });
    }

    close(result: boolean): void {
        this.visible = false;
        if (this.resolver !== null) {
            this.resolver(result);
            this.resolver = null;
        }
    }

    // calculateModalSize() {
    //     "resize for modal"
    // }
}
