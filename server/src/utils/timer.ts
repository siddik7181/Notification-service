

export const randomDelayLessThenMs = (time: number) => {
    return Math.ceil(randomLessThen1() * time);
}

export const randomLessThen1 = () => {
    return Math.random() + Number.EPSILON;
}
