const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../Middleware/authMiddleware");

router.get(`/logout`, authMiddleware, async (req, res) => {
  res.clearCookie("perkyBeansToken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;