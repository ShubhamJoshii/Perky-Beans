
const express = require('express');
const router = express.Router();
const ProductsModel = require('../../../Models/products');

router.get(`/fetchProduct`, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const Available = req.query.Available;
    const Category = req.query.Category || null;
    const Ingredients = req.query.Ingredients || null;
    const PriceRange = req.query.PriceRange || null;
    const RatingUP = req.query.RatingUP || null;
    const limit =
      parseInt(req.query.limit) || (await ProductsModel.countDocuments());
      // console.log("Hello")
    const pageCount = (totalProduct) => {
      const pages = [];
      for (let i = 1; i <= Math.ceil(totalProduct / limit); i++) {
        pages.push(i);
      }
      return pages;
    };
  
    let totalProduct = (await ProductsModel.countDocuments()) || 1;
    let pages = pageCount(totalProduct);
    // console.log()
    if (Available === "true") {
      if (Category || Ingredients || PriceRange || RatingUP) {
        let query = {};
        query.Available = true;
        if (Category) {
          let Category1 = Category.split(",");
          query.Category = { $in: Category1 };
        }
        if (Ingredients) {
          let Ingredients1 = Ingredients.split(",");
          query.type = { $in: Ingredients1 };
        }
        if (PriceRange) {
          query.Price = { $lte: PriceRange };
        }
        if (RatingUP) {
          query.Rating = { $gte: RatingUP };
        }
        const products = await ProductsModel.find(query)
          .limit(limit)
          .skip((page - 1) * limit);
        let totalProduct = (await ProductsModel.countDocuments(query)) || 1;
        let pages = pageCount(totalProduct);
        return res.send({ data: products, TotalproductsPages: pages });
      } else {
        const products = await ProductsModel.find({ Available: true })
          .limit(limit)
          .skip((page - 1) * limit);
        return res.send({ data: products, TotalproductsPages: pages });
      }
    } else {
      const products = await ProductsModel.find()
        .limit(limit)
        .skip((page - 1) * limit);
      let totalProduct = (await ProductsModel.countDocuments()) || 1;
      let pages = pageCount(totalProduct);
      return res.send({ data: products, TotalproductsPages: pages });
    }
  });
  
  module.exports = router;