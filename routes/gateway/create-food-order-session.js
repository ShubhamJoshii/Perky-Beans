const express = require("express");
const BagsModel = require("../../Models/bags");
const ProductsModel = require("../../Models/products");
const UserModel = require("../../Models/user");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51PIBzKBApeRXee97uPySRxxaoR5XfWjVchRVQVMlsjvxMsMLtx1bgUzE92et7CFQIOoU30O32mej0dCK9kBarrQq002aKJ4oCo"
);

// const YOUR_DOMAIN = 'http://localhost:3000';

router.post("/create-food-order-session", async (req, res) => {
  // const { userId, orderId, URL } = req.body;
  const {
    Delivery_Charge,
    GST,
    Discount,
    TotalAmountPayed,
    Coupon_ID,
    Address,
    paymentThrough,
    URL,
    userID,
    Full_Name,
    Email,
  } = req.body;
  const DOMAIN = req.headers.origin;

  const bagData = await BagsModel.findOne({ user_id: userID });
  const userData = await UserModel.findOne(
    { _id: userID },
    "Full_Name Address"
  );
  const productIDs = bagData.Bag.map((e) => e.productID);
  const products = await ProductsModel.find(
    { _id: { $in: productIDs } },
    "Product_Photo Product_Name Price type Category"
  );
  let address = userData.Address.find(
    (e) => Address.includes(e.FlatNumber) && Address.includes(e.Locality)
  );
  // console.log(address);
  // console.log(Address);

  let line_items = [];
  products.map((curr) => {
    const bag = bagData.Bag.find((e) => e.productID === curr._id);
    console.log(bag.LargeCount, bag.MediumCount, bag.SmallCount);
    let temp = [];
    if (bag?.SmallCount > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: `${curr.Product_Name} Small`,
            description: `${curr.Category}`,
            images: [`${curr.Product_Photo}`],
          },
          unit_amount: (curr.Price - 50) * 100,
        },
        tax_rates: ["txr_1PIzptBApeRXee9760A98v6A"],
        quantity: bag?.SmallCount,
      });
    }
    if (bag?.MediumCount > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: `${curr.Product_Name} Medium`,
            description: `${curr.Category}`,
            images: [`${curr.Product_Photo}`],
          },
          unit_amount: curr.Price * 100,
        },
        tax_rates: ["txr_1PIzptBApeRXee9760A98v6A"],
        quantity: bag?.MediumCount,
      });
    }
    if (bag?.LargeCount > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: `${curr.Product_Name} Large`,
            description: `${curr.Category}`,
            images: [`${curr.Product_Photo}`],
          },
          unit_amount: (curr.Price + 50) * 100,
        },
        tax_rates: ["txr_1PIzptBApeRXee9760A98v6A"],
        quantity: bag?.LargeCount,
      });
    }
  });

  let discounts;
  if (Coupon_ID) {
    discounts = [{ coupon: Coupon_ID }];
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [...line_items],
    mode: "payment",
    discounts,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Within an Hour Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: Delivery_Charge * 100, // Set the shipping amount based on the total
            currency: "inr",
          },
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 1,
            },
            maximum: {
              unit: "hour",
              value: 1,
            },
          },
        },
      },
    ],
    customer_email: Email,
    success_url: `${DOMAIN}${URL}/bag/success`,
    cancel_url: `${DOMAIN}${URL}/bag/canceled`,
    metadata: {
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
      type: "order-food",
    },
  });

  // res.redirect(303, session.url);
  res.json({ id: session.id });
});

module.exports = router;
