import {firstLimit, variantsLimit} from "../utils/constants";
import {optionsLimit} from "../utils/constants";

export const orderQuery = (cursor: string | null, startDate: string, itemCursor: string | null) => {
    return `
    query{
  orders(first: ${firstLimit}, after: ${cursor ? `"${cursor}"` : null}, query: "created_at:>=${startDate}"}) {
    nodes{
      id
      lineItems(first: ${firstLimit}, after: ${itemCursor ? `"${itemCursor}"` : null}){
        nodes{
          originalUnitPriceSet{
            presentmentMoney{
              amount
            }
          }
          product{
            id
            title
          }
          variant{
            id
            title
          }
        }
        pageInfo{
          hasNextPage
          endCursor
        }
      }
    }
    pageInfo{
      hasNextPage
      endCursor
    }
  }
}
`
}

export const allVariantsQuery = (id: string) => {
    return `
    query {
  product(id: "${id}") {
    title
    description
    variantsCount{
      count
    }
    variants(first: ${variantsLimit} ){
      nodes{
        id
        
      }
    }
  }
}`
}

export const productsQuery = (cursor: string | null, startDate: string) => {
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