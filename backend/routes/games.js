
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Game = require('../models/Game');
const auth = require('../middleware/auth');

// Input validation schema
const gameSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  imageUrl: Joi.string().required(),
  genre: Joi.string().required(),
  platform: Joi.array().items(Joi.string()).required(),
  releaseDate: Joi.date().required(),
  rating: Joi.number().min(0).max(5).default(0)
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new game (admin only in a real app)
router.post('/', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = gameSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const { title, description, imageUrl, genre, platform, releaseDate, rating } = req.body;
    
    // Create new game
    const newGame = new Game({
      title,
      description,
      imageUrl,
      genre,
      platform,
      releaseDate,
      rating: rating || 0
    });
    
    // Save game
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    console.error('Add game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update game (admin only in a real app)
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = gameSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    // Find and update game
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedGame) return res.status(404).json({ message: 'Game not found' });
    
    res.json(updatedGame);
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete game (admin only in a real app)
router.delete('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
