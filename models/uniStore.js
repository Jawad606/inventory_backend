const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var uniSchema = new Schema(
  {
    catagory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'catagory',
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'item',
    },
    // vender: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'vender',
    // },
    quantity: {
      type: Number,
    },
    dateToAdd: {
      type: String,
    },
    specification:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'specification',
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

var uniStore = mongoose.model("uniStore", uniSchema);

module.exports = uniStore;
