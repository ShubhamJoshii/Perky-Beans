const express = require("express");
const UserModel = require("../../../Models/user");
const ProductsModel = require("../../../Models/products");
const OrdersModel = require("../../../Models/orders");
const router = express.Router();

router.get(`/fetchUsersProductsCount`, async (req, res) => {
  // const users = await UserModel.countDocuments({Role:"Customer"});
  const users = await UserModel.find();
  let totalUsers = users.length;
  let todayDay = new Date().toISOString();
  todayDay = todayDay.split("T")[0];
  let OldTotalUsers =
    totalUsers -
    users.filter((e) => {
      let time = e.RegisterDate.toISOString().split("T")[0];
      if (time === todayDay) {
        return true;
      }
      return false;
    }).length;
  let percentage_users = (
    ((totalUsers - OldTotalUsers) / OldTotalUsers) *
    100
  ).toFixed(1);

  const products = await ProductsModel.find();
  let Totalproducts = products.length;
  let TotalAvailableproducts =
    Totalproducts -
    products.filter((e) => {
      if (e.Available === false) {
        return true;
      }
      return false;
    }).length;
  let percentage_products =
    100 -
    (
      ((Totalproducts - TotalAvailableproducts) / TotalAvailableproducts) *
      100
    ).toFixed(1);

  const TotalOrder = await OrdersModel.find();
  let TotalTransaction = TotalOrder.length;
  let totalRevenue = 0;
  let totalTodayRevenue = 0;

  let totalTodayTransaction =
    TotalTransaction -
    TotalOrder.filter((e) => {
      let time = e.orderedAt.toISOString().split("T")[0];
      totalRevenue += e.TotalAmountPayed;
      if (time === todayDay) {
        totalTodayRevenue += e.TotalAmountPayed;
        return true;
      }
      return false;
    }).length;
  let OldRevenue = totalRevenue - totalTodayRevenue || totalRevenue;

  let percentage_transaction = (
    ((TotalTransaction - totalTodayTransaction) / totalTodayTransaction) *
    100
  ).toFixed(1);
  let percentage_revenue = (
    ((totalRevenue - OldRevenue) / OldRevenue) *
    100
  ).toFixed(1);

  res.send({
    totalUsers,
    percentage_users,
    Totalproducts,
    percentage_products,
    TotalTransaction,
    percentage_transaction,
    totalRevenue,
    percentage_revenue,
  });
});

module.exports = router;
