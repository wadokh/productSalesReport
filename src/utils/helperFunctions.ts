import {PageInfo, salesRev} from "./types";
import {daysIn3Month, daysInMonth, daysInOneAndHalfMonth, numberOfMillis} from "./constants";

export const handlePageInfo = (pageInfo: PageInfo): [boolean, string | null] => {
    return [pageInfo.hasNextPage, pageInfo.endCursor];
}

export const handleSalesRev = (now: Date, sales: salesRev, revenue: salesRev, orderDate: Date, quantity: number, price: number): void => {
    const timeDiffInDays: number = (now.getTime() - orderDate.getTime()) / numberOfMillis;
    if (timeDiffInDays <= daysInMonth) {
        sales[daysInMonth] += quantity;
        revenue[daysInMonth] += quantity*price;
    }
    if (timeDiffInDays <= daysInOneAndHalfMonth) {
        sales[daysInOneAndHalfMonth] += quantity;
        revenue[daysInOneAndHalfMonth] += quantity*price;
    }
    if (timeDiffInDays <= daysIn3Month) {
        sales[daysIn3Month] += quantity;
        revenue[daysIn3Month] += quantity*price;
    }
}