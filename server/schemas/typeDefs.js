const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type User {
		_id: ID!
		firstName: String
		email: String
		password: String
		lists: [List]
	}

	type Product {
		itemId: String
		itemName: String
		price: String
		mainImage: String
		additionalImages: [String]
		buyUrl: String
		sellerUserName: String
		sellerFeedBackPercentage: String
		itemCondition: String
	}

	type List {
		_id: ID!
		listName: String!
		listUser: ID!
		recipients: [Recipient]
	}

	type Recipient {
		_id: ID!
		listId: ID
		firstName: String
		lastName: String
		products: [Product]
	}

	type Query {
		me: User
		getMyLists: [List]
		getListById(listId: ID!): List
		getRecipientById(recId: ID!): Recipient
		getEbayProducts(product: String): [Product]
		getEbayItemByItemId(itemId: String): Product
		getMyRecipients: [Recipient]
	}

	type Auth {
		token: ID!
		user: User
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		addUser(firstName: String!, email: String!, password: String!): Auth
		createList(listName: String!): List
		updateList(listId: ID!, listName: String!): List
		deleteList(listId: ID!): List
		createRecipient(firstName: String!, lastName: String!, listId: ID!): List
		updateRecipient(recId: ID!, firstName: String, lastName: String): Recipient
		deleteRecipient(recId: ID!, listId: ID!): Recipient
		addItemToRec(recId: ID!, ebayItemId: String!): Recipient
		addItemToAllRecsOnList(listId: ID!, ebayItemId: String!): List
		removeItemFromRec(recId: ID!, itemId: String!): Recipient
	}
`;

module.exports = typeDefs;
