const express = require('express');
const router = express.Router();
const { registerUser,loginUser, updateProfile } = require('../controllers/user');
const { protect } = require('../middleware/authMiddleware');
// Route to register a new user
router.post('/', registerUser);
// Route to login a user
router.post('/login',loginUser);
// Route to update a user
router.patch('/profile', protect, updateProfile);
module.exports = router;
