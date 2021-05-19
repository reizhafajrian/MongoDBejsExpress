const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },buy:[
      {
        type:ObjectId,
        ref:"BarangTerjual",
        required:true
      }
  ]
});
module.exports = mongoose.model("Menu", MenuSchema);
