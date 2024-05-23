const express = require("express");
const UserModel = require("../../../Models/user");
const authMiddleware = require("../../../Middleware/authMiddleware");
const router = express.Router();

router.get(`/fetchAddress`, authMiddleware, async (req, res) => {
  const userSavedAddress = await UserModel.findOne(
    { _id: req.userID },
    "Address"
  );
  let temp = userSavedAddress.Address.map((curr) => {
    let arr = [curr.Floor, curr.FlatNumber, curr.Locality, curr.landmark, curr.State];
    let textArr = arr.join(", ");
    textArr = textArr.replace(/^,*/, '').trim().replace(/,\s*,/g, ',')
    return { combineText: textArr, AddressAs: curr.AddressAs, _id: curr._id };
  });
  // console.log(temp);
  res.send({ userSavedAddress: temp, result: true });
});

module.exports = router;
