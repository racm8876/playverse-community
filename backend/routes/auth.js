
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Input validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3),
  email: Joi.string().email(),
  profilePicture: Joi.string().allow(''),
  bio: Joi.string().allow('')
});

// Register a new user
router.post('/signup', async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const { username, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    // Check if username is taken
    user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'Username is already taken' });
    
    // Create new user
    user = new User({
      username,
      email,
      password
    });
    
    // Save user to database
    await user.save();
    
    // Return success
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data and token
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        joinedDate: user.joinedDate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details
router.get('/user', auth, async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        bio: req.user.bio,
        joinedDate: req.user.joinedDate
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/updateUser', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const { username, email, profilePicture, bio } = req.body;
    
    // Check if username exists if changing
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Username is already taken' });
    }
    
    // Check if email exists if changing
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email is already in use' });
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        ...(username && { username }),
        ...(email && { email }),
        ...(profilePicture !== undefined && { profilePicture }),
        ...(bio !== undefined && { bio })
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
        joinedDate: updatedUser.joinedDate
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/deleteUser', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
