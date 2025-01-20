import {graphqlEndpoint, SHOPIFY_ACCESS_TOKEN} from "../utils/constants";
import {ProductResponse, OrderResponse, VariantResponse, OrderNodeResponse} from "../utils/types";
import fetch from 'node-fetch-retry';

export class ShopifyService {
    public fetchOrders = async (query: String): Promise<OrderResponse> => {
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

    public fetchLineItems = async (query: String): Promise<OrderNodeResponse> => {
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