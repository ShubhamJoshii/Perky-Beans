const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.SECRET_KEY;

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
  Address: [
    {
      FlatNumber: {
        type: String,
        require: true,
      },
      Floor: {
        type: String,
        require: false,
      },
      Locality: {
        type: String,
        require: true,
      },
      landmark: {
        type: String,
        require: false,
      },
      Name: {
        type: String,
        require: true,
      },
      Contact_Number: {
        type: Number,
        require: true,
      },
      AddressAs: {
        type: String,
        require: true,
      },
      State:{
        type: String,
        require: true,
      }
    },
  ],
  Login: [
    {
      Login_Date: {
        type: String,
        require: true,
      },
    },
  ],
  RegisterDate: {
    type: Date,
    default: Date.now,
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

const UserModel = mongoose.model("User_Register", UserSchema);

module.exports = UserModel;
