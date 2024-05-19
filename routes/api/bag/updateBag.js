const express = require('express');
const router = express.Router();
const BagsModel = require('../../../Models/bags');
const authMiddleware = require('../../../Middleware/authMiddleware');


router.post(`/updateBag`, authMiddleware, async (req, res) => {
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

  
  module.exports = router;