const mongoose = require("mongoose");
const ProductsDB = new mongoose.Schema({
  _id: {
    type: String,
    require: true,
  },
  Product_Name: {
    type: String,
    require: true,
  },
  Description: {
    type: String,
    require: true,
  },
  Rating: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  Price: {
    type: Number,
    require: true,
  },
  Available: {
    type: Boolean,
    default: true,
    require: true,
  },
  Category: {
    type: String,
    require: true,
  },
  Product_Photo: {
    type: String,
    require: true,
  },
  Reviews:[
    {
      user_id:{
        type:String
      },
      Description:{
        type:String,
        required:true
      },
      rating:{
        type:Number,
        required:true
      },
      name:{
        type:String,
        required:true
      }
    }
  ]
});
const ProductsModel = mongoose.model("Products", ProductsDB);
module.exports = ProductsModel;

