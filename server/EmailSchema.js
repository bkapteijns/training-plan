const { model, Schema } = require("mongoose");

const emailSchema = new Schema({
  address: { type: String, required: true },
  creationDate: { type: Date, required: true }
});

module.exports = model("Email", emailSchema);
