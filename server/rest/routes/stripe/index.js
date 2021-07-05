const express = require("express");

const webhookRouter = require("./webhooks/index");
const createPaymentIntent = require("./createPaymentIntent");
const stripeWebhookMiddleware = require("../../middleware/stripeWebhook");

const stripeRouter = express.Router();

stripeRouter.use(
  "/webhooks",
  express.raw({ type: "*/*" }),
  stripeWebhookMiddleware,
  webhookRouter
);
stripeRouter.post(
  "/create-payment-intent",
  express.json(),
  express.urlencoded({ extended: true }),
  createPaymentIntent
);

module.exports = stripeRouter;
