module.exports = {
  createProgramToken: (program) => {
    return jwt.sign({ program }, process.env.SECRET_KEY, { expiresIn: "1h" });
  },
  verifyProgramToken: (token, program) => {
    try {
      return jwt
        .verify(token, process.env.SECRET_KEY)
        .programs.includes(program);
    } catch (e) {
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
