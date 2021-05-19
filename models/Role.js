const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const RoleSchema = new mongoose.Schema({
  Level: {
    type: String,
    required: true,
  },
  User: [
    {
      type: ObjectId,
      ref:"User",
     
    },
  ],
});
module.exports = mongoose.model("Role", RoleSchema);
