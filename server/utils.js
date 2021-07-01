const jwt = require("jsonwebtoken");
const validator = require("validator");

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
        jwt.verify(token, process.env.SECRET_KEY).program === program &&
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
      return null;
    }
  },
  calculateOrderAmount: (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1000;
  }
};
