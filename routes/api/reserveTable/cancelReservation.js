const express = require("express");
const ReserveTableModel = require("../../../Models/reserveTable");
const router = express.Router();

router.get(`/booking/cancel`, async (req, res) => {
  try {
    const token = req.query.token;
    const TableFind = await ReserveTableModel.findOne({ token: token });
    if (TableFind.status === "Cancelled") {
      res.send("Already Cancelled Reserved Table");
    }
    if (TableFind) {
      TableFind.status = "Cancelled";
      await TableFind.save();
      res.send("Table Reservation Cancelled");
    }
  } catch (err) {
    console.log(err);
    res.send("Already Cancelled Reserved Table");
  }
});

module.exports = router;
