require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const webhookMiddleware = (req, res, next) => {
  const payload = req.body;
  const signature = req.headers["stripe-signature"];
  const endpointSecret =
    req.url === "/failed"
      ? process.env.FAILURE_WEBHOOK_SECRET
      : req.url === "/success"
      ? process.env.SUCCESS_WEBHOOK_SECRET
      : req.url === "/refund"
      ? process.env.REFUND_WEBHOOK_SECRET
      : "";
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );
  req.event = event;
  next();
};

module.exports = webhookMiddleware;
