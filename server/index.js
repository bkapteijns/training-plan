const express = require("express");
const stripe = require("stripe")(
  "sk_test_51J6XHhGSqSbA8PYSRo15Mh32OmaTfz2bZu7SoQrdZ8sY6pSjbguVXqQLWFeQdwFfMGO7vlYclfNrvKp5bK852lsp00TeJTTvLE"
);
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const fs = require("fs");
const url = require("url");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./UserSchema");

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

/*********** Helper functions */
const createProgramToken = (programs) => {
  return jwt.sign({ programs }, process.env.SECRET_KEY, { expiresIn: "1h" });
};
const verifyProgramToken = (token, program) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY).programs.includes(program);
  } catch (e) {
    return false;
  }
};
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    type: "login", // other is oauth2
    user: process.env.EMAIL_USERNAME, // "bramkapteijns03@gmail.com"
    pass: process.env.EMAIL_SPECIFIC_PASSWORD //"My g00g1e pa5Sw0rd iS $3cure#"
  }
});
const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1000;
};

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

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email and password are mandatory");
  if ((await User.find({ email })).length > 0) {
    const u = await User.findOne({ email, password });
    if (u) return res.status(200).send(u);
    return res.status(400).send("User already exists");
  }
  const user = await new User({
    email: email,
    password: password,
    programs: []
  });
  await user.save();
  return res
    .status(201)
    .send({ ...user, programToken: createProgramToken(user.programs) });
});
app.put("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email and password are mandatory");
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).send("Invalid credentials");
  return res
    .status(200)
    .send({ ...user, programToken: createProgramToken(user.programs) });
});

app.get("/program", (req, res) => {
  const { program, day, programToken } = req.query;
  if (!program || !day || !programToken) res.sendStatus(400);
  // test whether the user has rights for the program
  if (verifyProgramToken(programToken, program) || program === "basic") {
    fs.access(path.join(__dirname, program, `${day}.html`), (err) => {
      if (err) return res.status(400).send("Program not available");
      return res.sendFile(path.join(__dirname, program, `${day}.html`));
    });
  }
  res.status(400).send("Program has not been purchased");
});

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
