import fetch from "node-fetch";
import {graphqlEndpoint, SHOPIFY_ACCESS_TOKEN} from "./shopifyConnection";

export const postRequest = async (query) => {
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