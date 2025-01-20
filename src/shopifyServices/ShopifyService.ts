import {graphqlEndpoint, SHOPIFY_ACCESS_TOKEN} from "../utils/constants";
import { ProductResponse, ShopifyResponse, VariantResponse} from "../utils/types";
import fetch from 'node-fetch-retry';
import {errorOptions as options} from "../utils/types";
export class ShopifyService {
    public fetchOrders = async (query: String): Promise<ShopifyResponse> => {
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            retry: 3,
            pause: 1000,
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query }),
        });
        return response.json();
    }

    public fetchProducts = async (query: String): Promise<ProductResponse> => {
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            retry: 3,
            pause: 1000,
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query }),
        });
        return response.json();
    }

    public fetchVariants = async (query: String): Promise<VariantResponse> => {
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            retry: 3,
            pause: 1000,
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query }),
        });
        return response.json();
    }
}