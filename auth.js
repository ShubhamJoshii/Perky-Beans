const express = require('express');
const router = express.Router();
const { DBModel } = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Authenication = require("./Authenication");

router.get("/api/home", Authenication, async (req, res) => {
    res.send(req.rootUser);
});

router.get("/api/logout", Authenication, async (req, res) => {
    res.clearCookie("perkyBeansToken", { path: "/" });
    res.status(200).send("User Logout");
    // res.send(req.rootUser);
});


router.post("/api/register", async (req, res) => {
    const { Full_Name, Email, Password, Confirm_Password } = req.body;
    try {
        const userExist = await DBModel.findOne({ Email });
        if (!userExist) {
            const userData = new DBModel({
                Full_Name, Email, Password, Confirm_Password
            })
            const data = userData.save();
            res.send("User Registered");
        } else {
            res.send("User Email ID already Registered");
        }
    } catch (err) {
        res.send("Error! Try Again");
    }
})

router.post("/api/login", async (req, res) => {
    const { Email, Password, Login_Date } = req.body;
    console.log(req.body);
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

router.post("/api/addToWishlist", Authenication, async (req, res) => {
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

router.post("/api/removefromWishlist", Authenication, async (req, res) => {
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

router.post("/api/updateBag", Authenication, async (req, res) => {
    const { productID, SmallCount, MediumCount, LargeCount } = req.body;
    // console.log(req.body);
    try {
        const userExist = await DBModel.findOne({ _id: req.userID });
        let objIndex = await userExist.Bag.findIndex((obj => obj.productID == productID));
        userExist.Bag[objIndex] = await {productID, SmallCount, MediumCount, LargeCount };
        await userExist.save();
        res.send("Add to bag");
    } catch (err) {
        console.log(err);
    }
})
router.post("/api/addtoBag", Authenication, async (req, res) => {
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

router.post("/api/removeFromBag", Authenication, async (req, res) => {
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


module.exports = router;