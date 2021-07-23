const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const MenuSchema = new mongoose.Schema({
  discount: {
    type: Number,
    required: true,
  },
  idMenu:{
    type:ObjectId,
    ref:"Menu",
    required:true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },

});
module.exports = mongoose.model("Discount", MenuSchema);
