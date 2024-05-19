const express = require("express");
const UserModel = require("../../../Models/user");
const router = express.Router();
const Mailgen = require("mailgen");
const transporter  = require("../../../Common/transporter");


router.post(`/register`, async (req, res) => {
  const { Full_Name, Email, Password, Confirm_Password } = req.body;
  // console.log(req.body);
  let EmailToken = require("crypto").randomBytes(32).toString("hex");
  const env = process.env.NODE_ENV || "DEVELOPMENT";
  var VerfiedLink = `http://${req.headers.host}/api/user/verify-email?token=${EmailToken}`;
  if (env === "DEVELOPMENT") {
    VerfiedLink = `http://${req.headers.host}/user/verify-email?token=${EmailToken}`;
  }

  try {
    const userExist = await UserModel.findOne({ Email });
    if (!userExist) {
      const userData = new UserModel({
        Full_Name,
        Email,
        Password,
        Confirm_Password,
        EmailToken,
        Role: "Customer",
        isVerified: false,
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
          name: `${Full_Name}`,
          intro: `
              <p>Congratulations! You're almost set to start using Perky Beans- Cafe Web</p>
              <p>Just click the button below to validate your email address</p>
              <a href="${VerfiedLink}" style="padding: 5px;background-color: brown;color: white;font-size: 22px;text-decoration: none;padding: 6px 15px;"}>Verify Email</a>`,
          outro: "Looking forward",
        },
      };

      let mail = mailGenerator.generate(response);
      let message = {
        from: process.env.AUTH_EMAIL,
        to: Email,
        subject: "Perky Beans- Let's complete your account setup",
        html: mail,
      };

      await userData.save();
      await new Promise(async (resolve, reject) => {
        await transporter
          .sendMail(message)
          .then(() => {
            return res.json("Verification  email sent");
          })
          .catch(() => {
            // Delete Created User
            return res.json("Verification Error");
          });
      });

      // res.send("User Registered ");
    } else {
      res.send("User Email ID already Registered");
    }
  } catch (err) {
    console.log(err);
    res.send("Error! Try Again");
  }
});

module.exports = router;
