const { model, Schema, SchemaType } = require("mongoose");

class Program extends SchemaType {
  constructor(key, options) {
    super(key, options, "Program");
  }
  cast(val) {
    if (Object.prototype.toString.call(val) !== "[object Object]")
      throw new CastError(`${val} should be an object`);
    if (
      !Object.keys(val).includes("name") ||
      !Object.keys(val).includes("currentDay")
    )
      throw new CastError(`${val} should contain name and currentDay`);
    return {
      name: val.name,
      currentDay: val.currentDay
    };
  }
}

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  programs: { type: [Program], required: true },
  ownedEquipment: { type: [String], required: true }
});

module.exports = model("User", userSchema);
