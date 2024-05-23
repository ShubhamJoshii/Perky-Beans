const express = require("express");
const authMiddleware = require("../../../Middleware/authMiddleware");
const OrdersModel = require("../../../Models/orders");
const UserModel = require("../../../Models/user");
const ProductsModel = require("../../../Models/products");

const router = express.Router();

router.get(`/fetchAllOrders`, authMiddleware, async (req, res) => {
  try {
    if (req.rootUser.Role === "Admin") {
      const fetchOrders = await OrdersModel.find();
      const fetchUsers = await UserModel.find({},"Full_Name Email");
      const fetchProducts = await ProductsModel.find({},"_id Product_Name");
      let data = fetchOrders.map((curr) => {
        let user = fetchUsers.find(e => e._id.toString() === curr.user_id)
        let a = curr.Orders.map((order) => {
          let product = fetchProducts.find(e => e._id.toString() === order.productID)
          return {Product_Name:product.Product_Name,productID:order.productID, SmallCount:order.SmallCount, MediumCount:order.MediumCount, LargeCount:order.LargeCount}
        })
        return {_id:curr._id, user_id:curr.user_id, Coupon_Used:curr.Coupon_Used ,Orders:a ,TotalAmountPayed:curr.TotalAmountPayed , GST:curr.GST ,Delivery_Charge:curr.Delivery_Charge, Discount:curr.Discount ,status:curr.status ,orderedAt:curr.orderedAt,paymentThrough:curr.paymentThrough, Address:curr.Address, Full_Name:user.Full_Name,Email:user.Email}
      })
      res.send({data, result: true });
    } 
  } catch (error) {
    console.log(error);
    res.send({ data: [], result: true });
  }
});

module.exports = router;
