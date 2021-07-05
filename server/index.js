require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");

const { typeDefs, resolvers } = require("./graphql/index");
const stripeRoutes = require("./rest/routes/stripe/index");
const emailRoutes = require("./rest/routes/emails/index");

const app = express();

/**************** REST endpoint */
app.use("/api/stripe", stripeRoutes);
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

app.use("/api/emails", emailRoutes);

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
