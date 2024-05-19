const express = require('express');
const router = express.Router();

const Mailgen = require('mailgen');
const transporter = require('../../../Common/transporter');
const ReserveTableModel = require('../../../Models/reserveTable');
const authMiddleware = require('../../../Middleware/authMiddleware');

router.post(`/reserveTables`, authMiddleware, async (req, res) => {
    const { Contact_Number, Person_Count, Date, Timing, Booking_DateTime ,TableNumber} =
      req.body;
    let token = require("crypto").randomBytes(32).toString("hex");
    try {
        const contactData = new ReserveTableModel({
          token: token,
          User_ID: req.rootUser._id,
          Contact_Number,
          Person_Count,
          User_Name: req.rootUser.Full_Name,
          User_Email: req.rootUser.Email,
          reservation_Date: Date,
          Booking_DateTime,
          status: "Confirmed",
          reservation_Timing: Timing,
          TableNumber
        });
  
        let mailGenerator = new Mailgen({
          theme: "default",
          product: {
            name: "Perky Beans",
            link: "https://perky-beans.vercel.app/",
          },
        });
  
        let response = {
          body: {
            name: `${req.rootUser.Full_Name}`,
            intro: `
              <p>We hope this email finds you well. Thank you for choosing PerkyBeans for your upcoming visit. We're delighted to confirm your reservation for a table at our café.</p>
              <p><strong>Reservation Details:</strong><p>
              <ul>
                <li>Reservation Date: ${Date}</li>
                <li>Reservation Time:  ${Timing}</li>
                <li>Number of Guests:  ${Person_Count}</li>
                <li>Reserved Table Number:  ${TableNumber}</li>
              </ul>
              <p><strong>Additional Information:</strong><p>
              <ul>
                <li>Your reservation is confirmed under the name of ${
                  req.rootUser.User_Name
                }.</li>
                <li>If you need to modify or cancel your reservation, please contact us at "perkybeans9@gmail.com" or 
                <a href="http://${
                  req.headers.host
                }/booking/cancel?token=${token}">cancel reservation</a>
                </li>
              </ul>
              <p><strong>Special Requests:</strong><p>
              <ul>
                <li>If you have any special requests or dietary preferences, please let our staff know upon arrival.</li>
              </ul>
              <p>We look forward to welcoming you to PerkyBeans and ensuring you have a delightful experience. If you have any further questions or requests, feel free to reach out.</p>
              `,
            outro: "Looking forward",
          },
        };
  
        let mail = mailGenerator.generate(response);
        let message = {
          from: process.env.AUTH_EMAIL,
          to: req.rootUser.Email,
          subject: "Your Reserved Table Confirmation at PerkyBeans",
          html: mail,
        };
  
        await new Promise(async (resolve, reject) => {
          await transporter
            .sendMail(message)
            .then(async () => {
              await contactData.save();
              return res.json({ message: "Table Reserved. Check Mail!" });
            })
            .catch(() => {
              return res.json("Retry!");
            });
        });
      
    } catch (err) {
      console.log(err);
      res.send({ message: "Table Reserved Error" });
    }
  });
  
module.exports = router;