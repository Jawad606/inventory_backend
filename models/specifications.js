const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var specificationSchema = new Schema(
  {
    model:{
        type:String,
    },
    specification: {
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

var specification = mongoose.model("specification", specificationSchema);

module.exports = specification;
