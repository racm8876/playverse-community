
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Community = require('../models/Community');
const auth = require('../middleware/auth');

// Input validation schema
const communitySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  imageUrl: Joi.string().required(),
  game: Joi.string().required(),
  tags: Joi.array().items(Joi.string())
});

// Get all communities
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('game', 'title')
      .sort({ createdAt: -1 });
      
    res.json(communities);
  } catch (error) {
    console.error('Get communities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get community by ID
router.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('game', 'title imageUrl')
      .populate('members', 'username profilePicture');
      
    if (!community) return res.status(404).json({ message: 'Community not found' });
    
    res.json(community);
  } catch (error) {
    console.error('Get community error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new community
router.post('/', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = communitySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const { name, description, imageUrl, game, tags } = req.body;
    
    // Check if community name already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) return res.status(400).json({ message: 'Community name already exists' });
    
    // Create new community
    const newCommunity = new Community({
      name,
      description,
      imageUrl,
      game,
      tags: tags || [],
      members: [req.user._id] // Add creator as first member
    });
    
    // Save community
    await newCommunity.save();
    
    res.status(201).json(newCommunity);
  } catch (error) {
    console.error('Create community error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join community
router.post('/:id/join', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    
    // Check if user is already a member
    if (community.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this community' });
    }
    
    // Add user to community
    community.members.push(req.user._id);
    await community.save();
    
    res.json({ message: 'Successfully joined the community' });
  } catch (error) {
    console.error('Join community error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave community
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    
    // Check if user is a member
    if (!community.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are not a member of this community' });
    }
    
    // Remove user from community
    community.members = community.members.filter(member => !member.equals(req.user._id));
    await community.save();
    
    res.json({ message: 'Successfully left the community' });
  } catch (error) {
    console.error('Leave community error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
