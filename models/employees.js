const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var employeeSchema = new Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    Designation:{
        type: String,
        required: true,
    },
    Department:{
        type: String,
        required: true,
    },
    empId:{
        type: String,
        required: true,
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

var employee = mongoose.model("employee", employeeSchema);

module.exports = employee;
