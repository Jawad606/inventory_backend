const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var venderSchema = new Schema(
  {
    venderImg: {
      type: String,
    },
    venderName: {
      type: String,
    },
    venderEmail: {
      type: String,
    },
    venderNumber: {
      type: String,
    },
    venderCnic: {
      type: String,
    },
    venderAddress: {
      type: String,
    },
    venderCity: {
      type: String,
    },
    catagory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "catagory",
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
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

var vender = mongoose.model("vender", venderSchema);
module.exports = vender;

