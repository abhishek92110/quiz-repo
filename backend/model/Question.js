const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String },
  option1: { type: String },
  option2: { type: String },
  option3: { type: String },
  option4: { type: String },
  answer: { type: String },
  type: { type: String },
  category: { type: String },
  status: { type: String },
  date:{type:String}
});

module.exports = mongoose.model('questions', questionSchema);
