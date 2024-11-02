import { gql } from "@apollo/client";

// mutation to log in an existing user

export const LOGIN_USER = gql`
mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
    token
    user {
        _id
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
                    }
                }
            }
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
	mutation createList($listName: listName) {
		createList(listName: $listName) {
			_id
			username
			savedLists {
				listName
			}
		}
	}
`;