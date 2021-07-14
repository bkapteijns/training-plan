const { model, Schema, ObjectId } = require("mongoose");

const daySchema = new Schema({
  day: { type: Number, required: true },
  program: { type: String, required: true },
  exercises: {type: [{
    name: { type: String, required: true },
    repetitions: { type: String, required: true },
    description: { type: String, required: true }
  }], required: true }
});

module.exports = model("Day", daySchema);
