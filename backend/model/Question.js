const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questions: { type: Object },
  category: { type: String },
  status: { type: String },
  date:{type:String}
});

module.exports = mongoose.model('questions', questionSchema);
