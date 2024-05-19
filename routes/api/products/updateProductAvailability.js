const express = require("express");
const ProductsModel = require("../../../Models/products");
  const router = express.Router();
  
router.post(`/updateProductAvailability`, async (req, res) => {
    const { _id, isAvailable } = req.body;
    // console.log(req.body);
    const productsData = await ProductsModel.updateOne(
      { _id },
      {
        $set: { Available: isAvailable },
      }
    );
  
    productsData
      ? res.send({ message: "Product Availability Updated", result: true })
      : res.send({ message: "Product Availability  Not Updated", result: false });
  });
  
  module.exports = router;