
// Test to check it returns a whole number less than the input
export const randomDelayLessThenMs = (time: number) => {
    return Math.ceil(Math.random() + Number.EPSILON * time);
}

export const randomLessThen1 = () => {
    return Math.random();
}
