const express = require("express");
const authMiddleware = require("../../../Middleware/authMiddleware");
const OrdersModel = require("../../../Models/orders");

const router = express.Router();

router.post(`/cancelOrder`, authMiddleware, async (req, res) => {
    const { _id } = req.body;
    try {
      const orderExist = await OrdersModel.updateOne(
        { _id },
        {
          $set: { status: "Order Cancelled" },
        }
      );
      if (orderExist) {
        res.send("Product Order Cancelled");
      }
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;