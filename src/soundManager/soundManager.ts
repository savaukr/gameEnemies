import { Howl } from "howler";

export class SoundManager {
    constructor() {}
    private static instance: SoundManager;

    static getInstance() {
        if (SoundManager.instance) {
            return this.instance;
        }
        this.instance = new SoundManager();
        return this.instance;
    }

    playBg() {
        const sound = new Howl({
            src: ["assets/sounds/BGM_main_loop.wav"],
            autoplay: true,
            loop: true,
            volume: 1,
            onend: function () {
                console.log("Finished!");
            },
        });
        const id1 = sound.play();
        console.log("sound id1: ", id1);
    }
    playSound(soundName: string) {
        const sound = new Howl({
            src: [soundName],
            autoplay: true,
            loop: false,
            volume: 1,
            onend: function () {
                console.log("Finished!");
            },
        });
        const id1 = sound.play();
        console.log("sound id: ", id1);
    }
}
