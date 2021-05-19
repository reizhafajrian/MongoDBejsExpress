const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  idBarang: [
    {
      type: ObjectId,
      ref: "BarangMasuk",
    },
  ],
  phone: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default:Date.now
  },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
