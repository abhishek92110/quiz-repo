const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  status: { type: String },
  code: { type: String }
});

module.exports = mongoose.model('admins', adminSchema);
