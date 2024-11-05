const { User, List } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { getProducts, getProductByItemId } = require("../utils/ebayapi");

const resolvers = {
	Query: {
		// pull specific user
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({ _id: context.user._id })
					.select("-__v -password")
				return userData;
			}

			throw new AuthenticationError("You are not logged in");
		},

		getEbayProducts: async (parent, args) => {
				const eBayData = await getProducts(args);
				const {itemSummaries} = eBayData;
				const products = [];
				itemSummaries.forEach(item => {
					const productDetails = {
						itemId: item.itemId,
						itemName: item.title,
						price: item.price.value,
						mainImage: item.image.imageUrl,
						additionalImages: item.additionalImages ? item.additionalImages.map((image) => image.imageUrl) : [],
						buyUrl: item.itemWebUrl,
						sellerUserName: item.seller.username,
						sellerFeedBackPercentage: item.seller.feedbackPercentage,
						itemCondition: item.condition,
						cartValue: false
					};
					if(productDetails) {
						products.push(productDetails);
					}
				})
				return products;
		},
		
		getEbayItemByItemId: async (parent, {itemId}) => {
			const eBayData = await getProductByItemId(itemId);
			console.log('ebayData: ' , eBayData);
			const productDetails = {
				itemId: eBayData.itemId,
				itemName: eBayData.title,
				price: eBayData.price.value,
				mainImage: eBayData.image.imageUrl,
				additionalImages: eBayData.additionalImages ? eBayData.additionalImages.map((image) => image.imageUrl) : [],
				buyUrl: eBayData.itemWebUrl,
				sellerUserName: eBayData.seller.username,
				sellerFeedBackPercentage: eBayData.seller.feedbackPercentage,
				itemCondition: eBayData.condition,
				cartValue: false
			};
			return productDetails;
		}
	},

	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},

		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError("Incorrect Credentials");
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError("Incorrect Credentials");
			}

			const token = signToken(user);
			return { token, user };
		},

		createList: async (parent, {listName}, context) => {
			if (context) {
				//TODO: create the list here first and then get the id and push it to the user.  
				const newList = await List.create({
					listName,
					listUser: context.user._id
				});
				if(newList) {
					await User.findOneAndUpdate(
						{ _id: context.user._id },
						{ $push: { lists: newList._id } },
						{ new: true }
					);
					return newList;
				} else {
					throw new Error("Unable to create List.");
				}
			}
			throw new AuthenticationError("Not Logged In");
		},
	},
};

module.exports = resolvers;
