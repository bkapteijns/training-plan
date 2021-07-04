require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../../UserSchema");

const refundWebhook = async (req, res) => {
  const { event } = req;
  console.log(event.type);
  if (!["charge.refunded"].includes(event.type)) return res.sendStatus(400);
  console.log(event.data.object.description);
  const programs = event.data.object.description.split(",");
  await programs.map(async (p) =>
    User.updateOne(
      { email: event.data.object.receipt_email },
      { $pull: { programs: { name: p } } }
    )
  );
};

module.exports = refundWebhook;
