const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var itemSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    assetId: {
      type: String,
      required: true,
    },
    catId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'catagory'
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
  },
  {
    timestamps: true,
  }
);

var item = mongoose.model("item", itemSchema);

module.exports = item;
