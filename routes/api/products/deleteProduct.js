
const express = require('express');
const router = express.Router();
const ProductsModel = require('../../../Models/products');

router.post(`/deleteProduct`, async (req, res) => {
    // console.log(req.body);
    const { _id } = req.body;
    const deleteProduct = await ProductsModel.deleteOne({ _id });
    deleteProduct
      ? res.send({ message: "Product Deleted" })
      : res.send({ message: "Product Not Deleted Try Again" });
  });

  
module.exports = router;