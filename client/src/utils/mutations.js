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
mutation ($firstname: String!, $email: String!, $password: String!) {
addUser(firstname: $firstname, email: $email, password: $password) {
    token
    user {
        _id
    }
}
}
`;

export const CREATE_LIST = gql`
mutation Mutation($listName: String!) {
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


export const CREATE_RECIPIENT = gql`
mutation CreateRecipient($firstName: String!, $lastName: String!, $listId: ID!) {
  createRecipient(firstName: $firstName, lastName: $lastName, listId: $listId) {
    _id
    listName
  }
}
`;

