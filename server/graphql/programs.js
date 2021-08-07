const { UserInputError } = require("apollo-server");
require("dotenv").config();

const { createProgramToken, verifyProgramToken } = require("../utils");
const User = require("../schemas/UserSchema");
const Program = require("../schemas/ProgramSchema");
const Day = require("../schemas/DaySchema");

const programResolvers = {
  Program: {
    token: (parent) =>
      parent.name && parent.user
        ? createProgramToken(parent.name, parent.user)
        : new UserInputError("Something went wrong")
  },

  Query: {
    getPrograms: async () => (await Program.find()).map((p) => ({ ...p._doc })),
    getEquipment: async () => [
      "dumbbells",
      "resistance band",
      "pullup bar",
      "dip bar",
      "barbell",
      "yoga mat",
      "bench",
      "squat rack",
      "cable machine"
    ],
    getDay: async (parent, { program, token, day }) => {
      if (verifyProgramToken(token, program))
        return (await Day.findOne({ program, day }))._doc.exercises;
      else return [];
    }
  },

  Mutation: {
    finishDay: async (parent, { program, token, day }) => {
      try {
        const { program: name, user } = verifyProgramToken(token, program);
        const u = (await User.findOne({ email: user }))._doc;
        return (
          await User.findOneAndUpdate(
            { email: user },
            {
              ...u,
              programs: u.programs.map((p) => {
                p = p._doc;
                return p.name === name
                  ? {
                      ...p,
                      finishedDays: [...p.finishedDays, day]
                    }
                  : p;
              })
            },
            { new: true }
          )
        ).programs
          .filter((p) => p.name === name)[0]
          .finishedDays.includes(day);
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    restartProgram: async (parent, { program, token }) => {
      try {
        const { program: name, user } = verifyProgramToken(token, program);
        const u = (await User.findOne({ email: user }))._doc;
        return (
          (
            await User.findOneAndUpdate(
              { email: user },
              {
                ...u,
                programs: u.programs.map((p) => {
                  p = p._doc;
                  return p.name === name
                    ? {
                        ...p,
                        finishedDays: []
                      }
                    : p;
                })
              },
              { new: true }
            )
          ).programs.filter((p) => p.name === name)[0].finishedDays.length === 0
        );
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};

module.exports = programResolvers;
