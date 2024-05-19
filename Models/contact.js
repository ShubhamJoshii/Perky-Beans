const mongoose = require("mongoose");

const ContactDB = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  Contact_Number: {
    type: Number,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  Description: {
    type: String,
    require: true,
  },
  UserRegistered: {
    type: Boolean,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
  },
});


const ContactModel = mongoose.model("Contact", ContactDB);

module.exports = ContactModel;