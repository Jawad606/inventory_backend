const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var assignStoreSchema = new Schema(
  {
    catagory: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'catagory'
    },
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'item'
    },
    quantity:{
        type:Number,
        default:0,
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

var assignstore = mongoose.model("assignstore", assignStoreSchema);

module.exports = assignstore;
