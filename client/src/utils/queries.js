import { gql } from "@apollo/client";

// Query to retrieve an existing user and their lists, expect to update once the list functions have been determined

export const GET_ME = gql`
	{
		me {
			_id
			firstname
			lastname
			username
			email
			savedProducts {
				itemId
				itemName
				price
				imgUrl
				buyUrl
				description
				listTag
				cartValue
			}
			cartProducts {
				itemId
				itemName
				price
				imgUrl
				buyUrl
				description
				listTag
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
    cartValue
}
}
`;
