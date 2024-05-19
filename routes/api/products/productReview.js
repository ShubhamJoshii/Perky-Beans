const express = require('express');
const router = express.Router();
const ProductsModel = require('../../../Models/products');

router.post(`/productReview`, authMiddleware, async (req, res) => {
    const { Description, rating, _id } = req.body;
    try {
      const findProduct = await ProductsModel.findOne({ _id: _id });
      findProduct.Reviews = await findProduct.Reviews.concat({
        Description,
        rating,
        name: req.rootUser.Full_Name,
        user_id: req.rootUser._id,
      });
      await findProduct.save();
      res.send({ message: "Review Submitted", result: true });
    } catch (err) {
      console.log(err);
      res.send({ message: "Review Not Submitted! Try Again.", result: false });
    }
  });
  


module.exports = router;