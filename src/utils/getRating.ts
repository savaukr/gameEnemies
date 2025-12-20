import { ERating } from "../modal/modalWIn";
import { maxTimerConfig } from "../configuration/configMenu";
import { ELevel } from "../configuration/configLevel";

export function getRating(timeRemaining: number, level: ELevel): ERating {
    let rating: ERating = ERating.FIRST;
    if (timeRemaining >= (maxTimerConfig[level] * 1) / 3) {
        rating = ERating.SECOND;
    }
    if (timeRemaining >= (maxTimerConfig[level] * 2) / 3) {
        rating = ERating.THIRD;
    }
    return rating;
}
