const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../Middleware/authMiddleware');
const WishlistsModel = require('../../../Models/wishlist');
const ProductsModel = require('../../../Models/products');

router.get(`/fetchWishlist`, authMiddleware, async (req, res) => {
    const fetchWishlist = await WishlistsModel.findOne({ user_id: req.userID });
    const products = await ProductsModel.find(
      {},
      {
        productID: "$_id",
        Product_Photo: 1,
        Product_Name: 1,
        Description: 1,
        Price: 1,
        type: 1,
      }
    );
    const data = products.filter((item) => {
      let temp = fetchWishlist?.Wishlist?.find((e) => item._id === e.productID);
      if (temp) {
        item._id = temp._id;
        return true;
      }
      return false;
    });
    if (fetchWishlist) {
      res.send({ data, result: true });
    } else {
      res.send({ data: [], result: false });
    }
  });
  

module.exports = router;