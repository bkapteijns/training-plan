const { UserInputError } = require("apollo-server");
require("dotenv").config();

const { createProgramToken, verifyProgramToken } = require("../utils");

const programResolvers = {
  Program: {
    token: (parent) =>
      parent.name
        ? createProgramToken(parent.name)
        : new UserInputError("Something went wrong")
  }
};

module.exports = programResolvers;
