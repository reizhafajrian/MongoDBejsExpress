const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const BarangMasukSchema = new mongoose.Schema({
  idSupplier: {
    type: ObjectId,
    ref: "Supplier",
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  type: {
    type: Boolean,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  idMenu: [
    {
      type: ObjectId,
      ref: "Menu",
    },
  ],
});
module.exports = mongoose.model("BarangMasuk", BarangMasukSchema);
