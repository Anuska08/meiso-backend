const mongoose = require('mongoose');

const moodTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sleep: {
    type: String,
    enum: ['No Sleep','Poor', 'Average', 'Good', 'Excellent'],
    required: true
  },
  meditation: {
    type: Boolean,
    default: false
  },
  medication: {
    type: Boolean,
    default: false
  },
  socialized: {
    type: String,
    enum: ['None','Minimal', 'Average', 'Good', 'Excellent'],
    default: 'None'
  },
  mood: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster querying by user and date
moodTrackerSchema.index({ user: 1, date: 1 });

const MoodTracker = mongoose.model('MoodTracker', moodTrackerSchema);

module.exports = MoodTracker;
