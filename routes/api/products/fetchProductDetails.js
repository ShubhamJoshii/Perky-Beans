const express = require('express');
const router = express.Router();
const ProductsModel = require('../../../Models/products');
const BagsModel = require('../../../Models/bags');

router.get(`/fetchProductDetails`, async (req, res) => {
    const _id = req.query._id;
    const user_id = req.query.user_id || undefined;
    const productDetails = await ProductsModel.findOne({ _id });
    // console.log("Running");
    let Sizes = [
      {
        name: "regular",
        price: productDetails?.Price - 50,
        counter: 0,
      },
      {
        name: "medium",
        price: productDetails?.Price,
        counter: 0,
      },
      {
        name: "large",
        price: productDetails?.Price + 50,
        counter: 0,
      },
    ];
    let total =
      Sizes[0].price * Sizes[0].counter +
      Sizes[1].price * Sizes[1].counter +
      Sizes[2].price * Sizes[2].counter;
  
    if (user_id && productDetails) {
      const bagData = await BagsModel.findOne({ user_id });
      const bagDataProductFind = await bagData?.Bag.find(
        (item) => item.productID === _id
      );
      if (bagDataProductFind) {
        Sizes[0].counter = bagDataProductFind.SmallCount;
        Sizes[1].counter = bagDataProductFind.MediumCount;
        Sizes[2].counter = bagDataProductFind.LargeCount;
        total =
          Sizes[0].price * Sizes[0].counter +
          Sizes[1].price * Sizes[1].counter +
          Sizes[2].price * Sizes[2].counter;
        // console.log(Sizes)
        return res.send({ data: productDetails, Sizes, total, found: true });
      }
    }
    return productDetails
      ? res.send({ data: productDetails, Sizes, total, found: true })
      : res.send({ data: "Error", found: false });
  });


module.exports = router;