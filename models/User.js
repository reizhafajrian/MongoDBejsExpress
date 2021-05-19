const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: ObjectId,
    ref:"Role",
    required: true,
  },
});
module.exports=mongoose.model("User",UserSchema)
