const { model, Schema, SchemaType } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  programs: {
    type: [
      {
        name: { type: String, required: true },
        currentDay: { type: Number, required: true }
      }
    ],
    required: true
  },
  ownedEquipment: { type: [String], required: true }
});

module.exports = model("User", userSchema);
