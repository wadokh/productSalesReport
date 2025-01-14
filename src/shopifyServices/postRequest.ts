import fetch from "node-fetch";
import {graphqlEndpoint, SHOPIFY_ACCESS_TOKEN} from "./shopifyConnection";
import {ShopifyResponse} from "../types";

export const postRequest = async (query: String): Promise<ShopifyResponse> => {
     const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query }),
    });
     return response.json();
}