// models/Journal.js
const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  journalData: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  datetime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Journal', journalSchema);
