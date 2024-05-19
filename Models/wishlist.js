const mongoose = require("mongoose");
const WishlistDB = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  Wishlist: [
    {
      productID: {
        type: String,
        require: true,
      },
    },
  ],
});
const WishlistsModel = mongoose.model("Wishlists", WishlistDB);
module.exports = WishlistsModel;
