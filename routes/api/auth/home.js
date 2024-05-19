const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../Middleware/authMiddleware");

router.get(`/home`, authMiddleware, async (req, res) => {
  if (req.rootUser) {
    res.send({ data: req.rootUser, status: true });
  } else {
    res.send({ status: false });
  }
});

module.exports = router;