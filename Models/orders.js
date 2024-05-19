const mongoose = require("mongoose");
const ordersDB = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
  Coupon_Used: {
    type: String,
  },
  Orders: [
    {
      productID: {
        type: String,
        require: true,
      },
      SmallCount: {
        type: Number,
        require: true,
      },
      MediumCount: {
        type: Number,
        require: true,
      },
      LargeCount: {
        type: Number,
        require: true,
      },
    },
  ],
  Address: {
    type: String,
  },
  paymentThrough: {
    type: String,
  },
  TotalAmountPayed: {
    type: Number,
    require: true,
  },
  GST: {
    type: Number,
    require: true,
    default: 0,
  },
  Delivery_Charge: {
    type: Number,
    require: true,
    default: 0,
  },
  Discount: {
    type: Number,
    require: true,
    default: 0,
  },
  status: {
    type: String,
    require: true,
  },
});
const OrdersModel = mongoose.model("Orders", ordersDB);
module.exports = OrdersModel;
