const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: Boolean,
    required: true,
  },
  jumlahBarangTerpakai:{
    type:Number,
    required:true
  },
  idBarangMasuk:
    {
      type: ObjectId,
      ref: "BarangMasuk",
    },
  idTerjual: [
    {
      type: ObjectId,
      ref: "BarangTerjual",
    },
  ],
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
module.exports = mongoose.model("Menu", MenuSchema);
