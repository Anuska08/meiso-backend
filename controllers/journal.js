// controllers/journalController.js
const Journal = require('../models/journal');

// Create a new journal entry
const createJournal = async (req, res) => {
  try {
    const { title, journalData, photo } = req.body;
    
    const newJournal = await Journal.create({
      user: req.user.id, // From auth middleware
      title,
      journalData,
      photo,
      datetime: new Date()
    });

    res.status(201).json({
      success: true,
      data: newJournal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all journals for a user
const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id })
      .sort({ datetime: -1 });
    
    res.status(200).json({
      success: true,
      count: journals.length,
      data: journals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createJournal,
  getJournals
};
