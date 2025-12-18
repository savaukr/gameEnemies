import * as PIXI from "pixi.js";
import { app } from "../index";
import { getModaltyle } from "./style";

export class Modal extends PIXI.Container {
    private overlay: PIXI.Graphics;
    private container: PIXI.Container;

    constructor(innerText: string, width = 500, height = 350) {
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

        closeBtn.on("pointerdown", () => this.close());

        this.container.addChild(closeBtn);

        const text = new PIXI.Text(innerText, {
            fontSize: 32,
            fill: 0x000000,
        });

        text.anchor.set(0.5);
        text.x = width / 2;
        text.y = height / 2;
        text.style = getModaltyle(this.width);

        this.container.addChild(text);

        this.visible = false;
        window.addEventListener("resize", () => this.calculateModalSize());
    }

    open() {
        this.visible = true;
    }

    close() {
        this.visible = false;
    }

    calculateModalSize() {
        // const { width: canvasWidth, height: canvasHeight } = getCanvasSize();
        // if (canvasWidth < this.width) {
        //     this.container.scale.set(canvasWidth / this.width);
        // }
        // if (canvasHeight < this.height) {
        //     this.container.scale.set(canvasHeight / this.height);
        // }
        // // this.container.width = canvasWidth > this.width ? this.width : canvasWidth * 0.8;
        // // this.container.width = canvasHeight > this.height ? this.height : canvasHeight * 0.8;
        // this.container.x = app.screen.width / 2;
        // this.container.y = app.screen.height / 2;
        // this.container.pivot.set(this.container.width / 2, this.container.height / 2);
        // this.overlay.width = app.screen.width;
        // this.overlay.height = app.screen.height;
    }
}
