import { Modal } from "./modal";
import { Assets, Sprite, Texture } from "pixi.js";

export enum ERating {
    ZERO = 0,
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
}
enum EStars {
    ACTIVE_STAR = "activeStar",
    NOT_ACTIVE_STAR = "notActiveStar",
}

export class ModalWin extends Modal {
    constructor(innerText: string, width = 340, height = 360) {
        super(innerText, width, height);
        this.createStars(EStars.ACTIVE_STAR);
        this.createStars(EStars.NOT_ACTIVE_STAR);
    }
    createStar(assetKey: EStars): Sprite {
        const starTexture: Texture = Assets.get(assetKey);
        const star: Sprite = Sprite.from(starTexture);
        star.cursor = "default";
        return star;
    }
    createStars(assetKey: EStars) {
        for (let ind = 0; ind < 3; ind++) {
            const star = this.createStar(assetKey);
            star.position.x = this.container.width / 2 + ind * 50 + 20 - 90;
            star.position.y = 10;
            star.zIndex = 10;
            if (assetKey == EStars.NOT_ACTIVE_STAR) {
                this.notActiveStarsList.push(star);
            }
            if (assetKey == EStars.ACTIVE_STAR) {
                this.activeStarsList.push(star);
            }
            this.container.addChild(star);
        }
    }

    updLevelRating(rating: ERating) {
        this.notActiveStarsList.forEach((star, ind) => {
            if (rating > ind) {
                star.visible = false;
            }
        });
    }

    resetRating() {
        this.notActiveStarsList.forEach((star) => {
            star.visible = true;
        });
    }
}
