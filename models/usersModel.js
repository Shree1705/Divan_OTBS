const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked : {
      type: Boolean,
      default: false,
    },
    phno:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
