const { Schema, model } = require("mongoose");

const productSchema = new Schema({
	itemId: {
		type: String,
		required: true,
	},
	itemName: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	mainImage: {
		type: String,
	},
	additionalImages: [
		{
			type: String,
		}
	],
	buyUrl: {
		type: String,
	},
	sellerUserName: {
		type: String,
	},
	sellerFeedBackPercentage: {
		type: String,
	},
	itemCondition: {
		type: String
	},
});

const Product = model("Product", productSchema);

module.exports = Product;
