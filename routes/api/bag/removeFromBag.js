const express = require("express");
const router = express.Router();
const BagsModel = require("../../../Models/bags");
const authMiddleware = require("../../../Middleware/authMiddleware");

router.post(`/removeFromBag`, authMiddleware, async (req, res) => {
  const { productID } = req.body;
  try {
    const fetchBag = await BagsModel.findOne({ user_id: req.userID });
    fetchBag.Bag = await fetchBag.Bag.filter((e) => e.productID !== productID);
    await fetchBag.save();
    res.send("Remove from bag");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
