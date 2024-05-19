
const express = require('express');
const router = express.Router();
const ProductsModel = require('../../../Models/products');

router.post(`/updateProduct`, async (req, res) => {
    const {
      _id,
      Product_Photo,
      Product_Name,
      Description,
      Price,
      Rating,
      type,
      Category,
    } = req.body;
    //   console.log(req.body);
    const productDetails = await ProductsModel.updateOne(
      { _id },
      {
        $set: {
          Product_Photo,
          Product_Name,
          Description,
          Price,
          type,
          Rating,
          Category,
        },
      }
    );
    productDetails
      ? res.send({ message: "Product Updated" })
      : res.send({ message: "Product Not Updated Try Again" });
  });


  module.exports = router;