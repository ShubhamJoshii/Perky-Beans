const mongoose = require("mongoose");

const UserOTPVerification = new mongoose.Schema({
    userID: String,
    OTP: String,
    createdAt: Date,
    expiresAt: Date,
  });
  
  const OTPVerficationModel = mongoose.model("OTP_Verification", UserOTPVerification);
  
  module.exports =  OTPVerficationModel;