import { Howl } from "howler";

export class SoundManager {
    private static instance: SoundManager;
    soundBg: Howl | null = null;
    soundKill: Howl | null = null;
    constructor() {
        this.soundBg = new Howl({
            src: ["assets/sounds/BGM_main_loop.wav"],
            autoplay: true,
            loop: true,
            volume: 0.4,
            // onend: function () {
            //     console.log("BG sound finished!");
            // },
        });
        this.soundKill = new Howl({
            src: ["assets/sounds/kill2.wav"],
            autoplay: true,
            loop: false,
            volume: 1,
            // onend: function () {
            //     console.log("Kill sound finished!");
            // },
        });
    }

    static getInstance() {
        if (SoundManager.instance) {
            return this.instance;
        }
        this.instance = new SoundManager();
        return this.instance;
    }

    playBg() {
        this.soundBg?.play();
    }
    playSoundKill() {
        this.soundKill?.play();
    }

    muteAllSounds(isMuted: boolean) {
        Howler.mute(isMuted);
    }
}
