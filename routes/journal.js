// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { createJournal, getJournals } = require('../controllers/journal');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Create journal and get all journals
router.route('/')
  .post(createJournal)
  .get(getJournals);

module.exports = router;
