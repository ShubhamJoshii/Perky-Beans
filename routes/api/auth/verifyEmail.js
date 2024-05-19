const express = require('express');
const UserModel = require('../../../Models/user');
const router = express.Router();

router.get(`/user/verify-email`, async (req, res) => {
    try {
      const token = req.query.token;
      const user = await UserModel.findOne({ EmailToken: token });
      // console.log(user, "Hello WORLD");
      if (user.isVerified) {
        res.send("Email Already Verfied");
      }
      if (user) {
        user.EmailToken = null;
        user.isVerified = true;
        await user.save();
        res.send("Email Verfied");
      }
    } catch (err) {
      console.log(err);
      res.send("Email Already Verfied");
    }
  });

  module.exports = router;