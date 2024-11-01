const { Schema, model } = require("mongoose");

const listSchema = new Schema({
  listName: {
    type: String,
    required: true,
  },
  listUser: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  recipients: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipient"
    }
    ],
});

// Create a unique index on listName and listUser so the same user cannot have multiple lists 
// with the same name.  
listSchema.index({ listName: 1, listUser: 1 }, { unique: true });

const List = model("List", listSchema);

module.exports = List;

//Friends, <userIDthing>, [Billy, Joe, Gary]