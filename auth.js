const express = require('express');
const router = express.Router();
const { DBModel, OTPVerfication, ContactModel,ReserveSeatModel } = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Authenication = require("./Authenication");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

let addRoute = "/";
// let addRoute = "/api/";

router.get(`${addRoute}home`, Authenication, async (req, res) => {
    if (req.rootUser) {
        res.send({ data: req.rootUser, status: true });
    } else {
        res.send({ status: false });
    }
});

router.get(`${addRoute}logout`, Authenication, async (req, res) => {
    res.clearCookie("perkyBeansToken", { path: "/" });
    res.status(200).send("User Logout");
    // res.send(req.rootUser);
});

router.post(`${addRoute}register`, async (req, res) => {
    const { Full_Name, Email, Password, Confirm_Password } = req.body;
    try {
        const userExist = await DBModel.findOne({ Email });
        if (!userExist) {
            const userData = new DBModel({
                Full_Name, Email, Password, Confirm_Password
            })
            await userData.save();
            res.send("User Registered");
        } else {
            res.send("User Email ID already Registered");
        }
    } catch (err) {
        res.send("Error! Try Again");
    }
})

router.post(`${addRoute}login`, async (req, res) => {
    const { Email, Password, Login_Date } = req.body;
    try {
        const userExist = await DBModel.findOne({ Email });
        if (userExist) {
            const password_Match = await bcrypt.compare(Password, userExist.Password);
            if (password_Match) {
                userExist.Login = userExist.Login.concat({ Login_Date });
                const Token = await userExist.generateAuthToken();
                console.log(Token);
                res.cookie("perkyBeansToken", Token, {
                    expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                });
                userExist.save();
                res.send("User Logined");
            } else {
                res.send("User Password not Matched");
            }
        } else {
            res.send("User Email is not registed");
        }
    } catch (err) { }
})

router.post(`${addRoute}contact`, async (req, res) => {
    const { _id, Name, Email, type, Contact_Number, Description } = req.body;
    console.log(req.body);
    let UserRegistered = false;
    try{
        const userExist = DBModel.findOne({_id});
        if(_id && userExist){
            UserRegistered = true;
        } else{
            UserRegistered = false;
        }
        const contactData = new ContactModel({ Name, Email, type, Contact_Number, Description,UserRegistered});
        await contactData.save();
        res.send({message:"Contact Message"});
    }catch(err){
        res.send({message:"Contact Message Error"});
        console.log(err);
    }
})

router.post(`${addRoute}reserveSeat`,Authenication, async (req, res) => {
    const { Contact_Number, Person_Count, Date, Timing } = req.body;
    console.log(req.body);
    try{
        const userExist = DBModel.findOne({_id:req.userID});
        if( userExist){
            const contactData = new ReserveSeatModel({ User_ID:req.userID, Contact_Number, Person_Count, Date, Timing });
            await contactData.save();
            res.send({message:"Seat Reserved"});
        } else{
            res.send({message:"Please Login"});
        }
    }catch(err){
        res.send({message:"Seat Reserved Error"});
        // console.log(err);
    }
})

router.post(`${addRoute}addToWishlist`, Authenication, async (req, res) => {
    const { productID } = req.body;
    try {
        const userExist = await DBModel.findOne({ _id: req.userID });
        userExist.Wishlist = await userExist.Wishlist.concat({ productID });
        userExist.save();
        res.send("Add to Wishlist");
    } catch (err) {
        console.log(err);
    }
})

router.post(`${addRoute}removefromWishlist`, Authenication, async (req, res) => {
    const { productID } = req.body;
    try {
        const userExist = await DBModel.findOne({ _id: req.userID });
        userExist.Wishlist = await userExist.Wishlist.filter(e => e.productID !== productID);
        userExist.save();
        res.send("Remove from Wishlist");
    } catch (err) {
        console.log(err);
    }
})

router.post(`${addRoute}updateBag`, Authenication, async (req, res) => {
    const { productID, SmallCount, MediumCount, LargeCount } = req.body;
    // console.log(req.body);
    try {
        const userExist = await DBModel.findOne({ _id: req.userID });
        let objIndex = await userExist.Bag.findIndex((obj => obj.productID == productID));
        userExist.Bag[objIndex] = await { productID, SmallCount, MediumCount, LargeCount };
        await userExist.save();
        res.send("Add to bag");
    } catch (err) {
        console.log(err);
    }
})
router.post(`${addRoute}addtoBag`, Authenication, async (req, res) => {
    const { productID, SmallCount, MediumCount, LargeCount } = req.body;
    try {
        const userExist = await DBModel.findOne({ _id: req.userID });
        userExist.Bag = await userExist.Bag.concat({ productID, SmallCount, MediumCount, LargeCount });
        userExist.save();
        res.send("Add to bag");
    } catch (err) {
        console.log(err);
    }
})

router.post(`${addRoute}removeFromBag`, Authenication, async (req, res) => {
    const { productID } = req.body;
    try {
        const userExist = await DBModel.findOne({ _id: req.userID });
        userExist.Bag = await userExist.Bag.filter(e => e.productID !== productID);
        userExist.save();
        res.send("Remove from bag");
    } catch (err) {
        console.log(err);
    }
})

router.post(`${addRoute}orderNow`, Authenication, async (req, res) => {
    console.log(Date.now());
    let orderedAt = Date.now();
    try {
        const userExist = await DBModel.findOne({ _id: req.userID });
        userExist.Orders = await userExist.Orders.concat(...userExist.Bag);
        userExist.Bag = await [];
        userExist.save()
        res.send("Product Ordered");
    } catch (err) {
        console.log(err);
    }
})
router.post(`${addRoute}cancelOrder`, Authenication, async (req, res) => {
    const { productID } = req.body;
    try {
        const userExist = await DBModel.findOne({ _id: req.userID });
        userExist.Orders = await userExist.Orders.filter(e => e.productID !== productID);
        userExist.save();
        res.send("Product Ordered Cancelled");
    } catch (err) {
        console.log(err);
    }
})

router.post(`${addRoute}forgetPassword/sendOTP`, async (req, res) => {
    const { Email } = req.body;
    try {
        const userExist = await DBModel.findOne({ Email });
        if (userExist) {
            const otp = `${Math.floor(Math.random() * 900000) + 100000}`
            const transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_PASS,
                }
            });
            const hashedOTP = await bcrypt.hash(otp, 12);
            const otpDBSave = new OTPVerfication({
                userID: userExist._id,
                OTP: hashedOTP,
                createdAt: Date.now(),
                expiresAt: Date.now() + 600000,
            })
            let mailGenerator = new Mailgen({
                theme: "default",
                product: {
                    name: "Perky Beans",
                    link: 'https://perky-beans.vercel.app/'
                }
            });

            let response = {
                body: {
                    name: `${userExist.Full_Name}`,
                    intro: `<p>Enter <b>${otp}</b> in the app to verify your Email address and then re-set your password</p>`,
                    outro: "Looking forward"
                }
            }

            let mail = mailGenerator.generate(response);
            let message = {
                from: process.env.AUTH_EMAIL,
                to: Email,
                subject: "Verify Your Email",
                html: mail
            }

            await otpDBSave.save();
            await new Promise((resolve, reject) => {
                transporter.sendMail(message).then(() => {
                    return res.json({ status: true, message: "Verification OTP email sent" })
                }).catch(() => {
                    return res.json({ message: "OTP Generation Error" })
                });
            });
        } else {
            res.send({ message: "Email is not Registered" })
        }
    } catch (error) {
        console.log(error);
        res.send({ message: "Mail not send" })
    }
})

router.post(`${addRoute}forgetPassword/otpVerify`, async (req, res) => {
    const { Email, OTP } = req.body;
    try {
        const userExist = await DBModel.findOne({ Email });
        const userOTPFind = await OTPVerfication.find({ userID: userExist._id })
        const { expiresAt } = userOTPFind[0];
        const hashedOTP = userOTPFind[0].OTP;
        if (expiresAt < Date.now()) {
            await OTPVerfication.deleteMany({ userID: userExist._id });
            res.send({ status: false, message: "OTP is expired. Please request Again" })
        } else {
            // const password_Match = await bcrypt.compare(Password, userExist.Password);
            let validOTP = await bcrypt.compare(OTP, hashedOTP);
            console.log(validOTP, hashedOTP, OTP);
            if (validOTP) {
                await OTPVerfication.deleteMany({ userID: userExist._id });
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
        await userExist.updateOne({ Confirm_Password: await bcrypt.hash(Confirm_Password, 12) });
        await userExist.save();
        res.send({ status: true, message: "Password Updated" });
    } catch (err) {
        res.send({ status: false, message: "Error Occurs! Please Try Again" });

    }

})


module.exports = router;