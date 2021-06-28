const hash = require("hash.js");
const { UserInputError, AuthenticationError } = require("apollo-server");
require("dotenv").config();

const User = require("../UserSchema");
const Program = require("../ProgramSchema");
const { createUserToken, verifyUserToken } = require("../utils");
const userResolvers = {
  Query: {
    relogin: async (parent, { token }, context, info) => {
      const { _id } = verifyUserToken(token);
      const user = await User.findOne({ _id });
      return user ? user._doc : new AuthenticationError("Invalid token");
    }
  },
  Mutation: {
    login: async (
      parent,
      { userInput: { email, password } },
      context,
      info
    ) => {
      if (!email || !password)
        return new UserInputError("Enter email and password");
      if ((await User.find({ email })).length > 0) {
        const u = await User.findOne({
          email,
          password: hash.sha256().update(`${email}-${password}`).digest("hex")
        });
        if (u) return u._doc;
        return new AuthenticationError("User already exists");
      }
      const user = await new User({
        email,
        password: hash.sha256().update(`${email}-${password}`).digest("hex"),
        programs: [],
        ownedEquipment: []
      });
      await user.save();
      return user._doc;
    }
  },
  User: {
    token: async (parent) =>
      parent._id
        ? createUserToken(parent._id)
        : new UserInputError("Something went wrong"),
    programs: async (parent) =>
      parent.programs
        ? parent.programs.map(async (p) => {
            const program = await Program.findOne({ name: p.name });
            return {
              ...program._doc,
              currentDay: p.currentDay
            };
          })
        : new UserInputError("Something went wrong")
  }
};

module.exports = userResolvers;
