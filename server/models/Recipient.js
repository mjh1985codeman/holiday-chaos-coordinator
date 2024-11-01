const { Schema, model } = require("mongoose");

const recipientSchema = new Schema({
    firstName: String,
    lastName: String,
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
        ],
});

const Recipient = model("Recipient", recipientSchema);

module.exports = Recipient;

//Gary, Smith, Friends, [Lego Batman, Lamp]