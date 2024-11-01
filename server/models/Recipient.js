const { Schema } = require("mongoose");
const productSchema = require("./Product");

const recipientSchema = new Schema({
    firstName: String,
    lastName: String,
    products: [productSchema]
});

module.exports = recipientSchema;

//Gary, Smith, Friends, [Lego Batman, Lamp]