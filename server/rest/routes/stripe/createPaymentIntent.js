require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { calculateOrderAmount } = require("../../../utils");

const createPaymentIntent = async (req, res) => {
  const { items, emailAddress } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: await calculateOrderAmount(items),
    currency: "eur",
    payment_method_types: ["ideal"],
    description: items.toString(),
    receipt_email: emailAddress
  });
  res.status(201).send({
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret
  });
};

module.exports = createPaymentIntent;
