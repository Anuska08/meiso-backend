const express = require('express');
const router = express.Router();
const { createMoodEntry, getMoodEntries, getMoodEntryByDate, getMoodAnalysis } = require('../controllers/MoodTracker');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected - require authentication
router.use(protect);

// Create mood entry and get all entries
router.route('/')
  .post(createMoodEntry)
  .get(getMoodEntries);

// Get entry by date
router.get('/:date', getMoodEntryByDate);

// Get mood analysis
router.get('/analysis', getMoodAnalysis);

module.exports = router;
