const express = require("express");
const stripe = require("stripe")(
  "sk_test_51MlqwzDU92rBcbvpG7sNdyrfi0Tf2extXcEkiv7tlHacs08PDh2Al6tRl4VMX3UIIu2tXV3ZDvw6WWBrkAU6wPwT00MYrThwQp"
);
const data = require("../Model/UserTourMuduler");
exports.SessionBooking = async (req, res, next) => {
  const tour = await data.findById(req.params.id);

  // stripe checkout session

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "waqas anjum" },
          unit_amount: 8000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:4242/success.html",
    cancel_url: "http://localhost:4242/cancel.html",
  });

  res.status(200).json({
    status: "success",
    session,
  });
};
