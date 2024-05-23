const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51PIBzKBApeRXee97uPySRxxaoR5XfWjVchRVQVMlsjvxMsMLtx1bgUzE92et7CFQIOoU30O32mej0dCK9kBarrQq002aKJ4oCo"
);

// const YOUR_DOMAIN = 'http://localhost:3000';

router.post("/create-seat-reservation-session", async (req, res) => {
  // const { userId, orderId, URL } = req.body;
  const {
    Contact_Number,
    Person_Count,
    Date,
    Timing,
    Booking_DateTime,
    TableNumber,
    URL,
    userID,
    Full_Name,
    Email
  } = req.body;
  const DOMAIN = req.headers.origin;
  // console.log(userId,orderId, );
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Seat Reservation",
            // description: "Reservation Seat",
          },
          unit_amount: 50000, // amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: Email,
    success_url: `${DOMAIN}${URL}/status/success`,
    cancel_url: `${DOMAIN}${URL}/status/canceled`,
    metadata: {Contact_Number, Person_Count, Date, Timing, Booking_DateTime ,TableNumber, type:"reservation",userID, Full_Name, Email    },
  });

  // res.redirect(303, session.url);
  res.json({ id: session.id });
});

module.exports = router;
