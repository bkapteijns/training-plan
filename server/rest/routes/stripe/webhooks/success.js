const validator = require("validator");

const User = require("../../../../schemas/UserSchema");

const successWebhook = async (req, res) => {
  const { event } = req;
  if (!["charge.succeeded"].includes(event.type))
    return res.status(400).send("Event type is not charge.succeeded");
  const programs = event.data.object.description
    .split(",")
    .map((p) => ({ name: p, currentDay: 1 }));
  const emailAddress = event.data.object.receipt_email;
  await User.updateOne(
    { email: emailAddress },
    {
      $push: {
        programs: { $each: programs }
      }
    }
  ).then(async () => {
    if (emailAddress && validator.isEmail(emailAddress))
      await transporter.sendMail(
        {
          from: `"trainingplan.fitness" <${process.env.EMAIL_USERNAME}>`, // sender address
          to: emailAddress, // list of receivers
          subject: "Testing email", // Subject line
          text: "This email has been sent with my app", // plain text body
          html: "<b>Thanks for buying a program!</b>" // html body
        },
        (error, info) => {
          if (error) {
            console.error("Error: ", error);
            res.status(400).send("Error sending the email");
          }
          res.status(201).json({ received: true });
        }
      );
    else res.status(400).send("No valid email address was supplied");
  });
};

module.exports = successWebhook;
