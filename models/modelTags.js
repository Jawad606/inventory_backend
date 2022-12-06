const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mdodeltagSchema = new Schema(
  {
    catagory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "catagory",
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
    },
    tag: {
      type: String,
      required: true,
    },
    specification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "specification",
    },
    uniStore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uniStore",
    },
    assign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assign",
    },
    statusOfassign:{
      type:Boolean,
    },
    specification:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'specification',
    }
  },
  {
    timestamps: true,
  }
);

var modeltag = mongoose.model("modeltag", mdodeltagSchema);
module.exports = modeltag;
