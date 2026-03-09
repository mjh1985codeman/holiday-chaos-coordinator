const { User, List, Recipient } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { getProducts, getProductByItemId } = require("../utils/ebayapi");

function requireAuth(context) {
	if (!context.user) {
		throw new AuthenticationError("You must be logged in.");
	}
}

async function fetchEbayProduct(ebayItemId) {
	const itemData = await getProductByItemId(ebayItemId);
	if (!itemData) {
		throw new Error("Unable to fetch product from eBay.");
	}
	return {
		itemId: itemData.itemId,
		itemName: itemData.title,
		price: itemData.price?.value ?? "0.00",
		mainImage: itemData.image?.imageUrl ?? "",
		buyUrl: itemData.itemWebUrl,
		sellerUsername: itemData.seller?.username ?? "Unknown",
		sellerFeedBackPercentage: itemData.seller?.feedbackPercentage ?? "0",
		itemCondition: itemData.condition ?? "Not specified",
	};
}

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			requireAuth(context);
			const userData = await User.findOne({ _id: context.user._id })
				.select("-__v -password")
				.populate({
					path: "lists",
					populate: { path: "recipients" }
				});
			return userData;
		},

		getMyLists: async (parent, args, context) => {
			requireAuth(context);
			return List.find({ listUser: context.user._id })
				.populate("recipients");
		},

		getListById: async (parent, { listId }, context) => {
			requireAuth(context);
			const list = await List.findOne({ _id: listId, listUser: context.user._id })
				.populate("recipients");
			if (!list) {
				throw new Error("List not found.");
			}
			return list;
		},

		getRecipientById: async (parent, { recId }, context) => {
			requireAuth(context);
			const recipient = await Recipient.findById(recId);
			if (!recipient) {
				throw new Error("Recipient not found.");
			}
			return recipient;
		},

		getMyRecipients: async (parent, args, context) => {
			requireAuth(context);
			const userLists = await List.find({ listUser: context.user._id });
			const recipientIds = userLists.flatMap(list => list.recipients);
			return Recipient.find({ _id: { $in: recipientIds } });
		},

		getEbayProducts: async (parent, args) => {
			const eBayData = await getProducts(args);
			const { itemSummaries } = eBayData;
			if (!itemSummaries) return [];
			return itemSummaries
				.filter(item => item.image?.imageUrl)
				.map(item => ({
					itemId: item.itemId,
					itemName: item.title,
					price: item.price?.value ?? "0.00",
					mainImage: item.image.imageUrl,
					additionalImages: item.additionalImages
						? item.additionalImages.map(img => img.imageUrl)
						: [],
					buyUrl: item.itemWebUrl,
					sellerUserName: item.seller?.username ?? "Unknown",
					sellerFeedBackPercentage: item.seller?.feedbackPercentage ?? "0",
					itemCondition: item.condition ?? "Not specified",
				}));
		},

		getEbayItemByItemId: async (parent, { itemId }) => {
			const eBayData = await getProductByItemId(itemId);
			return {
				itemId: eBayData.itemId,
				itemName: eBayData.title,
				price: eBayData.price?.value ?? "0.00",
				mainImage: eBayData.image?.imageUrl ?? "",
				additionalImages: eBayData.additionalImages
					? eBayData.additionalImages.map(img => img.imageUrl)
					: [],
				buyUrl: eBayData.itemWebUrl,
				sellerUserName: eBayData.seller?.username ?? "Unknown",
				sellerFeedBackPercentage: eBayData.seller?.feedbackPercentage ?? "0",
				itemCondition: eBayData.condition ?? "Not specified",
			};
		},
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

		createList: async (parent, { listName }, context) => {
			requireAuth(context);
			const newList = await List.create({
				listName,
				listUser: context.user._id
			});
			await User.findOneAndUpdate(
				{ _id: context.user._id },
				{ $push: { lists: newList._id } },
				{ new: true }
			);
			return newList;
		},

		updateList: async (parent, { listId, listName }, context) => {
			requireAuth(context);
			const updated = await List.findOneAndUpdate(
				{ _id: listId, listUser: context.user._id },
				{ listName },
				{ new: true }
			).populate("recipients");
			if (!updated) {
				throw new Error("List not found or not authorized.");
			}
			return updated;
		},

		deleteList: async (parent, { listId }, context) => {
			requireAuth(context);
			const list = await List.findOne({ _id: listId, listUser: context.user._id });
			if (!list) {
				throw new Error("List not found or not authorized.");
			}
			if (list.recipients.length > 0) {
				await Recipient.deleteMany({ _id: { $in: list.recipients } });
			}
			await List.findByIdAndDelete(listId);
			await User.findOneAndUpdate(
				{ _id: context.user._id },
				{ $pull: { lists: listId } }
			);
			return list;
		},

		createRecipient: async (parent, { firstName, lastName, listId }, context) => {
			requireAuth(context);
			const list = await List.findOne({ _id: listId, listUser: context.user._id });
			if (!list) {
				throw new Error("List not found or not authorized.");
			}
			const newRecipient = await Recipient.create({ firstName, lastName, listId });
			const updatedList = await List.findByIdAndUpdate(
				listId,
				{ $push: { recipients: newRecipient._id } },
				{ new: true }
			).populate("recipients");
			return updatedList;
		},

		updateRecipient: async (parent, { recId, firstName, lastName }, context) => {
			requireAuth(context);
			const updateFields = {};
			if (firstName !== undefined) updateFields.firstName = firstName;
			if (lastName !== undefined) updateFields.lastName = lastName;
			const updated = await Recipient.findByIdAndUpdate(
				recId,
				updateFields,
				{ new: true }
			);
			if (!updated) {
				throw new Error("Recipient not found.");
			}
			return updated;
		},

		deleteRecipient: async (parent, { recId, listId }, context) => {
			requireAuth(context);
			const recipient = await Recipient.findByIdAndDelete(recId);
			if (!recipient) {
				throw new Error("Recipient not found.");
			}
			await List.findByIdAndUpdate(
				listId,
				{ $pull: { recipients: recId } }
			);
			return recipient;
		},

		addItemToRec: async (parent, { recId, ebayItemId }, context) => {
			requireAuth(context);
			const product = await fetchEbayProduct(ebayItemId);
			const updatedRecipient = await Recipient.findByIdAndUpdate(
				recId,
				{ $push: { products: product } },
				{ new: true }
			);
			if (!updatedRecipient) {
				throw new Error("Recipient not found.");
			}
			return updatedRecipient;
		},

		addItemToAllRecsOnList: async (parent, { listId, ebayItemId }, context) => {
			requireAuth(context);
			const list = await List.findOne({ _id: listId, listUser: context.user._id });
			if (!list) {
				throw new Error("List not found or not authorized.");
			}
			const product = await fetchEbayProduct(ebayItemId);
			if (list.recipients.length > 0) {
				await Recipient.updateMany(
					{ _id: { $in: list.recipients } },
					{ $push: { products: product } }
				);
			}
			return List.findById(listId).populate("recipients");
		},

		removeItemFromRec: async (parent, { recId, itemId }, context) => {
			requireAuth(context);
			const updated = await Recipient.findByIdAndUpdate(
				recId,
				{ $pull: { products: { itemId } } },
				{ new: true }
			);
			if (!updated) {
				throw new Error("Recipient not found.");
			}
			return updated;
		},
	},
};

module.exports = resolvers;
