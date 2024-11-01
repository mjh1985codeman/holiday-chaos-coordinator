// import the gql tagged template function
const { gql } = require("apollo-server-express");

// create our typeDefs
const typeDefs = gql`
	type User {
		_id: ID!
		firstName: String
		email: String
		password: String
		lists: [List]
	}

	type Product {
		itemId: ID!
		itemName: String!
		price: String!
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
		firstName: String
		lastName: String
		products: [Product]
	}

	type Query {
		me: User
		getMyLists(userId: ID!): [List]
		getEbayProducts(product: String): [Product]
		getEbayItemByItemId(itemId: String): Product
	}

	type Auth {
		token: ID!
		user: User
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		addUser(firstname: String!, email: String!, password: String!): Auth
		createList(listName: String!): List
		createRecipient(firstName: String!, lastName: String!): Recipient
	}
`;

// export the typeDefs
module.exports = typeDefs;
