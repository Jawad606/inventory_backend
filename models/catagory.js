const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var catSchema = new Schema(
  {
    assetType: {
      type: String,
    },
    catagoryName: {
      type: String,
      required: true,
      unique: true
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

var catagory = mongoose.model("catagory", catSchema);

module.exports = catagory;
