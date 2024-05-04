const express = require("express");
const router = express.Router();
const {
  DBModel,
  OTPVerfication,
  ContactModel,
  ReserveSeatModel,
  ProductsModel,
  BagsModel,
  WishlistsModel,
  OrdersModel,
  CouponModel,
} = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Authenication = require("./Authenication");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const uploadImage = require("./uploadImage");

// let addRoute = "/";
// let addRoute = "/api/";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

router.get(`/home`, Authenication, async (req, res) => {
  if (req.rootUser) {
    res.send({ data: req.rootUser, status: true });
  } else {
    res.send({ status: false });
  }
});

router.post(`/register`, async (req, res) => {
  const { Full_Name, Email, Password, Confirm_Password } = req.body;
  // console.log(req.body);
  let EmailToken = require("crypto").randomBytes(32).toString("hex");
  const env = process.env.NODE_ENV || "DEVELOPMENT";
  var VerfiedLink = `http://${req.headers.host}/api/user/verify-email?token=${EmailToken}`;
  if (env === "DEVELOPMENT") {
    VerfiedLink = `http://${req.headers.host}/user/verify-email?token=${EmailToken}`;
  }

  try {
    const userExist = await DBModel.findOne({ Email });
    if (!userExist) {
      const userData = new DBModel({
        Full_Name,
        Email,
        Password,
        Confirm_Password,
        EmailToken,
        Role: "Customer",
        isVerified: false,
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
            <p>Congratulations! You're almost set to start using Perky Beans- Cafe Web</p>
            <p>Just click the button below to validate your email address</p>
            <a href="${VerfiedLink}" style="padding: 5px;background-color: brown;color: white;font-size: 22px;text-decoration: none;padding: 6px 15px;"}>Verify Email</a>`,
          outro: "Looking forward",
        },
      };

      let mail = mailGenerator.generate(response);
      let message = {
        from: process.env.AUTH_EMAIL,
        to: Email,
        subject: "Perky Beans- Let's complete your account setup",
        html: mail,
      };

      await userData.save();
      await new Promise(async (resolve, reject) => {
        await transporter
          .sendMail(message)
          .then(() => {
            return res.json("Verification  email sent");
          })
          .catch(() => {
            // Delete Created User
            return res.json("Verification Error");
          });
      });

      // res.send("User Registered ");
    } else {
      res.send("User Email ID already Registered");
    }
  } catch (err) {
    console.log(err);
    res.send("Error! Try Again");
  }
});

router.get(`/user/verify-email`, async (req, res) => {
  try {
    const token = req.query.token;
    const user = await DBModel.findOne({ EmailToken: token });
    // console.log(user, "Hello WORLD");
    if (user.isVerified) {
      res.send("Email Already Verfied");
    }
    if (user) {
      user.EmailToken = null;
      user.isVerified = true;
      await user.save();
      res.send("Email Verfied");
    }
  } catch (err) {
    console.log(err);
    res.send("Email Already Verfied");
  }
});

router.post(`/login`, async (req, res) => {
  const { Email, Password, Login_Date } = req.body;
  try {
    const userExist = await DBModel.findOne({ Email });
    if (userExist) {
      const password_Match = await bcrypt.compare(Password, userExist.Password);
      if (!userExist.isVerified) {
        res.send("Please Verified your Email ID");
      } else if (password_Match) {
        userExist.Login = userExist.Login.concat({ Login_Date });
        const Token = await userExist.generateAuthToken();
        // console.log(Token);
        res.cookie("perkyBeansToken", Token, {
          expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });
        userExist.save();
        res.send("User logged in");
      } else {
        res.send("User Password not Matched");
      }
    } else {
      res.send("User Email is not registed");
    }
  } catch (err) {}
});

router.get(`/logout`, Authenication, async (req, res) => {
  res.clearCookie("perkyBeansToken", { path: "/" });
  res.status(200).send("User Logout");
  // res.send(req.rootUser);
});

router.get(`/fetchProduct`, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const Available = req.query.Available;
  const Category = req.query.Category || null;
  const Ingredients = req.query.Ingredients || null;
  const PriceRange = req.query.PriceRange || null;
  const RatingUP = req.query.RatingUP || null;
  const limit =
    parseInt(req.query.limit) || (await ProductsModel.countDocuments());
  const pageCount = (totalProduct) => {
    const pages = [];
    for (let i = 1; i <= Math.ceil(totalProduct / limit); i++) {
      pages.push(i);
    }
    return pages;
  };

  let totalProduct = (await ProductsModel.countDocuments()) || 1;
  let pages = pageCount(totalProduct);
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

router.get(`/fetchProductDetails`, async (req, res) => {
  const _id = req.query._id;
  const user_id = req.query.user_id || undefined;
  const productDetails = await ProductsModel.findOne({ _id });
  let Sizes = [
    {
      name: "regular",
      price: productDetails?.Price - 50,
      counter: 0,
    },
    {
      name: "medium",
      price: productDetails?.Price,
      counter: 0,
    },
    {
      name: "large",
      price: productDetails?.Price + 50,
      counter: 0,
    },
  ];
  let total =
    Sizes[0].price * Sizes[0].counter +
    Sizes[1].price * Sizes[1].counter +
    Sizes[2].price * Sizes[2].counter;

  if (user_id && productDetails) {
    const bagData = await BagsModel.findOne({ user_id });
    const bagDataProductFind = await bagData?.Bag.find(
      (item) => item.productID === _id
    );
    if (bagDataProductFind) {
      Sizes[0].counter = bagDataProductFind.SmallCount;
      Sizes[1].counter = bagDataProductFind.MediumCount;
      Sizes[2].counter = bagDataProductFind.LargeCount;
      total =
        Sizes[0].price * Sizes[0].counter +
        Sizes[1].price * Sizes[1].counter +
        Sizes[2].price * Sizes[2].counter;
      // console.log(Sizes)
      return res.send({ data: productDetails, Sizes, total, found: true });
    }
  }
  return productDetails
    ? res.send({ data: productDetails, Sizes, total, found: true })
    : res.send({ data: "Error", found: false });
});

router.post(`/updateProduct`, async (req, res) => {
  const {
    _id,
    Product_Photo,
    Product_Name,
    Description,
    Price,
    Rating,
    type,
    Category,
  } = req.body;
  //   console.log(req.body);
  const productDetails = await ProductsModel.updateOne(
    { _id },
    {
      $set: {
        Product_Photo,
        Product_Name,
        Description,
        Price,
        type,
        Rating,
        Category,
      },
    }
  );
  productDetails
    ? res.send({ message: "Product Updated" })
    : res.send({ message: "Product Not Updated Try Again" });
});

router.post(`/deleteProduct`, async (req, res) => {
  // console.log(req.body);
  const { _id } = req.body;
  const deleteProduct = await ProductsModel.deleteOne({ _id });
  deleteProduct
    ? res.send({ message: "Product Deleted" })
    : res.send({ message: "Product Not Deleted Try Again" });
});

router.post(`/contact`, async (req, res) => {
  const { _id, Name, Email, type, Contact_Number, Description, rating } =
    req.body;
  let UserRegistered = false;
  try {
    const userExist = DBModel.findOne({ _id });
    if (_id && userExist) {
      UserRegistered = true;
    } else {
      UserRegistered = false;
    }
    const contactData = new ContactModel({
      Name,
      Email,
      type,
      Contact_Number,
      Description,
      UserRegistered,
      rating,
    });
    await contactData.save();
    res.send({ message: `${type} submitted`, Success: true });
  } catch (err) {
    res.send({ message: `${type} submittion Error `, Success: false });
  }
});

router.get(`/booking/cancel`, async (req, res) => {
  try {
    const token = req.query.token;
    const seatFind = await ReserveSeatModel.findOne({ token: token });
    if (seatFind.status === "Cancelled") {
      res.send("Already Cancelled Reserved Seat");
    }
    if (seatFind) {
      seatFind.status = "Cancelled";
      await seatFind.save();
      res.send("Seat Reservation Cancelled");
    }
  } catch (err) {
    console.log(err);
    res.send("Already Cancelled Reserved Seat");
  }
});

router.post(`/productReview`, Authenication, async (req, res) => {
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

router.post(`/reserveSeat`, Authenication, async (req, res) => {
  const { Contact_Number, Person_Count, Date, Timing, Booking_DateTime } =
    req.body;
  let token = require("crypto").randomBytes(32).toString("hex");
  try {
    const userExist = DBModel.findOne({ _id: req.rootUser._id });
    if (userExist) {
      const contactData = new ReserveSeatModel({
        token: token,
        User_ID: req.rootUser._id,
        Contact_Number,
        Person_Count,
        User_Name: req.rootUser.Full_Name,
        User_Email: req.rootUser.Email,
        reservation_Date: Date,
        Booking_DateTime,
        status: "Confirmed",
        reservation_Timing: Timing,
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
          name: `${req.rootUser.Full_Name}`,
          intro: `
            <p>We hope this email finds you well. Thank you for choosing PerkyBeans for your upcoming visit. We're delighted to confirm your reservation for a seat at our café.</p>
            <p><strong>Reservation Details:</strong><p>
            <ul>
              <li>Reservation Date: ${Date}</li>
              <li>Reservation Time:  ${Timing}</li>
              <li>Number of Guests:  ${Person_Count}</li>
              <li>Reserved Seat Number:  ${"10"}</li>
            </ul>
            <p><strong>Additional Information:</strong><p>
            <ul>
              <li>Your reservation is confirmed under the name of ${
                req.rootUser.User_Name
              }.</li>
              <li>If you need to modify or cancel your reservation, please contact us at "perkybeans9@gmail.com" or 
              <a href="http://${
                req.headers.host
              }/booking/cancel?token=${token}">cancel reservation</a>
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
        to: req.rootUser.Email,
        subject: "Your Reserved Seat Confirmation at PerkyBeans",
        html: mail,
      };

      await new Promise(async (resolve, reject) => {
        await transporter
          .sendMail(message)
          .then(async () => {
            await contactData.save();
            return res.json({ message: "Seat Reserved. Check Mail!" });
          })
          .catch(() => {
            return res.json("Retry!");
          });
      });
    } else {
      res.send({ message: "Please Login" });
    }
  } catch (err) {
    res.send({ message: "Seat Reserved Error" });
    // console.log(err);
  }
});

router.post(`/seatAvailable`, async (req, res) => {
  const { time, date } = req.body;
  // const fetchSeats = await ReserveSeatModel.find({reservation_Date : date});
  const fetchSeats = await ReserveSeatModel.countDocuments({
    reservation_Date: date,
    reservation_Timing: time,
  });
  if (fetchSeats <= 10) {
    res.send({ message: "Seat Available", result: true });
  } else {
    res.send({ message: "Seat Not Available", result: true });
  }
});

// Wishlist Routes
// "productID": "abfde642"
router.get(`/fetchWishlist`, Authenication, async (req, res) => {
  const fetchWishlist = await WishlistsModel.findOne({ user_id: req.userID });
  const products = await ProductsModel.find(
    {},
    {
      productID: "$_id",
      Product_Photo: 1,
      Product_Name: 1,
      Description: 1,
      Price: 1,
      type: 1,
    }
  );
  const data = products.filter((item) => {
    let temp = fetchWishlist.Wishlist.find((e) => item._id === e.productID);
    if (temp) {
      item._id = temp._id;
      return true;
    }
    return false;
  });
  if (fetchWishlist) {
    res.send({ data, result: true });
  } else {
    res.send({ data: [], result: false });
  }
});

router.post(`/addToWishlist`, Authenication, async (req, res) => {
  const { productID } = req.body;
  try {
    const wishlistExist = await WishlistsModel.findOne({ user_id: req.userID });
    if (wishlistExist) {
      wishlistExist.Wishlist = await wishlistExist.Wishlist.concat({
        productID,
      });
      await wishlistExist.save();
    } else {
      const Wishlist = await WishlistsModel({
        user_id: req.userID,
        Wishlist: [{ productID }],
      });
      await Wishlist.save();
    }
    res.send("Add to Wishlist");
  } catch (err) {
    res.send("Please Login");
  }
});

router.post(`/removefromWishlist`, Authenication, async (req, res) => {
  const { productID } = req.body;
  try {
    const wishlistExist = await WishlistsModel.findOne({
      user_id: req.userID,
    });
    wishlistExist.Wishlist = await wishlistExist.Wishlist.filter(
      (e) => e.productID !== productID
    );
    wishlistExist.save();
    res.send("Remove from Wishlist");
  } catch (err) {
    console.log(err);
  }
});

// Bags Routes
router.get(`/fetchBag`, Authenication, async (req, res) => {
  const fetchBag = await BagsModel.findOne({ user_id: req.userID });
  // console.log(fetchBag.Bag);
  if (fetchBag) {
    res.send({ data: fetchBag.Bag, result: true });
  } else {
    res.send({ data: [], result: false });
  }
});

// router.post(`/addtoBag`, Authenication, async (req, res) => {
//   const { productID, SmallCount, MediumCount, LargeCount } = req.body;
//   try {
//     const bagExist = await BagsModel.findOne({ user_id: req.userID });
//     if (bagExist) {
//       bagExist.Bag = await bagExist.Bag.concat({
//         productID,
//         SmallCount,
//         MediumCount,
//         LargeCount,
//       });
//       await bagExist.save();
//     } else {
//       const Bag = await BagsModel({
//         user_id: req.userID,
//         Bag: [
//           {
//             productID,
//             SmallCount,
//             MediumCount,
//             LargeCount,
//           },
//         ],
//       });
//       await Bag.save();
//     }
//     res.send("Add to bag");
//   } catch (err) {
//     res.send("Please Login");
//     console.log(err);
//   }
// });

router.post(`/updateBag`, Authenication, async (req, res) => {
  const { productID, SmallCount, MediumCount, LargeCount } = req.body;
  try {
    const bagExist = await BagsModel.findOne({ user_id: req.userID });
    if (bagExist) {
      if (
        bagExist.Bag.find((item) => item.productID !== productID) ||
        bagExist.Bag.length === 0
      ) {
        bagExist.Bag = await bagExist.Bag.concat({
          productID,
          SmallCount,
          MediumCount,
          LargeCount,
        });
        await bagExist.save();
      } else {
        let bagData = bagExist.Bag.map((item) => {
          if (item.productID === productID) {
            return {
              productID,
              SmallCount,
              MediumCount,
              LargeCount,
            };
          } else {
            return item;
          }
        });
        bagExist.Bag = bagData;
        await bagExist.save();
      }
    } else {
      const Bag = await BagsModel({
        user_id: req.userID,
        Bag: [
          {
            productID,
            SmallCount,
            MediumCount,
            LargeCount,
          },
        ],
      });
      await Bag.save();
    }
    res.send("Added to bag");
  } catch (err) {
    res.send("Please Login");
    console.log(err);
  }
});

router.post(`/removeFromBag`, Authenication, async (req, res) => {
  const { productID } = req.body;
  try {
    const fetchBag = await BagsModel.findOne({ user_id: req.userID });
    fetchBag.Bag = await fetchBag.Bag.filter((e) => e.productID !== productID);
    await fetchBag.save();
    res.send("Remove from bag");
  } catch (err) {
    console.log(err);
  }
});

router.get(`/fetchOrders`, Authenication, async (req, res) => {
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

router.get(`/fetchAllOrders`, Authenication, async (req, res) => {
  try {
    if (req.rootUser.Role === "Admin") {
      const fetchOrders = await OrdersModel.find();
      // console.log(fetchOrders);
      res.send({ data: fetchOrders, result: true });
    }
  } catch (error) {
    console.log(error);
    res.send({ data: [], result: true });
  }
});

router.post(`/orderNow`, Authenication, async (req, res) => {
  // let orderedAt = Date.now();
  // console.log(Date.now());
  const { Delivery_Charge, GST, Discount, TotalAmountPayed, Coupon_ID } =
    req.body;
  // console.log(Delivery_Charge, GST, Discount);
  try {
    const bagData = await BagsModel.findOne({ user_id: req.userID });
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
      });
      const bagDataDelete = await BagsModel.deleteOne({ user_id: req.userID });
      await orderExists.save();
      // await bagDataDelete.save();
      if (Coupon_ID) {
        const userExist = await DBModel.findOne({ _id: req.userID });

        // const usersData = await DBModel.updateOne(
        //   { _id : req.userID },
        //   {
        //     $set: { Coupon_Used: Coupon_ID },
        //   }
        // );
        userExist.Coupon_Used = await userExist.Coupon_Used.concat({
          Name: Coupon_ID,
        });
        await userExist.save();
      }
      res.send("Product Ordered");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post(`/cancelOrder`, Authenication, async (req, res) => {
  const { _id } = req.body;
  try {
    const orderExist = await OrdersModel.updateOne(
      { _id },
      {
        $set: { status: "Order Cancelled" },
      }
    );
    if (orderExist) {
      res.send("Product Order Cancelled");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post(`/changeStatus`, async (req, res) => {
  const { _id, status } = req.body;
  // console.log(_id,status)
  try {
    const changeStatus = await OrdersModel.updateOne(
      { _id },
      {
        $set: { status },
      }
    );
    if (changeStatus) {
      res.send({ message: "Order Status Updated", result: true });
    } else {
      res.send({ message: "Order Status Not Updated", result: false });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post(`/forgetPassword/sendOTP`, async (req, res) => {
  const { Email } = req.body;
  try {
    const userExist = await DBModel.findOne({ Email });
    if (userExist) {
      const otp = `${Math.floor(Math.random() * 90000) + 10000}`;

      // const transporter = await nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.AUTH_EMAIL,
      //     pass: process.env.AUTH_PASS,
      //   },
      // });

      const otpPreviousSave = await OTPVerfication.deleteMany({
        userID: userExist._id,
      });
      // await otpPreviousSave.save();

      const hashedOTP = await bcrypt.hash(otp, 12);

      const otpDBSave = new OTPVerfication({
        userID: userExist._id,
        OTP: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000,
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
          name: `${userExist.Full_Name}`,
          intro: `<p>Enter <b>${otp}</b> in the app to verify your Email address and then re-set your password</p>`,
          outro: "Looking forward",
        },
      };

      let mail = mailGenerator.generate(response);
      let message = {
        from: process.env.AUTH_EMAIL,
        to: Email,
        subject: "Verify Your Email",
        html: mail,
      };

      await new Promise(async (resolve, reject) => {
        await transporter
          .sendMail(message)
          .then(async () => {
            await otpDBSave.save();
            return res.json({
              status: true,
              message: "Verification OTP email sent",
            });
          })
          .catch(() => {
            return res.json({ message: "OTP Generation Error" });
          });
      });
    } else {
      res.send({ message: "Email is not Registered" });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "Mail not send" });
  }
});

router.post(`/forgetPassword/otpVerify`, async (req, res) => {
  const { Email, OTP } = req.body;
  // console.log(OTP);
  try {
    const userExist = await DBModel.findOne({ Email });
    const userOTPFind = await OTPVerfication.find({ userID: userExist._id });
    const { expiresAt } = userOTPFind[0];
    const hashedOTP = userOTPFind[0].OTP;
    if (expiresAt < Date.now()) {
      await OTPVerfication.deleteMany({ userID: userExist._id });
      res.send({
        status: false,
        message: "OTP is expired. Please request Again",
      });
    } else {
      // const password_Match = await bcrypt.compare(Password, userExist.Password);
      let validOTP = await bcrypt.compare(OTP, hashedOTP);
      // console.log(validOTP, hashedOTP, OTP);
      if (validOTP) {
        // await OTPVerfication.deleteMany({ userID: userExist._id });
        res.send({ status: true, message: "Valid OTP. Enter New Password" });
      } else {
        res.send({ status: false, message: "Invalid OTP. Please Try Again" });
      }
    }
  } catch (error) {
    res.send({ status: false, message: "Invalid Email" });
  }
});

router.post(`/forgetPassword/updatePassword`, async (req, res) => {
  const { Email, OTP, Password, Confirm_Password } = req.body;
  // console.log(req.body);
  try {
    const userExist = await DBModel.findOne({ Email });
    await userExist.updateOne({ Password: await bcrypt.hash(Password, 12) });
    await userExist.updateOne({
      Confirm_Password: await bcrypt.hash(Confirm_Password, 12),
    });
    await userExist.save();
    res.send({ status: true, message: "Password Updated" });
  } catch (err) {
    res.send({ status: false, message: "Error Occurs! Please Try Again" });
  }
});

// Admin Routes

router.post(`/uploadImage`, async (req, res) => {
  uploadImage(req.body.image, req.body.folder)
    .then((url) => res.send(url))
    .catch((err) => res.send(500).send(err));
});

router.post(`/saveProduct`, async (req, res) => {
  const {
    Product_Name,
    Description,
    Price,
    Category,
    Product_Photo,
    Rating,
    type,
  } = req.body;
  // console.log(Category);
  let _id = require("crypto").randomBytes(4).toString("hex");
  try {
    const productData = new ProductsModel({
      _id,
      Product_Name,
      Description,
      Price,
      Category,
      Product_Photo,
      Rating,
      type,
    });
    await productData.save();
    res.send({ message: "Product Registered", result: true });
  } catch (err) {
    res.send({ message: "Product Not Registered. Try Again", result: false });
  }
});

router.get(`/fetchUsers`, async (req, res) => {
  // console.log("Hllo");
  const usersData = await DBModel.find();
  usersData
    ? res.send({ message: "User Found", data: usersData })
    : res.send({ message: "No User Found" });
});

router.post(`/updateUserRole`, Authenication, async (req, res) => {
  const { _id, Role } = req.body;
  // console.log(req.rootUser);
  // console.log(_id);
  if (req.rootUser.Role === "Admin") {
    let NewRole;
    if (Role === "Admin") {
      NewRole = "Customer";
    } else {
      NewRole = "Admin";
    }

    const usersData = await DBModel.updateOne(
      { _id },
      {
        $set: { Role: NewRole },
      }
    );

    usersData
      ? res.send({ message: "User Role Updated", result: true })
      : res.send({ message: "User Role Not Updated", result: false });
  } else {
    res.send({ message: "Admin can only update ROLE", result: false });
  }
});

router.post(`/updateProductAvailability`, async (req, res) => {
  const { _id, isAvailable } = req.body;
  // console.log(req.body);
  const productsData = await ProductsModel.updateOne(
    { _id },
    {
      $set: { Available: isAvailable },
    }
  );

  productsData
    ? res.send({ message: "Product Availability Updated", result: true })
    : res.send({ message: "Product Availability  Not Updated", result: false });
});

router.get(`/fetchUsersProductsCount`, async (req, res) => {
  // const users = await DBModel.countDocuments({Role:"Customer"});
  const users = await DBModel.find();
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

router.get(`/fetchRevenueTransaction`, async (req, res) => {
  try {
    const fetchOrders = await OrdersModel.find();
    res.send({ orders: fetchOrders });
  } catch (err) {
    console.log(err);
  }
});

router.post(`/deleteUser`, async (req, res) => {
  const { _id } = req.body;
  try {
    const findAdmins = await DBModel.countDocuments({ Role: "Admin" });
    if (findAdmins === 1) {
      res.send({ message: "You Can't Delete It", result: false });
    } else {
      const deleteUser = await DBModel.deleteOne({ _id });
      res.send({ message: "User Deleted", result: true });
    }
  } catch (err) {
    res.send({ message: "Error ! User Not Deleted", result: false });
  }
});

router.get(`/reserveSeats`, async (req, res) => {
  // console.log()
  const reserveSeats = await ReserveSeatModel.find();
  // co
  res.send(reserveSeats);
});
router.get(`/fetchReview`, async (req, res) => {
  const fetchReview = await ContactModel.find({ type: "Review" });
  if (fetchReview) {
    res.send(fetchReview);
  } else {
    res.send("hello world");
  }
});

router.get(`/fetchCoupon`, async (req, res) => {
  try {
    const fetchCoupon = await CouponModel.find();
    res.send({ Data: fetchCoupon });
  } catch (err) {
    res.send("Error");
  }
});

router.post(`/newCouponAdd`, Authenication, async (req, res) => {
  const { Code, Discount_Allot, Description } = req.body;
  var currDate = new Date();
  var result = currDate.setDate(currDate.getDate() + 10);
  let ExpiredAt = new Date(result);
  // console.log(ExpiredAt);
  try {
    if (req.rootUser.Role === "Admin") {
      const findExist = await CouponModel.findOne({ Code });
      if (!findExist) {
        const couponAdd = await CouponModel({
          Code,
          Discount_Allot,
          ExpiredAt,
          Description,
        });
        await couponAdd.save();
        res.send({ message: "Coupon Added", result: true });
      } else {
        res.send({ message: "Coupon Already Exist", result: false });
      }
    }
  } catch (err) {
    res.send({ message: "Only Admin can Create Coupon" });
    // console.log(err)
  }
});
module.exports = router;
