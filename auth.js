const express = require("express");
const router = express.Router();
const UserModel = require("./Models/user");
const ContactModel = require("./Models/contact");

const CouponModel = require("./Models/coupon");

router.post(`/contact`, async (req, res) => {
  const { _id, Name, Email, type, Contact_Number, Description, rating } =
    req.body;
  let UserRegistered = false;
  try {
    const userExist = UserModel.findOne({ _id });
    if (_id && userExist) {
      UserRegistered = true;
    } else {
      UserRegistered = false;
    }
    const contactData = new ContactModel({
      Name,
      Email,
      type,
      Contact_Number,
      Description,
      UserRegistered,
      rating,
    });
    await contactData.save();
    res.send({ message: `${type} submitted`, Success: true });
  } catch (err) {
    res.send({ message: `${type} submittion Error `, Success: false });
  }
});



// Admin Routes
router.get(`/fetchCoupon`, async (req, res) => {
  try {
    const fetchCoupon = await CouponModel.find();
    res.send({ Data: fetchCoupon });
  } catch (err) {
    res.send("Error");
  }
});

module.exports = router;
