import { gql } from "@apollo/client";

// mutation to log in an existing user

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

// mutation to add new users
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