const express = require("express");

const introductionEmail = require("./introductionEmail");

const emailRouter = express.Router();

emailRouter.post("/send-introduction-email", introductionEmail);

module.exports = emailRouter;
