const express = require("express");
const authMiddleware = require("../../../Middleware/authMiddleware");
const OrdersModel = require("../../../Models/orders");
const ProductsModel = require("../../../Models/products");

const router = express.Router();

router.get(`/fetchOrders`, authMiddleware, async (req, res) => {
    try {
      const fetchOrders = await OrdersModel.find({ user_id: req.userID });
      const products = await ProductsModel.find(
        {},
        "Product_Photo Reviews Description Product_Name Price type"
      );
  
      let data = await fetchOrders.map((curr, id) => {
        let Orders2 = [];
        curr.Orders.filter((order) => {
          products.find((product) => {
            if (product._id === order.productID) {
              const temp = {
                _id: order._id,
                SmallCount: order.SmallCount,
                MediumCount: order.MediumCount,
                LargeCount: order.LargeCount,
                productID: order.productID,
                Product_Photo: product.Product_Photo,
                Product_Name: product.Product_Name,
                Price: product.Price,
                type: product.type,
                Description: product.Description,
                Reviews: product.Reviews,
              };
              Orders2.push(temp);
              return order;
            }
            return false;
          });
        });
        return {
          _id: curr._id,
          user_id: curr.user_id,
          Coupon_Used: curr.Coupon_Used,
          TotalAmountPayed: curr.TotalAmountPayed,
          GST: curr.GST,
          Delivery_Charge: curr.Delivery_Charge,
          Discount: curr.Discount,
          status: curr.status,
          orderedAt: curr.orderedAt,
          Orders: Orders2,
        };
      });
  
      // console.log(data);
      res.send({ data: data, result: true });
    } catch (error) {
      console.log(error);
      res.send({ data: [], result: true });
    }
  });

module.exports = router;