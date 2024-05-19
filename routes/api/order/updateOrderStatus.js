const express = require("express");
const OrdersModel = require("../../../Models/orders");

const router = express.Router();

router.post(`/changeStatus`, async (req, res) => {
  const { _id, status } = req.body;
  // console.log(_id,status)
  try {
    const changeStatus = await OrdersModel.updateOne(
      { _id },
      {
        $set: { status },
      }
    );
    if (changeStatus) {
      res.send({ message: "Order Status Updated", result: true });
    } else {
      res.send({ message: "Order Status Not Updated", result: false });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
