const mongoose = require('mongoose');

const userQuizSchema = new mongoose.Schema({
  question: { type: Object },
  category: { type: String },
  marks: { type: String },
  status:{ type: String },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', // Replace 'users' with the actual name of your user model
    required: true // Ensure that the user reference is always provided
  },
  username:{type: String},
  useremail:{type: String},
  // date:{type: String},
  date: { 
    type: Date, 
    default: Date.now // Automatically sets the current date when the document is created
  }
});

module.exports = mongoose.model('userquizes', userQuizSchema);
