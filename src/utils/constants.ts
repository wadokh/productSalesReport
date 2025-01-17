import 'dotenv/config';

export const { SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN } = process.env;
export const graphqlEndpoint = `https://${SHOPIFY_STORE_URL}/admin/api/2025-01/graphql.json`;
export const numberOfMillis = 1000 * 60 * 60 * 24;
export const daysInMonth = 30;
export const daysInOneAndHalfMonth = 45;
export const daysIn3Month = 90;
export const firstLimit = 250;
export const oneLimit = 1;
export const optionsLimit = 3;
export const variantsLimit = 2000;