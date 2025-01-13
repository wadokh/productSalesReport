"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var productsQuery_1 = require("./shopifyServices/productsQuery");
var startDate_1 = require("./utils/startDate");
var prismaOperations_1 = require("./dbServices/prismaOperations");
var postRequest_1 = require("./shopifyServices/postRequest");
var timeValues_1 = require("./utils/timeValues");
var cursor = null;
var hasNextPage = true;
var productSales = {};
while (hasNextPage) {
    var query = (0, productsQuery_1.graphqlquery)(cursor, startDate_1.startDate);
    try {
        var data = await (0, postRequest_1.postRequest)(query);
        console.log(data);
        var orders = data.data.orders.edges;
        for (var _i = 0, orders_1 = orders; _i < orders_1.length; _i++) {
            var order = orders_1[_i];
            var orderDate = new Date(order.node.createdAt);
            var now = new Date();
            for (var _a = 0, _b = order.node.lineItems.edges; _a < _b.length; _a++) {
                var item = _b[_a];
                var productId = item.node.product.id;
                var quantity = item.node.quantity;
                var minprice = parseFloat(item.node.product.priceRangeV2.minVariantPrice.amount);
                var maxprice = parseFloat(item.node.product.priceRangeV2.maxVariantPrice.amount);
                if (!productSales[productId]) {
                    productSales[productId] = { salesIn30Days: 0, salesIn45Days: 0, salesIn90Days: 0, minprice: minprice, maxprice: maxprice };
                }
                var timeDiffInDays = (now - orderDate) / (timeValues_1.timeValues.numberOfMillis);
                if (timeDiffInDays <= timeValues_1.timeValues.daysInMonth) {
                    productSales[productId].salesIn30Days += quantity;
                }
                if (timeDiffInDays <= timeValues_1.timeValues.daysInOneAndHalfMonth) {
                    productSales[productId].salesIn45Days += quantity;
                }
                if (timeDiffInDays <= timeValues_1.timeValues.daysIn3Month) {
                    productSales[productId].salesIn90Days += quantity;
                }
                console.log("Product ID: ".concat(productId, ", Quantity: ").concat(quantity, ", Days Since Order: ").concat(timeDiffInDays));
            }
        }
        hasNextPage = data.data.orders.pageInfo.hasNextPage;
        cursor = data.data.orders.pageInfo.endCursor;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        break;
    }
}
for (var productId in productSales) {
    var _c = productSales[productId], salesIn30Days = _c.salesIn30Days, salesIn45Days = _c.salesIn45Days, salesIn90Days = _c.salesIn90Days, minprice = _c.minprice, maxprice = _c.maxprice;
    var minrevenueIn30Days = salesIn30Days * minprice;
    var minrevenueIn45Days = salesIn45Days * minprice;
    var minrevenueIn90Days = salesIn90Days * minprice;
    var maxrevenueIn30Days = salesIn30Days * maxprice;
    var maxrevenueIn45Days = salesIn45Days * maxprice;
    var maxrevenueIn90Days = salesIn90Days * maxprice;
    try {
        (0, prismaOperations_1.prismaUpsert)(productId, salesIn30Days, salesIn45Days, salesIn90Days, minprice, maxprice, minrevenueIn30Days, minrevenueIn45Days, maxrevenueIn90Days, minrevenueIn90Days, maxrevenueIn30Days, maxrevenueIn45Days)
            .then(function () {
            console.log('Sales data successfully stored in the database!');
        });
    }
    catch (error) {
        console.error('Error inserting data:', error);
    }
}
