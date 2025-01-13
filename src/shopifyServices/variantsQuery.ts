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
                            quantity
                            product {
                                id
                                title
                                options(first: ${queryLimits.optionsLimit}) {
                                  name
                                  values
                                }
                            }
                            variant{
                              id
                              displayName
                              price
                              title
                              inventoryQuantity
                            }
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