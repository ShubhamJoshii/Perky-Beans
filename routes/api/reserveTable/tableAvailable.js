
const express = require('express');
const router = express.Router();

const ReserveTableModel = require('../../../Models/reserveTable');

router.post(`/tableAvailable`, async (req, res) => {
    const { time, date } = req.body;
    const fetchTable = await ReserveTableModel.find({
      reservation_Date: date,
      reservation_Timing: time,
      status:"Confirmed"
    },"TableNumber status");
    const tableBooked = fetchTable.map((curr)=> curr.TableNumber)
    // console.log(tableBooked); 
    if (tableBooked) {
      res.send({ tableBooked, message: "Table Available", result: true });
    } else {
      res.send({ message: "Table Not Available", result: true });
    }
  });

  module.exports = router;