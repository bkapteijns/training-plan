const express = require("express");
const stripe = require("stripe")("sk_test_4eC39HqLyjWDartjtT1zdp7dc");

const app = express();

app.use(express.static("."));
app.use(express.json());

const calculateOrderAmount = (items) => 1000;

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur"
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});
