const jwt = require("jsonwebtoken");
const validator = require("validator");

const Program = require("./schemas/ProgramSchema");

module.exports = {
  createProgramToken: (program, user) => {
    return jwt.sign({ program, user }, process.env.SECRET_KEY, {
      expiresIn: "1d"
    });
  },
  verifyProgramToken: (token, program) => {
    try {
      if (!validator.isJWT(token)) throw new Error("Token must be valid JWT");
      return (
        jwt.verify(token, process.env.SECRET_KEY)
      );
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  createUserToken: (id) => {
    return jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1d",
      subject: id.toString()
    });
  },
  verifyUserToken: (token) => {
    try {
      if (!validator.isJWT(token)) throw new Error("Token must be a valid JWT");
      return {
        _id: jwt.verify(token, process.env.SECRET_KEY).sub
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  calculateOrderAmount: async (items) =>
    (await Program.find({ name: items }))
      .map((p) => p._doc.price)
      .reduce((a, b) => a + b)
};
