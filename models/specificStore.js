const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var specifStoreSchema = new Schema(
  {
    catagory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "catagory",
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    specification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "specification",
    },
  },
  {
    timestamps: true,
  }
);

var specificstore = mongoose.model("specificstore", specifStoreSchema);
module.exports = specificstore;
