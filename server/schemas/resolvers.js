const { User, List, Recipient } = require("../models");
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

		getMyLists: async (parent, args, context) => {
			if(context.user) {
				const listData = await List.find({listUser: context.user._id});
				return listData;
			} else {
				throw Error("You Must Be Logged In to get your lists!!!")
			}
		},

		getMyRecipients: async (parent, args, context) => {
			if(context.user) {
				const userLists = await List.find({ listUser: context.user._id });
				const recipientIds = userLists.flatMap(list => list.recipients);
				const recipientData = await Recipient.find({ _id: { $in: recipientIds } }).populate("products");


				// const recArray = [];
				// if(recipientData) {
				// 	recipientData.forEach(listObj => {
				// 		listObj.recipients.forEach(rec => {
				// 			console.log('rec: ' , rec);
				// 			recArray.push({
				// 				recId: rec._id,
				// 				firstName: rec.firstName,
				// 				lastName: rec.lastName
				// 			})
				// 		});
				// 	})
				// }
				// console.log('recArray: ' , recArray);
				return recipientData;
			} else {
				throw Error("You Must Be Logged In to get your lists!!!")
			}
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

		listAddToOneRec(parent, {listId, ebayItemId, recId}, context) {
			if(!context.user) {
				throw new AuthenticationError("You must be logged in to complete this action.");
			}

			const listBelongsToUser = List.findOne({
				listUser: context.user._id,
				_id: listId
			});

			if(!listBelongsToUser) {
				throw new AuthenticationError("You do not own this list!");
			}
			const updatedList = List.findOneAndUpdate({
				//TODO part.
			})
		}, 

		createRecipient: async (parent, {firstName, lastName, listId}, context) => {
			if(!context.user) {
				throw new AuthenticationError("You must be logged in to complete this action.")
			};

			const listBelongsToUser = await List.findOne({
				listUser: context.user._id,
				_id: listId
			});

			if(!listBelongsToUser) {

				throw new AuthenticationError("You do not own this list!");

			} else {
				const newRecipient = await Recipient.create({
					firstName,
					lastName
				});

				if(!newRecipient) {
					throw new Error("Error creating Recipient.");
				};

				const updatedList = await List.findByIdAndUpdate(
					{_id: listId},
					{$push: {recipients: newRecipient._id}},
					{new: true}	
				);
				if(updatedList) {
					return updatedList;
				} else {
					throw new Error("Unable to add new recipient to list.");
				}
			}
		}
	},
};

module.exports = resolvers;
