
const mongoose = require("mongoose");
const CouponDB = new mongoose.Schema({
  Code: {
    type: String,
    require: true,
  },
  Discount_Allot: {
    type: String,
    require: true,
  },
  ExpiredAt: {
    type: String,
    require: true,
  },
  Description: {
    type: String,
    require: true,
  },
});
const CouponModel = mongoose.model("Coupons", CouponDB);
module.exports = CouponModel;