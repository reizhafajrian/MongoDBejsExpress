const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { ObjectId } = mongoose.Schema;
const BarangTerjualSchema = new mongoose.Schema({
  idMenu: {
    type: ObjectId,
    ref: "Menu",
  },
  // idKasir: {
  //   type: ObjectId,
  //   ref: "Menu",
  //   required: true,
  // },
  jumlah: {
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
    default: moment.tz(
      new Date().setDate(new Date().getDate() + 1),
      "Asia/Indonesia"
    ),
  },
});
module.exports = mongoose.model("BarangTerjual", BarangTerjualSchema);
