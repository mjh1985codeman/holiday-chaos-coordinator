const { Schema, model } = require("mongoose");

const recipientSchema = new Schema({
    firstName: String,
    lastName: String,
    products: [
        {
            itemId: String,
            itemName: String,
            price: String,
            mainImage: String,
            buyUrl: String,
            sellerUsername: String,
            sellerFeedBackPercentage: String,
            itemCondition: String
        }
        ],
});

const Recipient = model("Recipient", recipientSchema);

module.exports = Recipient;

//Gary, Smith, Friends, [Lego Batman, Lamp]