
const express = require('express');
const router = express.Router();
const ProductsModel = require('../../../Models/products');

router.get("/searchProducts",async (req,res)=>{
    const searchText = req.query.searchText;
    const products = await ProductsModel.find({Product_Name:new RegExp(searchText,"i")})
    if(products.length > 0){
      res.send({products:products,status:true})
    }else{
      res.send({status:false})
    }
  })
  
module.exports = router;