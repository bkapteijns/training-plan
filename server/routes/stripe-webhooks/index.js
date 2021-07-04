const express = require("express");

const failed = require("./failed");
const refund = require("./refund");
const success = require("./success");

const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post("/failed", failed);
stripeWebhookRouter.post("/refund", refund);
stripeWebhookRouter.post("/success", success);

module.exports = stripeWebhookRouter;
