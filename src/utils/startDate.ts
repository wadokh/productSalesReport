export const startDate: string = (() => {
    const date: Date = new Date();
    date.setDate(date.getDate() - 90);
    return date.toISOString();
})();