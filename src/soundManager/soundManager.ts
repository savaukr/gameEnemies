import { Howl } from "howler";

export class SoundManager {
    constructor() {
        this.soundBg = new Howl({
            src: ["assets/sounds/BGM_main_loop.wav"],
            autoplay: true,
            loop: true,
            volume: 0.2,
            onend: function () {
                console.log("Finished!");
            },
        });
        this.soundKill = new Howl({
            src: ["assets/sounds/kill2.wav"],
            autoplay: true,
            loop: false,
            volume: 1,
            onend: function () {
                console.log("Finished!");
            },
        });
    }
    private static instance: SoundManager;
    soundBg: Howl | null = null;
    soundKill: Howl | null = null;

    static getInstance() {
        if (SoundManager.instance) {
            return this.instance;
        }
        this.instance = new SoundManager();
        return this.instance;
    }

    playBg() {
        const id1 = this.soundBg?.play();
        console.log("sound id1: ", id1);
    }
    playSoundKill() {
        const id1 = this.soundKill?.play();
        console.log("sound id: ", id1);
    }
}
