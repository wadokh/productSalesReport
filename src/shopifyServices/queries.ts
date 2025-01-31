import {firstLimit, variantsLimit} from "../utils/constants";
import {optionsLimit} from "../utils/constants";

export const OrderQuery = (cursor: string | null, startDate: string) => {
    return `
        query{
          orders(first: ${firstLimit}, after: ${cursor ? `"${cursor}"` : null}, query: "created_at:>=${startDate}"){
            pageInfo{
              hasNextPage
              endCursor
            }
            nodes{
              id
              createdAt
            }
          }
        }
    `
}

export const lineItemsQuery = (orderId: string , itemCursor: string | null) => {
    return `
    query{
  order(id: "${orderId}"){
    lineItems(first: ${firstLimit}, after: ${itemCursor ? `"${itemCursor}"` : null}){
      pageInfo{
          hasNextPage
          endCursor
        }
        nodes{
          quantity
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
    }
  }
}
`

}

export const allProductsQuery = (cursor: string | null) => {
    return `
    query{
      products(first: ${firstLimit}, after: ${cursor ? `"${cursor}"` : null} ){
        nodes{
          id
          title
          options(first: ${optionsLimit}) {
            name
            values
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
    variants(first: ${variantsLimit} ){
      nodes{
        id
        displayName
        inventoryQuantity
        price
      }
    }
  }
}`
}
