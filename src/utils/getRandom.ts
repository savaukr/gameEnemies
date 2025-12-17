export const random = (min: number, max: number): number => {
    if (min % 1 > 0 || max % 1 > 0) {
        throw Error("Function does not support numbers with fractions. For number below 1 use randomBelowOne instead");
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
