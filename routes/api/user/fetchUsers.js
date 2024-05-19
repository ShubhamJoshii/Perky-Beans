const express = require("express");
const UserModel = require("../../../Models/user");
const pageCount = require("../../../Common/PageCount");
const router = express.Router();

router.get(`/fetchUsers`, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || (await UserModel.countDocuments());
  // console.log(page, limit);

  let totalUsers = (await UserModel.countDocuments()) || 1;
  let pages = pageCount(totalUsers, limit).length;

  // console.log(pages.length);
  const usersData = await UserModel.find().limit(limit)
  .skip((page - 1) * limit);;
  usersData
    ? res.send({ message: "User Found", data: usersData,TotalPages: pages })
    : res.send({ message: "No User Found" });
});

module.exports = router;
