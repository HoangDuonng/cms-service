const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    required: true
  },
  metadata: {
    width: Number,
    height: Number,
    duration: Number, // for videos
    format: String,
    codec: String // for videos
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add query middleware to exclude soft deleted documents
mediaSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

mediaSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});

mediaSchema.pre('findById', function() {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model('Media', mediaSchema); 
