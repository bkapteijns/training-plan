const { UserInputError } = require("apollo-server");
require("dotenv").config();

const Program = require("../ProgramSchema");
const { createProgramToken } = require("../utils");

const programResolvers = {
  Program: {
    token: (parent) =>
      parent.name
        ? createProgramToken(parent.name)
        : new UserInputError("Something went wrong")
  },

  Query: {
    getPrograms: async () => (await Program.find()).map((p) => ({ ...p._doc }))
  }
};

module.exports = programResolvers;
