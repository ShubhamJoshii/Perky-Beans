const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51PIBzKBApeRXee97uPySRxxaoR5XfWjVchRVQVMlsjvxMsMLtx1bgUzE92et7CFQIOoU30O32mej0dCK9kBarrQq002aKJ4oCo"
);
const bodyParser = require("body-parser");
const Mailgen = require("mailgen");
const BagsModel = require("../../Models/bags");
const ProductsModel = require("../../Models/products");
const OrdersModel = require("../../Models/orders");
const UserModel = require("../../Models/user");
const transporter = require("../../Common/transporter");
const authMiddleware = require("../../Middleware/authMiddleware");
const ReserveTableModel = require("../../Models/reserveTable");

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.Signing_Secret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.sendStatus(400);
    }
    const { type } = event.data.object.metadata;
    if (event.type === "checkout.session.completed") {
      if (type === "order-food") {
        const {
          Delivery_Charge,
          GST,
          Discount,
          TotalAmountPayed,
          Coupon_ID,
          Address,
          paymentThrough,
          userID,
          Full_Name,
          Email,
        } = event.data.object.metadata;
        // console.log( Delivery_Charge, GST, Discount, TotalAmountPayed, Coupon_ID, Address, paymentThrough ,userID, Full_Name, Email);
        try {
          const bagData = await BagsModel.findOne({ user_id: userID });
          console.log(bagData);
          const productIDs = bagData.Bag.map((e) => e.productID);
          const products = await ProductsModel.find(
            { _id: { $in: productIDs } },
            "Product_Photo Product_Name Price type"
          );
          // console.log(products);
          if (bagData) {
            const Orders = bagData.Bag;
            const orderExists = await OrdersModel({
              user_id: userID,
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
            const bagDataDelete = await BagsModel.deleteOne({
              user_id: userID,
            });
            let orderSaved = await orderExists.save();
            if (Coupon_ID) {
              const userExist = await UserModel.findOne({ _id: userID });
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
                  <td style="text-align: right;">&#8377; ${
                    (curr.Price * (100 - 18)) / 100
                  }</td>
                </tr>
              `
                )
                .join("");

              let response = {
                body: {
                  name: `${Full_Name}`,
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
                  <p><strong>Name:</strong> ${Full_Name}</p>
                  <p><strong>Billing Address:</strong> ${orderSaved.Address}</p>
                  <p><strong>Delivery Address:</strong> ${
                    orderSaved.Address
                  }</p>
                  <p><strong>Payment Method:</strong> ${
                    orderSaved.paymentThrough
                  }</p>
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
                to: Email,
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
        // const session = event.data.object;
        // console.log(session);
        console.log("Payment saved to MongoDB");
      }
      if (type === "reservation") {
        const {
          Contact_Number,
          Person_Count,
          Date,
          Timing,
          Booking_DateTime,
          TableNumber,
          userID,
          Full_Name,
          Email,
        } = event.data.object.metadata;
        console.log(
          Contact_Number,
          Person_Count,
          Date,
          Timing,
          Booking_DateTime,
          TableNumber
        );
        let token = require("crypto").randomBytes(32).toString("hex");
        try {
          const contactData = new ReserveTableModel({
            token: token,
            User_ID: userID,
            Contact_Number,
            Person_Count,
            User_Name: Full_Name,
            User_Email: Email,
            reservation_Date: Date,
            Booking_DateTime,
            status: "Confirmed",
            reservation_Timing: Timing,
            TableNumber,
          });
  
          let mailGenerator = new Mailgen({
            theme: "default",
            product: {
              name: "Perky Beans",
              link: "https://perky-beans.vercel.app/",
            },
          });
  
          let response = {
            body: {
              name: `${Full_Name}`,
              intro: `
                <p>We hope this email finds you well. Thank you for choosing PerkyBeans for your upcoming visit. We're delighted to confirm your reservation for a table at our café.</p>
                <p><strong>Reservation Details:</strong><p>
                <ul>
                  <li>Reservation Date: ${Date}</li>
                  <li>Reservation Time:  ${Timing}</li>
                  <li>Number of Guests:  ${Person_Count}</li>
                  <li>Reserved Table Number:  ${TableNumber}</li>
                </ul>
                <p><strong>Additional Information:</strong><p>
                <ul>
                  <li>Your reservation is confirmed under the name of ${Full_Name}.</li>
                  <li>If you need to modify or cancel your reservation, please contact us at "perkybeans9@gmail.com" or 
                  <a href="http://${req.headers.host}/booking/cancel?token=${token}">cancel reservation</a>
                  </li>
                </ul>
                <p><strong>Special Requests:</strong><p>
                <ul>
                  <li>If you have any special requests or dietary preferences, please let our staff know upon arrival.</li>
                </ul>
                <p>We look forward to welcoming you to PerkyBeans and ensuring you have a delightful experience. If you have any further questions or requests, feel free to reach out.</p>
                `,
              outro: "Looking forward",
            },
          };
  
          let mail = mailGenerator.generate(response);
          let message = {
            from: process.env.AUTH_EMAIL,
            to: Email,
            subject: "Your Reserved Table Confirmation at PerkyBeans",
            html: mail,
          };
  
          await new Promise(async (resolve, reject) => {
            await transporter
              .sendMail(message)
              .then(async () => {
                await contactData.save();
                return res.json({ message: "Table Reserved. Check Mail!" });
              })
              .catch(() => {
                return res.json("Retry!");
              });
          });
        } catch (err) {
          console.log(err);
          res.send({ message: "Table Reserved Error" });
        }
      }
      return res.status(200).send("hello world");
      
    }
  }
);

module.exports = router;
