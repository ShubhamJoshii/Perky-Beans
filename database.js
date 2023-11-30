const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;

mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database CONNECTED");
  })
  .catch((err) => {
    console.log("Database ERROR", err);
  });


const DBSchema = new mongoose.Schema({
  Full_Name: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  EmailToken:{
    type:String,
    require:true
  },
  isVerified:{
    type:Boolean,
    require:true
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
  Wishlist: [
    {
      productID: {
        type: String,
        require: true,
      }
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
        require: true
      }
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
  expiresAt: Date
})

const ContactDB = new mongoose.Schema({
  Name: {
    type: String,
    require: true
  },
  Email: {
    type: String,
    require: true
  },
  Contact_Number: {
    type: Number,
    require: true
  },
  type: {
    type: String,
    require: true
  },
  Description: {
    type: String,
    require: true
  },
  UserRegistered: {
    type: Boolean,
    require: true
  },
})

const reserveSeatDB = new mongoose.Schema({
  User_ID: {
    type: String,
    require: true
  },Contact_Number: {
    type: String,
    require: true
  }, Person_Count: {
    type: String,
    require: true
  }, Booking_DateTime: {
    type: String,
    require: true
  }, Reserve_Date: {
    type: String,
    require: true
  }, Timing: {
    type: String,
    require: true
  }
})


DBSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 12);
    this.Confirm_Password = await bcrypt.hash(this.Confirm_Password, 12);
  }
  next();
});

DBSchema.methods.addtoBag = async function (Message, time, whoWrote) {
  console.log(Message, time, whoWrote);
  this.Messages = this.Messages.concat({
    Message,
    whoWrote,
    time
  });
  await this.save();
  return this.Messages;
};

DBSchema.methods.generateAuthToken = async function () {
  try {
    let Token = jwt.sign({ _id: this._id }, SECRET_KEY);
    this.Tokens = this.Tokens.concat({ Token: Token });
    await this.save();
    return Token;
  } catch (err) {
    console.log(err);
  }
};



const DBModel = mongoose.model("User_Register", DBSchema);
const OTPVerfication = mongoose.model("OTP_Verification", UserOTPVerification)
const ContactModel = mongoose.model("Contact", ContactDB)
const ReserveSeatModel = mongoose.model("Reserve_Seat", reserveSeatDB)

module.exports = { DBModel, OTPVerfication, ContactModel,ReserveSeatModel };