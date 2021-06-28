const { model, Schema, SchemaType } = require("mongoose");

const programSchema = new Schema({
  name: { type: String, required: true },
  days: { type: Number, required: true },
  equipment: { type: [String], required: true }
});

module.exports = model("User", programSchema);
