const express = require("express");
const UserModel = require("../../../Models/user");
const authMiddleware = require("../../../Middleware/authMiddleware");
const router = express.Router();

router.post(`/updateUserRole`, authMiddleware, async (req, res) => {
  const { _id, Role } = req.body;

  if (req.rootUser.Role === "Admin") {
    let NewRole;
    if (Role === "Admin") {
      NewRole = "Customer";
    } else {
      NewRole = "Admin";
    }

    const usersData = await UserModel.updateOne(
      { _id },
      {
        $set: { Role: NewRole },
      }
    );

    usersData
      ? res.send({ message: "User Role Updated", result: true })
      : res.send({ message: "User Role Not Updated", result: false });
  } else {
    res.send({ message: "Admin can only update ROLE", result: false });
  }
});

module.exports = router;
