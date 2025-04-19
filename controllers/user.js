const User = require('../models/user');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, mobileNumber, emergencyContactNumber, emailAddress, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ emailAddress });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate input
    if (!fullName || !mobileNumber || !emergencyContactNumber || !emailAddress || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create user
    const user = await User.create({
      fullName,
      mobileNumber,
      emergencyContactNumber,
      emailAddress,
      password
    });

    if (user) {
      res.status(201).json({
        uid: user.uid,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        emergencyContactNumber: user.emergencyContactNumber,
        emailAddress: user.emailAddress,
        message: 'User registered successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email address already in use' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

// module.exports = { registerUser };


// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const jwt = require('jsonwebtoken');

// After validating user credentials

      const { emailAddress, password } = req.body;
        
      // Find user by email
      const user = await User.findOne({ emailAddress });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });
      // Check if user exists and password matches
      if (user && await user.matchPassword(password)) {
        res.json({
          user: {
            uid: user.uid,
            fullName: user.fullName,
            emailAddress: user.emailAddress,
          },
          token,
          message: 'Login successful'
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

  // Update user profile
const updateProfile = async (req, res) => {
    try {
      // Extract only the fields we want to allow updating
      const { fullName, emailAddress, mobileNumber, emergencyContactNumber } = req.body;
      
      // Find user by ID and update
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id, 
        { 
          fullName,
          emailAddress,
          mobileNumber,
          emergencyContactNumber
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return updated user data (excluding password)
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            uid: updatedUser.uid,
            fullName: updatedUser.fullName,
            emailAddress: updatedUser.emailAddress,
            mobileNumber: updatedUser.mobileNumber,
            emergencyContactNumber: updatedUser.emergencyContactNumber
          }
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  module.exports = { registerUser, loginUser, updateProfile  };