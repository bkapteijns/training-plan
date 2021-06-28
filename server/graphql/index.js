const typedefs = require("./typedefs");
const userResolvers = require("./users");
const programResolvers = require("./programs");

module.exports = {
  typedefs,
  resolvers: {
    Query: { ...userResolvers.Query, ...programResolvers.Query },
    Mutation: { ...userResolvers.Mutation, ...programResolvers.Mutation },
    User: { ...userResolvers.User },
    Program: { ...programResolvers.Program }
  }
};
