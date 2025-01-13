"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlquery = void 0;
var queryLimits_1 = require("../utils/queryLimits");
var graphqlquery = function (cursor, startDate) {
    return "\n      query {\n        orders(first: ".concat(queryLimits_1.queryLimits.firstLimit, ", after: ").concat(cursor ? "\"".concat(cursor, "\"") : null, ", query: \"created_at:>=").concat(startDate, "\") {\n          edges {\n            node {\n              createdAt\n              lineItems(first: ").concat(queryLimits_1.queryLimits.firstLimit, ") {\n                edges {\n                  node {\n                    product {\n                      id\n                      title\n                      priceRangeV2{\n                        maxVariantPrice{\n                          amount\n                          currencyCode\n                        }\n                        minVariantPrice{\n                          amount\n                          currencyCode\n                        }\n                      }\n                    }\n                    quantity\n                  }\n                }\n              }\n            }\n          }\n          pageInfo {\n            hasNextPage\n            endCursor\n          }\n        }\n      }\n    ");
};
exports.graphqlquery = graphqlquery;
