require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../../UserSchema");

const successWebhook = async (req, res) => {
  const { event } = req;
  if (!["charge.succeeded"].includes(event.type)) return res.sendStatus(400);
  const programs = event.data.object.description
    .split(",")
    .map((p) => ({ name: p, currentDay: 1 }));
  await User.updateOne(
    { email: event.data.object.receipt_email },
    {
      $push: {
        programs: { $each: programs }
      }
    }
  );
};

module.exports = successWebhook;
