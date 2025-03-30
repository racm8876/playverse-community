
const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for member count
communitySchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Include virtuals when converting to JSON
communitySchema.set('toJSON', { virtuals: true });
communitySchema.set('toObject', { virtuals: true });

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
