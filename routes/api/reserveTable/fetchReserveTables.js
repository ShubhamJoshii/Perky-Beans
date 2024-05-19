const express = require("express");
const ReserveTableModel = require("../../../Models/reserveTable");
const router = express.Router();

router.get(`/reserveTables`, async (req, res) => {
  const reserveTables = await ReserveTableModel.find();
  res.send(reserveTables);
});

module.exports = router;
