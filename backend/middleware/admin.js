
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    // User is already authenticated at this point through the auth middleware
    const user = req.user;
    
    // Check if user has admin role
    // Note: You need to add an "isAdmin" field to your User model
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = isAdmin;
