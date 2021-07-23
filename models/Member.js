const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
module.exports = mongoose.model("Member", MemberSchema);
