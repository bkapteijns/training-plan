require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const failedWebhook = async (req, res) => {
  const { event } = req;
  if (!["payment_intent.payment_failed", "charge.failed"].includes(event.type))
    return res.sendStatus(400);
  await stripe.paymentIntents.cancel(event.data.object.id);
};

module.exports = failedWebhook;
