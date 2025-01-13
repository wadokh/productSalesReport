"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlEndpoint = exports.SHOPIFY_ACCESS_TOKEN = exports.SHOPIFY_STORE_URL = void 0;
require("dotenv/config");
exports.SHOPIFY_STORE_URL = (_a = process.env, _a.SHOPIFY_STORE_URL), exports.SHOPIFY_ACCESS_TOKEN = _a.SHOPIFY_ACCESS_TOKEN;
exports.graphqlEndpoint = "https://".concat(exports.SHOPIFY_STORE_URL, "/admin/api/2025-01/graphql.json");
