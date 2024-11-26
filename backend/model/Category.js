const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category: { type: String },
  totalQuestion: { type: String },
});

module.exports = mongoose.model('categories', categorySchema);
