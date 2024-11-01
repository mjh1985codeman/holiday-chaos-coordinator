const { Schema } = require("mongoose");

const recipientSchema = require("./Recipient");

const listSchema = new Schema({
  listName: {
    type: String,
    required: true,
  },
  recipients: [recipientSchema]
});

module.exports = listSchema;

//Friends, [Billy, Joe, Gary]