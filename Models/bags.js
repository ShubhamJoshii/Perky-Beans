const mongoose = require("mongoose");
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
const BagsModel = mongoose.model("Bags", bagsDB);
module.exports = BagsModel;

