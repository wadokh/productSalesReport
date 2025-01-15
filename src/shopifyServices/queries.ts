import {firstLimit} from "../utils/constants";
import {optionsLimit} from "../utils/constants";

export const productsQuery = (cursor, startDate) => {
    return `
      query {
        orders(first: ${firstLimit}, after: ${cursor ? `"${cursor}"` : null}, query: "created_at:>=${startDate}") {
          edges {
            node {
              createdAt
              lineItems(first: ${firstLimit}) {
                edges {
                  node {
                    product {
                      id
                      title
                    }
                    quantity
                    originalUnitPriceSet{
                      presentmentMoney{
                        amount
                      }
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

export const variantsQuery = (cursor, startDate) => {
    return `
query {
    orders(first: ${firstLimit}, after: ${cursor ? `"${cursor}"` : null}, query: "created_at:>=${startDate}") {
        edges {
            node {
                createdAt
                lineItems(first: ${firstLimit}) {
                    edges {
                        node {
                            quantity
                            product {
                                id
                                title
                                options(first: ${optionsLimit}) {
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