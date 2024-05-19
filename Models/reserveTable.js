const mongoose = require("mongoose");
const reserveTableDB = new mongoose.Schema({
  token: {
    type: String,
    require: true,
  },
  User_ID: {
    type: String,
    require: true,
  },
  User_Name: {
    type: String,
    require: true,
  },
  TableNumber:{
    type: String,
    require: true,  
  },
  User_Email: {
    type: String,
    require: true,
  },
  Contact_Number: {
    type: String,
    require: true,
  },
  Person_Count: {
    type: Number,
    require: true,
  },
  Booking_DateTime: {
    type: String,
    require: true,
  },
  reservation_Date: {
    type: String,
    require: true,
  },
  reservation_Timing: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
});
const ReserveTableModel = mongoose.model("Reserve_Table", reserveTableDB);

module.exports = ReserveTableModel;