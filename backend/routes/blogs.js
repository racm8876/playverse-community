
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// Input validation schema
const blogSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  imageUrl: Joi.string().required(),
  tags: Joi.array().items(Joi.string())
});

const commentSchema = Joi.object({
  text: Joi.string().required()
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username profilePicture')
      .sort({ publishDate: -1 });
    
    res.json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');
    
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new blog
router.post('/', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = blogSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const { title, content, imageUrl, tags } = req.body;
    
    // Create new blog
    const newBlog = new Blog({
      title,
      content,
      author: req.user._id,
      imageUrl,
      tags: tags || []
    });
    
    // Save blog
    await newBlog.save();
    
    // Populate author details
    await newBlog.populate('author', 'username profilePicture');
    
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = blogSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    // Find blog
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    // Check if user is the author
    if (!blog.author.equals(req.user._id)) {
      return res.status(403).json({ message: 'You are not authorized to update this blog' });
    }
    
    // Update blog
    const { title, content, imageUrl, tags } = req.body;
    blog.title = title;
    blog.content = content;
    blog.imageUrl = imageUrl;
    blog.tags = tags || blog.tags;
    
    // Save updated blog
    await blog.save();
    
    // Populate author details
    await blog.populate('author', 'username profilePicture');
    
    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find blog
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    // Check if user is the author
    if (!blog.author.equals(req.user._id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog' });
    }
    
    // Delete blog
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to blog
router.post('/:id/comment', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = commentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const { text } = req.body;
    
    // Find blog
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    // Add comment
    blog.comments.push({
      user: req.user._id,
      text
    });
    
    // Save blog
    await blog.save();
    
    // Populate comment user details
    await blog.populate('comments.user', 'username profilePicture');
    
    res.status(201).json(blog.comments[blog.comments.length - 1]);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    // Find and update blog
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    res.json({ likes: blog.likes });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
