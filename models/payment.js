const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var  paymentSchema = new Schema(
  {
    uniStore:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'uniStore'
    },
    quantity: {
      type: String,
      required: true,
    },
    per_unit_price: {
        type: String,
        required: true,
    },
    total_price: {
        type: String,
        required: true,
    },
    vender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'vender'
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

var payment = mongoose.model("payment",  paymentSchema);

module.exports = payment;
