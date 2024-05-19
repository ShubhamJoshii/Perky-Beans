const express = require("express");
const authMiddleware = require("../../../Middleware/authMiddleware");
const OrdersModel = require("../../../Models/orders");
const BagsModel = require("../../../Models/bags");

const router = express.Router();
const Mailgen = require("mailgen");
const transporter = require("../../../Common/transporter");
const ProductsModel = require("../../../Models/products");

router.post(`/orderNow`, authMiddleware, async (req, res) => {
  const {
    Delivery_Charge,
    GST,
    Discount,
    TotalAmountPayed,
    Coupon_ID,
    Address,
    paymentThrough,
  } = req.body;
  try {
    const bagData = await BagsModel.findOne({ user_id: req.userID });
    const productIDs = bagData.Bag.map((e) => e.productID);
    const products = await ProductsModel.find(
      { _id: { $in: productIDs } },
      "Product_Photo Product_Name Price type"
    );
    // console.log(products);
    if (bagData) {
      const Orders = bagData.Bag;
      const orderExists = await OrdersModel({
        user_id: req.userID,
        Orders,
        status: "ORDER PLACED",
        Delivery_Charge,
        GST,
        Discount,
        TotalAmountPayed,
        Coupon_Used: Coupon_ID,
        Address,
        paymentThrough,
      });
      const bagDataDelete = await BagsModel.deleteOne({ user_id: req.userID });
      let orderSaved = await orderExists.save();
      if (Coupon_ID) {
        const userExist = await UserModel.findOne({ _id: req.userID });
        userExist.Coupon_Used = await userExist.Coupon_Used.concat({
          Name: Coupon_ID,
        });
        await userExist.save();
      }
      if (orderSaved) {
        // console.log(orderSaved);

        let mailGenerator = new Mailgen({
          theme: "default",
          product: {
            name: "Perky Beans",
            link: "https://perky-beans.vercel.app/",
          },
        });
        const tableBody = products
          .map(
            (curr) => `
            <tr>
              <td>${curr.Product_Name}</td>
              <td style="text-align: right;">&#8377; ${(curr.Price * (100 - 18)) / 100}</td>
            </tr>
          `
          )
          .join("");

        let response = {
          body: {
            name: `${req.rootUser.Full_Name}`,
            intro: `
            <p>Thank you for placing an order with Perky-Beans! We are pleased to confirm that your order has been received and is being processed. Below are the details of your order:</p>
            <h3><strong>Order Details:</strong></h3>
            <ul>
              <li>Order Number: ${orderSaved._id
                .toString()
                .toUpperCase()
                .slice(-6)}</li>
              <li>Order Date: ${orderSaved.orderedAt}</li>
            </ul>
            <h3><strong>Items Ordered: </strong></h3>
            <table style="width:100%">
              ${tableBody}
              <tr>
                <td>GST:</td>
                <td style="text-align: right;">&#8377; ${GST}</td>
              </tr>
              <tr>
                <td>Discount:</td>
                <td style="text-align: right;">&#8377; ${Discount}</td>
              </tr>
              <tr>
                <td>Delivery Charges:</td>
                <td style="text-align: right;">&#8377; ${Delivery_Charge}</td>
              </tr>
              <tr style="font-size:16px;">
                <td><strong>Grand Total:</strong></td>
                <td style="text-align: right;"><strong>&#8377; ${TotalAmountPayed}</strong></td>
              </tr>
            </table>
            <br>
            <h3><strong>Billing Information:</strong></h3>
              <p><strong>Name:</strong> ${req.rootUser.Full_Name}</p>
              <p><strong>Billing Address:</strong> ${orderSaved.Address}</p>
              <p><strong>Delivery Address:</strong> ${orderSaved.Address}</p>
              <p><strong>Payment Method:</strong> ${orderSaved.paymentThrough}</p>
            <br >
            <p>We appreciate your business and look forward to serving you. If you have any questions or need further assistance, feel free to reach out.</p>
            <p>Thank you for choosing Perky-Beans!</p>
            <p>Warm regards</p>
            `,  
            outro: "Looking forward",
          },
        };

        let mail = mailGenerator.generate(response);
        let message = {
          from: process.env.AUTH_EMAIL,
          to: req.rootUser.Email,
          subject: "Your Order Confirmation from Perky-Beans!",
          html: mail,
        };

        await new Promise(async (resolve, reject) => {
          await transporter
            .sendMail(message)
            .then(async () => {
              return res.send("Product Ordered");
            })
            .catch(() => {
              return res.send("Retry!");
            });
        });
      }
    }
    // return res.send("Product Ordered");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
