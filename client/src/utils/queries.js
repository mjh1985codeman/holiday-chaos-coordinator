import { gql } from "@apollo/client";

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
                itemName
                price
            }
        }
    }
}
`;

export const GET_LIST_BY_ID = gql`
query GetListById($listId: ID!) {
    getListById(listId: $listId) {
        _id
        listName
        listUser
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
                itemCondition
            }
        }
    }
}
`;

export const GET_RECIPIENT_BY_ID = gql`
query GetRecipientById($recId: ID!) {
    getRecipientById(recId: $recId) {
        _id
        firstName
        lastName
        listId
        products {
            itemId
            itemName
            price
            mainImage
            buyUrl
            itemCondition
            sellerUserName
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
