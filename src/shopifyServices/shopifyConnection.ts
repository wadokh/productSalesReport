import 'dotenv/config';

export const { SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN } = process.env;
export const graphqlEndpoint = `https://${SHOPIFY_STORE_URL}/admin/api/2025-01/graphql.json`;
