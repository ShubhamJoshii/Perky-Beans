const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../Middleware/authMiddleware');
const WishlistsModel = require('../../../Models/wishlist');


router.post(`/addToWishlist`, authMiddleware, async (req, res) => {
    const { productID } = req.body;
    try {
      const wishlistExist = await WishlistsModel.findOne({ user_id: req.userID });
      if (wishlistExist) {
        wishlistExist.Wishlist = await wishlistExist.Wishlist.concat({
          productID,
        });
        await wishlistExist.save();
      } else {
        const Wishlist = await WishlistsModel({
          user_id: req.userID,
          Wishlist: [{ productID }],
        });
        await Wishlist.save();
      }
      res.send("Add to Wishlist");
    } catch (err) {
      res.send("Please Login");
    }
  });

  module.exports = router;