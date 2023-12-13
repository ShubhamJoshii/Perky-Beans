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
let addRoute = "/api/";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

router.get(`${addRoute}home`, Authenication, async (req, res) => {
  if (req.rootUser) {
    res.send({ data: req.rootUser, status: true });
  } else {
    res.send({ status: false });
  }
});

router.post(`${addRoute}register`, async (req, res) => {
  const { Full_Name, Email, Password, Confirm_Password } = req.body;
  console.log(req.body);
  let EmailToken = require("crypto").randomBytes(32).toString("hex");
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
            <a href="http://${req.headers.host}/user/verify-email?token=${EmailToken}" style="padding: 5px;background-color: brown;color: white;font-size: 22px;text-decoration: none;padding: 6px 15px;"}>Verify Email</a>`,
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
    console.log(user, "Hello WORLD");
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

router.post(`${addRoute}login`, async (req, res) => {
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
        console.log(Token);
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

router.get(`${addRoute}logout`, Authenication, async (req, res) => {
  res.clearCookie("perkyBeansToken", { path: "/" });
  res.status(200).send("User Logout");
  // res.send(req.rootUser);
});

router.post(`${addRoute}fetchProduct`, async (req, res) => {
  const { Available } = req.body;
  if (Available) {
    const products = await ProductsModel.find({ Available: true });
    res.send({ data: products });
  } else {
    const products = await ProductsModel.find();
    res.send({ data: products });
  }
});

router.post(`${addRoute}fetchProductDetails`, async (req, res) => {
  const { _id } = req.body;
  const productDetails = await ProductsModel.findOne({ _id });
  productDetails
    ? res.send({ data: productDetails, found: true })
    : res.send({ data: "Error", found: false });
});

router.post(`${addRoute}updateProduct`, async (req, res) => {
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

router.post(`${addRoute}deleteProduct`, async (req, res) => {
  // console.log(req.body);
  const { _id } = req.body;
  const deleteProduct = await ProductsModel.deleteOne({ _id });
  deleteProduct
    ? res.send({ message: "Product Deleted" })
    : res.send({ message: "Product Not Deleted Try Again" });
});

router.post(`${addRoute}contact`, async (req, res) => {
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
    console.log(seatFind, "Hello WORLD");
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

router.post(`${addRoute}productReview`, Authenication, async (req, res) => {
  const { Description, rating, _id } = req.body;
  console.log(Description, rating, _id);
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

router.post(`${addRoute}reserveSeat`, Authenication, async (req, res) => {
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

router.post(`${addRoute}seatAvailable`, async (req, res) => {
  const { time, date } = req.body;
  // const fetchSeats = await ReserveSeatModel.find({reservation_Date : date});
  const fetchSeats = await ReserveSeatModel.countDocuments({
    reservation_Date: date,
    reservation_Timing: time,
  });
  console.log(fetchSeats);
  if (fetchSeats <= 10) {
    res.send({ message: "Seat Available", result: true });
  } else {
    res.send({ message: "Seat Not Available", result: true });
  }
});

// Wishlist Routes

router.get(`${addRoute}fetchWishlist`, Authenication, async (req, res) => {
  const fetchWishlist = await WishlistsModel.findOne({ user_id: req.userID });
  if (fetchWishlist) {
    res.send({ data: fetchWishlist.Wishlist, result: true });
  } else {
    res.send({ data: [], result: false });
  }
});

router.post(`${addRoute}addToWishlist`, Authenication, async (req, res) => {
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

router.post(
  `${addRoute}removefromWishlist`,
  Authenication,
  async (req, res) => {
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
  }
);

// Bags Routes
router.get(`${addRoute}fetchBag`, Authenication, async (req, res) => {
  const fetchBag = await BagsModel.findOne({ user_id: req.userID });
  // console.log(fetchBag.Bag);
  if (fetchBag) {
    res.send({ data: fetchBag.Bag, result: true });
  } else {
    res.send({ data: [], result: false });
  }
});

router.post(`${addRoute}addtoBag`, Authenication, async (req, res) => {
  const { productID, SmallCount, MediumCount, LargeCount } = req.body;
  try {
    const bagExist = await BagsModel.findOne({ user_id: req.userID });
    if (bagExist) {
      bagExist.Bag = await bagExist.Bag.concat({
        productID,
        SmallCount,
        MediumCount,
        LargeCount,
      });
      await bagExist.save();
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
    res.send("Add to bag");
  } catch (err) {
    res.send("Please Login");
    console.log(err);
  }
});

router.post(`${addRoute}updateBag`, Authenication, async (req, res) => {
  const { productID, SmallCount, MediumCount, LargeCount } = req.body;
  try {
    const bagExist = await BagsModel.findOne({ user_id: req.userID });
    if (bagExist) {
      let objIndex = await bagExist.Bag.findIndex(
        (obj) => obj.productID === productID
      );
      console.log(productID, SmallCount, MediumCount, LargeCount);
      bagExist.Bag[objIndex] = await {
        productID,
        SmallCount,
        MediumCount,
        LargeCount,
        _id: bagExist.Bag[objIndex]._id,
      };
      // console.log(bagExist)
      // bagExist.Bag = await bagExist.Bag.concat({
      //   productID,
      //   SmallCount,
      //   MediumCount,
      //   LargeCount,
      // })
      await bagExist.save();
    }
    res.send("Add to bag");
  } catch (err) {
    res.send("Please Login");
    console.log(err);
  }
});

router.post(`${addRoute}removeFromBag`, Authenication, async (req, res) => {
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

router.get(`${addRoute}fetchOrders`, Authenication, async (req, res) => {
  try {
    const fetchOrders = await OrdersModel.find({ user_id: req.userID });
    // console.log(fetchOrders);
    res.send({ data: fetchOrders, result: true });
  } catch (error) {
    console.log(error);
    res.send({ data: [], result: true });
  }
});

router.get(`${addRoute}fetchAllOrders`, Authenication, async (req, res) => {
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

router.post(`${addRoute}orderNow`, Authenication, async (req, res) => {
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

router.post(`${addRoute}cancelOrder`, Authenication, async (req, res) => {
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

router.post(`${addRoute}changeStatus`, async (req, res) => {
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

router.post(`${addRoute}forgetPassword/sendOTP`, async (req, res) => {
  const { Email } = req.body;
  try {
    const userExist = await DBModel.findOne({ Email });
    if (userExist) {
      const otp = `${Math.floor(Math.random() * 900000) + 100000}`;

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

router.post(`${addRoute}forgetPassword/otpVerify`, async (req, res) => {
  const { Email, OTP } = req.body;
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
      console.log(validOTP, hashedOTP, OTP);
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

router.post(`${addRoute}forgetPassword/updatePassword`, async (req, res) => {
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

router.post(`${addRoute}uploadImage`, async (req, res) => {
  uploadImage(req.body.image, req.body.folder)
    .then((url) => res.send(url))
    .catch((err) => res.send(500).send(err));
});

router.post(`${addRoute}saveProduct`, async (req, res) => {
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

router.get(`${addRoute}fetchUsers`, async (req, res) => {
  // console.log("Hllo");
  const usersData = await DBModel.find();
  usersData
    ? res.send({ message: "User Found", data: usersData })
    : res.send({ message: "No User Found" });
});

router.post(`${addRoute}updateUserRole`, Authenication, async (req, res) => {
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

router.post(`${addRoute}updateProductAvailability`, async (req, res) => {
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

router.get(`${addRoute}fetchUsersProductsCount`, async (req, res) => {
  // const users = await DBModel.countDocuments({Role:"Customer"});
  const users = await DBModel.find();
  let totalUsers = users.length;
  let todayDay = new Date().toISOString();
  todayDay = todayDay.split("T")[0];
  let OldTotalUsers = totalUsers - users.filter((e) => {
    let time = e.RegisterDate.toISOString().split("T")[0];
    if (time === todayDay) {
      return true;
    }
    return false;
  }).length;
  let percentage_users = ((totalUsers - OldTotalUsers)/OldTotalUsers * 100).toFixed(1); 
  
  
  const products = await ProductsModel.find();
  let Totalproducts = products.length;
  let TotalAvailableproducts = Totalproducts - products.filter((e) => {
    if (e.Available === false) {
      return true;
    }
    return false;
  }).length;
  let percentage_products = 100 - ((Totalproducts - TotalAvailableproducts)/TotalAvailableproducts * 100).toFixed(1); 
  
  
  const TotalOrder = await OrdersModel.find();
  let TotalTransaction = TotalOrder.length;
  let totalRevenue = 0;
  let totalTodayRevenue = 0;
  
  let totalTodayTransaction = TotalTransaction - TotalOrder.filter((e) => {
    let time = e.orderedAt.toISOString().split("T")[0];
    totalRevenue += e.TotalAmountPayed;
    if (time === todayDay) {
      totalTodayRevenue += e.TotalAmountPayed;
      return true;
    }
    return false;
  }).length;

  let percentage_transaction = ((TotalTransaction - totalTodayTransaction)/totalTodayTransaction * 100).toFixed(1); 
  let percentage_revenue = ((totalRevenue - totalRevenue + totalTodayRevenue)/totalTodayRevenue * 100).toFixed(1); 

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

router.post(`${addRoute}deleteUser`, async (req, res) => {
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

router.get(`${addRoute}reserveSeats`, async (req, res) => {
  // console.log()
  const reserveSeats = await ReserveSeatModel.find();
  // co
  res.send(reserveSeats);
});
router.get(`${addRoute}fetchReview`, async (req, res) => {
  const fetchReview = await ContactModel.find({ type: "Review" });
  if (fetchReview) {
    res.send(fetchReview);
  } else {
    res.send("hello world");
  }
});

router.get(`${addRoute}fetchCoupon`, async (req, res) => {
  try {
    const fetchCoupon = await CouponModel.find();
    res.send({ Data: fetchCoupon });
  } catch (err) {
    res.send("Error");
  }
});

router.post(`${addRoute}newCouponAdd`, Authenication, async (req, res) => {
  const { Code, Discount_Allot, Description } = req.body;
  var currDate = new Date();
  var result = currDate.setDate(currDate.getDate() + 10);
  let ExpiredAt = new Date(result);
  console.log(ExpiredAt);
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
