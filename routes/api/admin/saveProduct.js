const express = require("express");
const ProductsModel = require("../../../Models/products");
const router = express.Router();

router.post(`/saveProduct`, async (req, res) => {
  const {
    Product_Name,
    Description,
    Price,
    Category,
    Product_Photo,
    Rating,
    type,
  } = req.body;
  // console.log(Category);
  let _id = require("crypto").randomBytes(4).toString("hex");
  try {
    const productData = new ProductsModel({
      _id,
      Product_Name,
      Description,
      Price,
      Category,
      Product_Photo,
      Rating,
      type,
    });
    await productData.save();
    res.send({ message: "Product Registered", result: true });
  } catch (err) {
    res.send({ message: "Product Not Registered. Try Again", result: false });
  }
});

module.exports = router;
