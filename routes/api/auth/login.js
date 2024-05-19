const express = require('express');
const UserModel = require('../../../Models/user');
const router = express.Router();
const bcrypt = require("bcrypt");

router.post(`/login`, async (req, res) => {
  const { Email, Password, Login_Date } = req.body;
  try {
    const userExist = await UserModel.findOne({ Email });
    if (userExist) {
      const password_Match = await bcrypt.compare(Password, userExist.Password);
      if (!userExist.isVerified) {
        res.send("Please Verified your Email ID");
      } else if (password_Match) {
        userExist.Login = userExist.Login.concat({ Login_Date });
        const Token = await userExist.generateAuthToken();
        // console.log(Token);
        res.cookie("perkyBeansToken", Token, {
          expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });
        userExist.save();
        res.send("User logged in");
      } else {
        res.send("User Password not Matched");
      }
    } else {
      res.send("User Email is not registed");
    }
  } catch (err) {}
});

module.exports = router;