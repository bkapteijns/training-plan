const express = require("express");
const stripe = require("stripe")(
  "sk_test_51J6XHhGSqSbA8PYSRo15Mh32OmaTfz2bZu7SoQrdZ8sY6pSjbguVXqQLWFeQdwFfMGO7vlYclfNrvKp5bK852lsp00TeJTTvLE"
);

const app = express();

//app.use(express.static("."));
app.use(express.json());
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1000;
};
app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    payment_method_types: ["ideal"]
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.listen(4000, () => console.log("Node server listening on port 4000!"));
