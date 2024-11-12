import { gql } from "@apollo/client";

// Query to retrieve an existing user and their lists, expect to update once the list functions have been determined

export const GET_ME = gql`
query Me {
    me {
        _id
        email
        firstName
        lists {
            _id
            listName
            recipients {
                _id
                firstName
                lastName
                    products {
                        itemId
                        itemName
                        price
                        mainImage
                        buyUrl
                    }
                }
            }
        }
    }
`;

export const GET_EBAY_PRODUCTS = gql`
query GetEbayProducts($product: String) {
getEbayProducts(product: $product) {
    itemId
    itemName
    itemCondition
    price
    mainImage
    additionalImages
    buyUrl
    sellerFeedBackPercentage
    sellerUserName
}
}
`;

export const GET_MY_LISTS = gql`
query GetMyLists {
  getMyLists {
    _id
    listName
    recipients {
      _id
      firstName
      lastName
      products {
        itemId
      }
    }
  }
}
`;

export const GET_MY_RECIPIENTS = gql`
query GetMyRecipients {
  getMyRecipients {
      _id
      firstName
      lastName
    products {
      itemId
      itemName
      price
      mainImage
      buyUrl
      itemCondition
      sellerUserName
      sellerFeedBackPercentage
    }
  }
}
`;
