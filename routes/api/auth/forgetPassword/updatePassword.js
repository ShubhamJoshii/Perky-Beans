const express = require("express");
const UserModel = require("../../../../Models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post(`/forgetPassword/updatePassword`, async (req, res) => {
    const { Email, OTP, Password, Confirm_Password } = req.body;
    // console.log(req.body);
    try {
      const userExist = await UserModel.findOne({ Email });
      await userExist.updateOne({ Password: await bcrypt.hash(Password, 12) });
      await userExist.updateOne({
        Confirm_Password: await bcrypt.hash(Confirm_Password, 12),
      });
      await userExist.save();
      res.send({ status: true, message: "Password Updated" });
    } catch (err) {
      res.send({ status: false, message: "Error Occurs! Please Try Again" });
    }
  });

module.exports = router;