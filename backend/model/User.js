const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  number: { type: String },
  trainer: { type: String }
});

module.exports = mongoose.model('users', userSchema);
