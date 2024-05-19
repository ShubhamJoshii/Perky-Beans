const express = require("express");
const UserModel = require("../../../../Models/user");
const OTPVerficationModel = require("../../../../Models/OTPVerification");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post(`/forgetPassword/otpVerify`, async (req, res) => {
    const { Email, OTP } = req.body;
    // console.log(OTP);
    try {
      const userExist = await UserModel.findOne({ Email });
      const userOTPFind = await OTPVerficationModel.find({ userID: userExist._id });
      const { expiresAt } = userOTPFind[0];
      const hashedOTP = userOTPFind[0].OTP;
      if (expiresAt < Date.now()) {
        await OTPVerficationModel.deleteMany({ userID: userExist._id });
        res.send({
          status: false,
          message: "OTP is expired. Please request Again",
        });
      } else {
        // const password_Match = await bcrypt.compare(Password, userExist.Password);
        let validOTP = await bcrypt.compare(OTP, hashedOTP);
        // console.log(validOTP, hashedOTP, OTP);
        if (validOTP) {
          // await OTPVerficationModel.deleteMany({ userID: userExist._id });
          res.send({ status: true, message: "Valid OTP. Enter New Password" });
        } else {
          res.send({ status: false, message: "Invalid OTP. Please Try Again" });
        }
      }
    } catch (error) {
      res.send({ status: false, message: "Invalid Email" });
    }
  });
  
module.exports = router;