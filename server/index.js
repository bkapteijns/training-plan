const express = require("express");
const stripe = require("stripe")(
  "sk_test_51J6XHhGSqSbA8PYSRo15Mh32OmaTfz2bZu7SoQrdZ8sY6pSjbguVXqQLWFeQdwFfMGO7vlYclfNrvKp5bK852lsp00TeJTTvLE"
);
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const validator = require("validator");

const { typeDefs, resolvers } = require("./graphql/index");
const { calculateOrderAmount, verifyProgramToken } = require("./utils");
const Email = require("./EmailSchema");

const app = express();

/********** Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const allowedOrigins = [process.env.CLIENT_URI, "http://localhost:4000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URI);
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
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
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    payment_method_types: ["ideal"]
  });
  res.send({
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret
  });
});
app.post("/api/cancel-payment-intent", async (req, res) => {
  const { id } = req.body;
  if (id.startsWith("pi_")) console.log(await stripe.paymentIntents.cancel(id));
  res.status(204).send();
});
app.post(
  "/api/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    // MAKE SURE WHETHER THE REQUEST CAME FROM STRIPE
    console.log(req.body);
    const { type, data } = req.body;
    switch (type) {
      case "payment_intent.succeeded":
        console.log(type, JSON.stringify(data));
        break;
      case "payment_intent.cancelled":
        console.log(type, JSON.stringify(data));
        break;
      case "payment_intent.payment_failed":
        console.log(type, JSON.stringify(data));
        break;
      default:
        console.log(`No webhook defined for ${type}`);
        break;
    }
    res.send({ received: true });
  }
);
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

/*
app.get("/program", (req, res) => {
  const { program, day, token } = req.query;
  if (!program || !day) return res.status(400).send("Specify a program");
  // test whether the user has rights for the program
  if (
    (verifyProgramToken(token, program) || program === "basic") &&
    !program.includes(".") &&
    !day.includes(".") && // we do not want the situation: program/../../index.js
    validator.isInt(day) // the day should be an integer
  ) {
    return fs.access(
      path.join(__dirname, "programs", program, `${day}.html`),
      (err) => {
        if (err) return res.status(400).send("Program not available");
        return res.sendFile(
          path.join(__dirname, "programs", program, `${day}.html`)
        );
      }
    );
  }
  return res.status(400).send("Program has not been purchased");
});
*/
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
    useFindAndModify: true
  })
  .then(() => {
    console.log("Connected to database");
    app.listen(4000, () => console.log("Node server listening on port 4000!"));
  })
  .catch(() => console.error("Connecting to database failed"));
