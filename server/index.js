const express = require("express");
const stripe = require("stripe")(
  "sk_test_51J6XHhGSqSbA8PYSRo15Mh32OmaTfz2bZu7SoQrdZ8sY6pSjbguVXqQLWFeQdwFfMGO7vlYclfNrvKp5bK852lsp00TeJTTvLE"
);
const nodemailer = require("nodemailer");

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

app.post("/send-introduction-email", async (req, res) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      type: "login", // other is oauth2
      user: "trainingplan.fitness@gmail.com",
      pass: "a1way5 B prot&#ted"
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(
    {
      from: '"Training" <trainingplan.fitness@gmail.com>', // sender address
      to: "bram_kapteijns@hotmail.com", // list of receivers
      subject: "Testing email", // Subject line
      text: "This mail has been sent with my app", // plain text body
      html: "<b>This mail has been sent with my app</b>" // html body
    },
    (error, info) => {
      if (error) return console.error(error);
      console.log("Message sent: " + JSON.stringify(info));
    }
  );

  info && console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  info && console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.send();
});

app.listen(4000, () => console.log("Node server listening on port 4000!"));
