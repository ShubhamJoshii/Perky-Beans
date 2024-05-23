const express = require("express");
const UserModel = require("../../../Models/user");
const authMiddleware = require("../../../Middleware/authMiddleware");
const router = express.Router();

router.post(`/addAddress`, authMiddleware, async (req, res) => {
    const {FlatNumber, Floor, Locality, landmark, Name, Contact_Number, AddressAs, State } = req.body;
    // console.log(FlatNumber, Floor, Locality, landmark, Name, Contact_Number, AddressAs);
    const userExist = await UserModel.findOne({_id:req.userID},"-Tokens -Login")
    userExist.Address = await userExist.Address.concat({FlatNumber, Floor, Locality, landmark, Name, Contact_Number, AddressAs, State})
    userExist.save();
    
    res.send({ message: "New Address Added", result: true });
});

module.exports = router;
