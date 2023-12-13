const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database CONNECTED");
  })
  .catch((err) => {
    console.log("Database ERROR", err);
  });

const UserSchema = new mongoose.Schema({
  Full_Name: {
    type: String,
    require: true,
  },
  Role: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  EmailToken: {
    type: String,
    require: true,
  },
  isVerified: {
    type: Boolean,
    require: true,
  },
  Password: {
    type: String,
    require: true,
  },
  Confirm_Password: {
    type: String,
    require: true,
  },
  Login: [
    {
      Login_Date: {
        type: String,
        require: true,
      },
    },
  ],
  RegisterDate:{
    type:Date,
    default:Date.now
  },
  Bag: [
    {
      productID: {
        type: String,
        require: true,
      },
      SmallCount: {
        type: Number,
        require: true,
      },
      MediumCount: {
        type: Number,
        require: true,
      },
      LargeCount: {
        type: Number,
        require: true,
      },
    },
  ],
  Coupon_Used: [
    {
      Name: {
        type: String,
      },
    },
  ],
  Wishlist: [
    {
      productID: {
        type: String,
        require: true,
      },
    },
  ],
  Orders: [
    {
      productID: {
        type: String,
        require: true,
      },
      SmallCount: {
        type: Number,
        require: true,
      },
      MediumCount: {
        type: Number,
        require: true,
      },
      LargeCount: {
        type: Number,
        require: true,
      },
      orderedAt: {
        type: Date,
        require: true,
      },
    },
  ],
  Tokens: [
    {
      Token: {
        type: String,
        require: true,
      },
    },
  ],
});

const UserOTPVerification = new mongoose.Schema({
  userID: String,
  OTP: String,
  createdAt: Date,
  expiresAt: Date,
});

const ContactDB = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  Contact_Number: {
    type: Number,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  Description: {
    type: String,
    require: true,
  },
  UserRegistered: {
    type: Boolean,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
  },
});

const reserveSeatDB = new mongoose.Schema({
  token: {
    type: String,
    require: true,
  },
  User_ID: {
    type: String,
    require: true,
  },
  User_Name: {
    type: String,
    require: true,
  },
  User_Email: {
    type: String,
    require: true,
  },
  Contact_Number: {
    type: String,
    require: true,
  },
  Person_Count: {
    type: String,
    require: true,
  },
  Booking_DateTime: {
    type: String,
    require: true,
  },
  reservation_Date: {
    type: String,
    require: true,
  },
  reservation_Timing: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
});

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

const ordersDB = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
  Coupon_Used: {
    type: String,
  },
  Orders: [
    {
      productID: {
        type: String,
        require: true,
      },
      SmallCount: {
        type: Number,
        require: true,
      },
      MediumCount: {
        type: Number,
        require: true,
      },
      LargeCount: {
        type: Number,
        require: true,
      },
    },
  ],
  TotalAmountPayed: {
    type: Number,
    require: true,
  },
  GST: {
    type: Number,
    require: true,
    default: 0,
  },
  Delivery_Charge: {
    type: Number,
    require: true,
    default: 0,
  },
  Discount: {
    type: Number,
    require: true,
    default: 0,
  },
  status: {
    type: String,
    require: true,
  },
});

const bagsDB = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  Bag: [
    {
      productID: {
        type: String,
        require: true,
      },
      SmallCount: {
        type: Number,
        require: true,
      },
      MediumCount: {
        type: Number,
        require: true,
      },
      LargeCount: {
        type: Number,
        require: true,
      },
    },
  ],
});

const WishlistDB = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  Wishlist: [
    {
      productID: {
        type: String,
        require: true,
      },
    },
  ],
});

const CouponDB = new mongoose.Schema({
  Code: {
    type: String,
    require: true,
  },
  Discount_Allot: {
    type: String,
    require: true,
  },
  ExpiredAt: {
    type: String,
    require: true,
  },
  Description: {
    type: String,
    require: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 12);
    this.Confirm_Password = await bcrypt.hash(this.Confirm_Password, 12);
  }
  next();
});

UserSchema.methods.addtoBag = async function (Message, time, whoWrote) {
  console.log(Message, time, whoWrote);
  this.Messages = this.Messages.concat({
    Message,
    whoWrote,
    time,
  });
  await this.save();
  return this.Messages;
};

UserSchema.methods.generateAuthToken = async function () {
  try {
    let Token = jwt.sign({ _id: this._id }, SECRET_KEY);
    this.Tokens = this.Tokens.concat({ Token: Token });
    await this.save();
    return Token;
  } catch (err) {
    console.log(err);
  }
};

const DBModel = mongoose.model("User_Register", UserSchema);
const OTPVerfication = mongoose.model("OTP_Verification", UserOTPVerification);
const ContactModel = mongoose.model("Contact", ContactDB);
const ReserveSeatModel = mongoose.model("Reserve_Seat", reserveSeatDB);
const OrdersModel = mongoose.model("Orders", ordersDB);
const BagsModel = mongoose.model("Bags", bagsDB);
const WishlistsModel = mongoose.model("Wishlists", WishlistDB);
const ProductsModel = mongoose.model("Products", ProductsDB);
const CouponModel = mongoose.model("Coupons", CouponDB);

module.exports = {
  DBModel,
  OTPVerfication,
  ContactModel,
  ReserveSeatModel,
  ProductsModel,
  OrdersModel,
  BagsModel,
  WishlistsModel,
  CouponModel,
};
