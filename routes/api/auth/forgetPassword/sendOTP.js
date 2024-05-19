const express = require("express");
const UserModel = require("../../../../Models/user");
const OTPVerficationModel = require("../../../../Models/OTPVerification");
const router = express.Router();
const bcrypt = require("bcrypt");
const transporter = require("../../../../Common/transporter");
const Mailgen = require("mailgen");

router.post(`/forgetPassword/sendOTP`, async (req, res) => {
  const { Email } = req.body;
  try {
    const userExist = await UserModel.findOne({ Email });
    if (userExist) {
      const otp = `${Math.floor(Math.random() * 90000) + 10000}`;
      const otpPreviousSave = await OTPVerficationModel.deleteMany({
        userID: userExist._id,
      });
      // await otpPreviousSave.save();

      const hashedOTP = await bcrypt.hash(otp, 12);

      const otpDBSave = new OTPVerficationModel({
        userID: userExist._id,
        OTP: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000,
      });
      let mailGenerator = new Mailgen({
        theme: "default",
        product: {
          name: "Perky Beans",
          link: "https://perky-beans.vercel.app/",
        },
      });

      let response = {
        body: {
          name: `${userExist.Full_Name}`,
          intro: `<p>Enter <b>${otp}</b> in the app to verify your Email address and then re-set your password</p>`,
          outro: "Looking forward",
        },
      };

      let mail = mailGenerator.generate(response);
      let message = {
        from: process.env.AUTH_EMAIL,
        to: Email,
        subject: "Verify Your Email",
        html: mail,
      };

      await new Promise(async (resolve, reject) => {
        await transporter
          .sendMail(message)
          .then(async () => {
            await otpDBSave.save();
            return res.json({
              status: true,
              message: "Verification OTP email sent",
            });
          })
          .catch(() => {
            return res.json({ message: "OTP Generation Error" });
          });
      });
    } else {
      res.send({ message: "Email is not Registered" });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "Mail not send" });
  }
});
module.exports = router;
