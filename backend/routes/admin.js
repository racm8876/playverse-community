
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const Game = require('../models/Game');
const Blog = require('../models/Blog');
const Community = require('../models/Community');
const User = require('../models/User');

// Middleware to protect admin routes
router.use(auth, isAdmin);

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const gameCount = await Game.countDocuments();
    const blogCount = await Blog.countDocuments();
    const communityCount = await Community.countDocuments();
    
    res.json({
      stats: {
        users: userCount,
        games: gameCount,
        blogs: blogCount,
        communities: communityCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get list of all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Update user admin status
router.patch('/users/:userId/admin', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin } = req.body;
    
    if (typeof isAdmin !== 'boolean') {
      return res.status(400).json({ message: 'isAdmin field must be a boolean' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { isAdmin }, 
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User admin status updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete a game
router.delete('/games/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findByIdAndDelete(gameId);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Also remove game references from communities
    await Community.updateMany(
      { game: gameId },
      { $unset: { game: 1 } }
    );
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting game', error: error.message });
  }
});

// Delete a blog
router.delete('/blogs/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findByIdAndDelete(blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
});

// Delete a community
router.delete('/communities/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findByIdAndDelete(communityId);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Also remove community references from users
    await User.updateMany(
      { communities: communityId },
      { $pull: { communities: communityId } }
    );
    
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting community', error: error.message });
  }
});

module.exports = router;
