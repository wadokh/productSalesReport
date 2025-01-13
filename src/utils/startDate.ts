export const startDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() - 90);
    return date.toISOString();
})();