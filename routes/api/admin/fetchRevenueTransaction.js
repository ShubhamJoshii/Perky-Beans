const express = require("express");
const OrdersModel = require("../../../Models/orders");
const router = express.Router();

router.get(`/fetchRevenueTransaction`, async (req, res) => {
  try {
    const fetchOrders = await OrdersModel.find();
    res.send({ orders: fetchOrders });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
