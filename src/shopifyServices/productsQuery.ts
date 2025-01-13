import {queryLimits} from "../utils/queryLimits";

export const graphqlquery = (cursor, startDate) => {
    return `
      query {
        orders(first: ${queryLimits.firstLimit}, after: ${cursor ? `"${cursor}"` : null}, query: "created_at:>=${startDate}") {
          edges {
            node {
              createdAt
              lineItems(first: ${queryLimits.firstLimit}) {
                edges {
                  node {
                    product {
                      id
                      title
                      priceRangeV2{
                        maxVariantPrice{
                          amount
                          currencyCode
                        }
                        minVariantPrice{
                          amount
                          currencyCode
                        }
                      }
                    }
                    quantity
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;
}