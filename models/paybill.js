const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var paymentbillSchema = new Schema(
  {
    catagory: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'catagory'
  },
  item:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'item'
  },
    quantity: {
      type: String,
      required: true,
    },
    paid: {
      type: String,
      required: true,
    },
    unpaid: {
      type: String,
      required: true,
    },
    vender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vender",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

var paymentbill = mongoose.model("paymentbill", paymentbillSchema);
module.exports = paymentbill;
