const express = require("express");
const UserModel = require("../../../Models/user");
const router = express.Router();

router.post(`/deleteUser`, async (req, res) => {
  const { _id } = req.body;
  try {
    const findAdmins = await UserModel.countDocuments({ Role: "Admin" });
    if (findAdmins === 1) {
      res.send({ message: "You Can't Delete It", result: false });
    } else {
      const deleteUser = await UserModel.deleteOne({ _id });
      res.send({ message: "User Deleted", result: true });
    }
  } catch (err) {
    res.send({ message: "Error ! User Not Deleted", result: false });
  }
});

module.exports = router;
