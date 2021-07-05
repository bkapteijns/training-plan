const { UserInputError } = require("apollo-server");
require("dotenv").config();

const { createProgramToken, verifyProgramToken } = require("../utils");
const User = require("../schemas/UserSchema");
const Program = require("../schemas/ProgramSchema");

const programResolvers = {
  Program: {
    token: (parent) =>
      parent.name && parent.user
        ? createProgramToken(parent.name, parent.user)
        : new UserInputError("Something went wrong")
  },

  Query: {
    getPrograms: async () => (await Program.find()).map((p) => ({ ...p._doc })),
    getProgram: async (parent, { program, token, day }) => {
      try {
        const { program: name, user } = verifyProgramToken(token, program);
        return {
          finished:
            (await User.findOne({ email: user })).programs.filter(
              (p) => p.name === name
            )[0].currentDay > day,
          name
        };
      } catch (e) {
        console.log(e);
        return { name: "basic", finished: false };
      }
    },
    getEquipment: async () => [
      "dumbbells",
      "resistance band",
      "pullup bar",
      "barbell",
      "yoga mat",
      "bench",
      "squat rack",
      "cable machine"
    ]
  },

  Mutation: {
    finishProgram: async (parent, { program, token, day }) => {
      try {
        const { program: name, user } = verifyProgramToken(token, program);
        const u = (await User.findOne({ email: user }))._doc;
        return {
          finished:
            (
              await User.findOneAndUpdate(
                { email: user },
                {
                  ...u,
                  programs: u.programs.map((p) => {
                    p = p._doc;
                    return p.name === name ? { ...p, currentDay: day + 1 } : p;
                  })
                },
                { new: true }
              )
            ).programs.filter((p) => p.name === name)[0].currentDay > day,
          name
        };
      } catch (e) {
        console.log(e);
        return { name: "basic", finished: false };
      }
    }
  }
};

module.exports = programResolvers;
