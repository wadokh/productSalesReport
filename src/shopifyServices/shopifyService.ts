import fetch from "node-fetch";
import {graphqlEndpoint, SHOPIFY_ACCESS_TOKEN} from "../utils/constants";
import { ProductResponse, ShopifyResponse, VariantResponse} from "../utils/types";

export const shopifyService = async (query: String): Promise<ShopifyResponse> => {
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

export const ProductService = async (query: String): Promise<ProductResponse> => {
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

export const VariantService = async (query: String): Promise<VariantResponse> => {
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