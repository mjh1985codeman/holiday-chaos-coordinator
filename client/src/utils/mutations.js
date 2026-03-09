import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            firstName
        }
    }
}
`;

export const ADD_USER = gql`
mutation ($firstName: String!, $email: String!, $password: String!) {
    addUser(firstName: $firstName, email: $email, password: $password) {
        token
        user {
            _id
        }
    }
}
`;

export const CREATE_LIST = gql`
mutation CreateList($listName: String!) {
    createList(listName: $listName) {
        _id
        listName
        listUser
        recipients {
            _id
        }
    }
}
`;

export const UPDATE_LIST = gql`
mutation UpdateList($listId: ID!, $listName: String!) {
    updateList(listId: $listId, listName: $listName) {
        _id
        listName
        recipients {
            _id
            firstName
            lastName
        }
    }
}
`;

export const DELETE_LIST = gql`
mutation DeleteList($listId: ID!) {
    deleteList(listId: $listId) {
        _id
        listName
    }
}
`;

export const CREATE_RECIPIENT = gql`
mutation CreateRecipient($firstName: String!, $lastName: String!, $listId: ID!) {
    createRecipient(firstName: $firstName, lastName: $lastName, listId: $listId) {
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

export const UPDATE_RECIPIENT = gql`
mutation UpdateRecipient($recId: ID!, $firstName: String, $lastName: String) {
    updateRecipient(recId: $recId, firstName: $firstName, lastName: $lastName) {
        _id
        firstName
        lastName
    }
}
`;

export const DELETE_RECIPIENT = gql`
mutation DeleteRecipient($recId: ID!, $listId: ID!) {
    deleteRecipient(recId: $recId, listId: $listId) {
        _id
        firstName
        lastName
    }
}
`;

export const ADD_ITEM_TO_REC = gql`
mutation AddItemToRec($recId: ID!, $ebayItemId: String!) {
    addItemToRec(recId: $recId, ebayItemId: $ebayItemId) {
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
`;

export const ADD_ITEM_TO_ALL_RECS_ON_LIST = gql`
mutation AddItemToAllRecsOnList($listId: ID!, $ebayItemId: String!) {
    addItemToAllRecsOnList(listId: $listId, ebayItemId: $ebayItemId) {
        _id
        listName
        recipients {
            _id
            firstName
            products {
                itemId
                itemName
                price
            }
        }
    }
}
`;

export const REMOVE_ITEM_FROM_REC = gql`
mutation RemoveItemFromRec($recId: ID!, $itemId: String!) {
    removeItemFromRec(recId: $recId, itemId: $itemId) {
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
`;
