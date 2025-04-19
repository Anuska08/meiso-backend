const MoodTracker = require('../models/MoodTracker');

// @desc    Create new mood tracker entry
// @route   POST /api/mood
// @access  Private
const createMoodEntry = async (req, res) => {
  try {
    const { sleep, meditation, medication, socialized, mood } = req.body;

    // Validate input
    if (!sleep || !mood) {
      return 
      
      
      
      
      res.status(400).json({ message: 'Sleep quality and mood are required' });
    }

    // Validate mood range
    if (mood < 1 || mood > 5) {
      return res.status(400).json({ message: 'Mood must be between 1 and 5' });
    }

    // Check if entry already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingEntry = await MoodTracker.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingEntry) {
      // Update existing entry
      existingEntry.sleep = sleep;
      existingEntry.meditation = meditation;
      existingEntry.medication = medication;
      existingEntry.socialized = socialized;
      existingEntry.mood = mood;
      
      await existingEntry.save();
      
      return res.status(200).json({
        message: 'Mood tracker entry updated successfully',
        data: existingEntry
      });
    }

    // Create new entry
    const moodEntry = await MoodTracker.create({
      user: req.user.id,
      sleep,
      meditation,
      medication,
      socialized,
      mood
    });

    res.status(201).json({
      message: 'Mood tracker entry created successfully',
      data: moodEntry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all mood entries for a user
// @route   GET /api/mood
// @access  Private
const getMoodEntries = async (req, res) => {
  try {
    const entries = await MoodTracker.find({ user: req.user.id })
      .sort({ date: -1 });
    
    res.status(200).json({
      count: entries.length,
      data: entries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get mood entry for specific date
// @route   GET /api/mood/:date
// @access  Private
const getMoodEntryByDate = async (req, res) => {
  try {
    const dateParam = new Date(req.params.date);
    
    if (isNaN(dateParam.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    dateParam.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(dateParam);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const entry = await MoodTracker.findOne({
      user: req.user.id,
      date: {
        $gte: dateParam,
        $lt: nextDay
      }
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'No mood entry found for this date' });
    }
    
    res.status(200).json({ data: entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// controllers/moodTrackerController.js

// Existing controller functions...

// @desc    Get user's mood analysis
// @route   GET /api/mood/analysis
// @access  Private
const getMoodAnalysis = async (req, res) => {
  try {
    // Get uid from request (assuming it's passed as a query parameter)
    const uid = JSON.parse(localStorage.getItem('user')).uid
    
    if (!uid) {
      return res.status(400).json({ message: 'UID is required' });
    }
    
    // Find user by uid
    const user = await User.findOne({ uid: uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find all mood entries for this user
    const moodEntries = await MoodTracker.find({ user: user._id });
    
    if (moodEntries.length === 0) {
      return res.status(200).json({ moodCategory: 'No data available' });
    }
    
    // Calculate average mood
    const totalMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0);
    const averageMood = totalMood / moodEntries.length;
    
    // Determine mood category based on average
    let moodCategory;
    if (averageMood > 3.5) {
      moodCategory = 'Healthy';
    } else if (averageMood >= 2.7 && averageMood <= 3.5) {
      moodCategory = 'Neutral';
    } else if (averageMood >= 1.7 && averageMood < 2.7) {
      moodCategory = 'Mild';
    } else {
      moodCategory = 'Critical';
    }
    
    // Return only the mood category
    res.status(200).json({ moodCategory });
  } catch (error) {
    console.error('Mood analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  // Include existing exports...
  createMoodEntry,
  getMoodEntries,
  getMoodEntryByDate,
  getMoodAnalysis
};



