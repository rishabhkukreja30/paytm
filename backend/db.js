const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



// Create a Schema for Users
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

userSchema.methods.createHash = async function (plainTextPassword) {
  return await bcrypt.hash(plainTextPassword, 10);
};

userSchema.methods.validatePassword = async function (plainTextPassword) {
  return await bcrypt.compare(plainTextPassword, this.password);
};

// Create a model from the schema
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
