const mongoose = require('mongoose');
const slugify = require('slugify');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  featuredImage: {
    type: String
  },
  type: {
    type: String,
    enum: ['post', 'page', 'product'],
    default: 'post'
  },
  author: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  meta: {
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    keywords: {
      type: String,
      trim: true
    }
  },
  language: {
    type: String,
    default: 'vi'
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Add indexes
contentSchema.index({ slug: 1 });
contentSchema.index({ type: 1 });
contentSchema.index({ status: 1 });
contentSchema.index({ categories: 1 });
contentSchema.index({ tags: 1 });

// Generate slug from title
contentSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: 'vi'
    });
  }
  next();
});

// Virtual for comments
contentSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'contentId'
});

// Set publishedAt when status changes to published
contentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Update comment count when comments are added/removed
contentSchema.methods.updateCommentCount = async function() {
  const Comment = mongoose.model('Comment');
  this.commentCount = await Comment.countDocuments({ 
    contentId: this._id,
    status: 'approved'
  });
  await this.save();
};

module.exports = mongoose.model('Content', contentSchema); 
