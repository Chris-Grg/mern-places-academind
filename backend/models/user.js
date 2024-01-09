const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  places: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);