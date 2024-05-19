const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../Middleware/authMiddleware');
const WishlistsModel = require('../../../Models/wishlist');

router.post(`/removefromWishlist`, authMiddleware, async (req, res) => {
    const { productID } = req.body;
    try {
      const wishlistExist = await WishlistsModel.findOne({
        user_id: req.userID,
      });
      wishlistExist.Wishlist = await wishlistExist.Wishlist.filter(
        (e) => e.productID !== productID
      );
      wishlistExist.save();
      res.send("Remove from Wishlist");
    } catch (err) {
      console.log(err);
    }
  });
  module.exports = router;