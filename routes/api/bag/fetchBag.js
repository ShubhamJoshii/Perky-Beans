const express = require("express");
const router = express.Router();
const BagsModel = require("../../../Models/bags");
const authMiddleware = require("../../../Middleware/authMiddleware");
const ProductsModel = require("../../../Models/products");

router.get(`/fetchBag`, authMiddleware, async (req, res) => {
  const fetchBag = await BagsModel.findOne({ user_id: req.userID });
  const bagProductArr = fetchBag?.Bag.map((curr) => curr.productID);
  const fetchProducts = await ProductsModel.find(
    { _id: { $in: bagProductArr } },
    "-Description -Reviews -Available -type -Rating"
  );
  let GrandTotal = 0;
  let data = fetchProducts.map((curr) => {
    const temp = fetchBag.Bag.find((e) => e.productID === curr._id);
    const smallPrice = (curr?.Price - 50) * temp.SmallCount;
    const mediumPrice = curr?.Price * temp.MediumCount;
    const largePrice = (curr?.Price + 50) * temp.LargeCount;
    const Total = smallPrice + mediumPrice + largePrice;
    GrandTotal += Total;
    return {
      _id: curr._id,
      Product_Photo: curr.Product_Photo,
      Product_Name: curr.Product_Name,
      Category: curr.Category,
      Price: curr.Price,
      smallPrice,
      mediumPrice,
      largePrice,
      Total,
      productID:temp.productID,
      SmallCount: temp.SmallCount,
      MediumCount: temp.MediumCount,
      LargeCount: temp.LargeCount,
    };
  });
  if (fetchBag) {
    res.send({ data, GrandTotal, result: true });
  } else {
    res.send({ data: [], result: false });
  }
});

module.exports = router;
