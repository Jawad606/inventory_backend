const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var assignSchema = new Schema(
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
    },
    Department: {
      type: String,
      required: true,
    },
    ItemFor: {
      type: String,
      required: true,
    },
    classRoom: {
      type: String,
      required: true,
    },
    returnItem: {
      type: String,
    },
    returnQuantity: {
      type: Number,
    },
    specification:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'specification',
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

var assign = mongoose.model("assign", assignSchema);

module.exports = assign;
