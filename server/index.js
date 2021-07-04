require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const validator = require("validator");

const { typeDefs, resolvers } = require("./graphql/index");
const { calculateOrderAmount, verifyProgramToken } = require("./utils");
const Email = require("./EmailSchema");
const stripeWebhooks = require("./routes/stripe-webhooks/index");
const stripeWebhookMiddleware = require("./middleware/stripeWebhook");

const app = express();

/********** Middleware */
app.use(
  "/api/stripe-webhooks",
  express.raw({ type: "*/*" }),
  stripeWebhookMiddleware,
  stripeWebhooks
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const allowedOrigins = [process.env.CLIENT_URI];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    type: "login", // other is oauth2
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_SPECIFIC_PASSWORD
  }
});

/**************** REST endpoint */
app.post("/api/create-payment-intent", async (req, res) => {
  const { items, emailAddress } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: await calculateOrderAmount(items),
    currency: "eur",
    payment_method_types: ["ideal"],
    description: items.toString(),
    receipt_email: emailAddress
  });
  res.send({
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret
  });
});
app.post("/api/cancel-payment-intent", async (req, res) => {
  const { id } = req.body;
  console.log(id);
  if (id.startsWith("pi_")) await stripe.paymentIntents.cancel(id);
  res.status(204).send();
});
app.post("/api/send-introduction-email", async (req, res) => {
  const { emailAddress } = req.body;
  // send mail with defined transport object
  if (emailAddress && validator.isEmail(emailAddress)) {
    if ((await Email.find({ address: emailAddress })).length === 0) {
      await new Email({
        address: emailAddress,
        creationDate: Date.now()
      }).save();
    }
    await transporter.sendMail(
      {
        from: `"trainingplan.fitness" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: emailAddress, // list of receivers
        subject: "Testing email", // Subject line
        text: "This email has been sent with my app", // plain text body
        html: '<b style="color: red;">The html body of the email</b>', // html body
        attachments: [
          {
            filename: "test.pdf",
            content: fs.createReadStream("./data/test.pdf")
          }
        ]
      },
      (error, info) => {
        if (error) {
          console.error("Error: ", error);
          res.sendStatus(400);
        }
        res.sendStatus(201);
      }
    );
  } else res.sendStatus(400);
});
app.post("/api/send-purchase-confirmation-email", async (req, res) => {
  const { emailAddress } = req.body;
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
          res.sendStatus(400);
        }
        res.sendStatus(201);
      }
    );
  else res.sendStatus(400);
});

app.use(express.static(path.join(__dirname, "programs", "basic", "build")));
app.get("/program*", (req, res) => {
  if (req.params[0].startsWith("/basic"))
    return res.sendFile(
      path.join(__dirname, "programs", "basic", "build", "index.html")
    );
});

/******************** GraphQL endpoint */
const graphqlServer = new ApolloServer({ typeDefs, resolvers });
graphqlServer.applyMiddleware({ app, path: "/api/graphql" });

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Connected to database");
    app.listen(4000, () => console.log("Node server listening on port 4000!"));
  })
  .catch(() => console.error("Connecting to database failed"));
