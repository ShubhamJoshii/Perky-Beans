const express = require("express");
const ContactModel = require("../../../Models/contact");
const router = express.Router();

router.get(`/fetchReview`, async (req, res) => {
  const fetchReview = await ContactModel.find({ type: "Review" });
  if (fetchReview) {
    res.send(fetchReview);
  } else {
    res.send("hello world");
  }
});

module.exports = router;
