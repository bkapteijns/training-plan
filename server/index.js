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

const { typeDefs, resolvers } = require("./graphql/index");
const { calculateOrderAmount, verifyProgramToken } = require("./utils");

const app = express();

/********** Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const allowedOrigins = [process.env.CLIENT_URI];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URI);
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
    clientSecret: paymentIntent.client_secret
  });
});
app.post("/api/send-introduction-email", async (req, res) => {
  const { emailAddress } = req.body;
  // send mail with defined transport object
  if (emailAddress)
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
  else res.sendStatus(400);
});
app.post("/api/send-purchase-confirmation-email", async (req, res) => {
  const { emailAddress } = req.body;
  if (emailAddress)
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

app.get("/program", (req, res) => {
  const { program, day, programToken } = req.query;
  if (!program || !day) return res.status(400).send("Specify a program");
  // test whether the user has rights for the program
  if (verifyProgramToken(programToken, program) || program === "basic") {
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

/******************** GraphQL endpoint */
const graphqlServer = new ApolloServer({ typeDefs, resolvers });
graphqlServer.applyMiddleware({ app, path: "/api/graphql" });

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to database");
    app.listen(4000, () => console.log("Node server listening on port 4000!"));
  })
  .catch(() => console.error("Connecting to database failed"));
