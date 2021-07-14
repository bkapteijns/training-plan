const { model, Schema, ObjectId } = require("mongoose");

const programSchema = new Schema({
  name: { type: String, required: true },
  length: { type: Number, required: true },
  equipment: { type: [String], required: true }
});

module.exports = model("Program", programSchema);
