const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../Middleware/authMiddleware");
const CouponModel = require("../../../Models/coupon");

router.post(`/newCouponAdd`, authMiddleware, async (req, res) => {
    const { Code, Discount_Allot, Description } = req.body;
    var currDate = new Date();
    var result = currDate.setDate(currDate.getDate() + 10);
    let ExpiredAt = new Date(result);
    // console.log(ExpiredAt);
    try {
      if (req.rootUser.Role === "Admin") {
        const findExist = await CouponModel.findOne({ Code });
        if (!findExist) {
          const couponAdd = await CouponModel({
            Code,
            Discount_Allot,
            ExpiredAt,
            Description,
          });
          await couponAdd.save();
          res.send({ message: "Coupon Added", result: true });
        } else {
          res.send({ message: "Coupon Already Exist", result: false });
        }
      }
    } catch (err) {
      res.send({ message: "Only Admin can Create Coupon" });
      // console.log(err)
    }
  });

  
  module.exports = router;