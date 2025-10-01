const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // Basic Information
  siteName: {
    type: String,
    required: true,
    trim: true
  },
  siteDescription: {
    type: String,
    trim: true
  },

  // SEO Settings
  seo: {
    metaTitle: {
      type: String,
      trim: true
    },
    metaDescription: {
      type: String,
      trim: true
    },
    metaKeywords: {
      type: String,
      trim: true
    }
  },

  // Content Settings
  content: {
    defaultLanguage: {
      type: String,
      default: 'vi'
    },
    postsPerPage: {
      type: Number,
      default: 10
    },
    enableComments: {
      type: Boolean,
      default: true
    },
    enableRelatedPosts: {
      type: Boolean,
      default: true
    },
    relatedPostsCount: {
      type: Number,
      default: 3
    }
  },

  // Display Settings
  display: {
    showAuthor: {
      type: Boolean,
      default: true
    },
    showDate: {
      type: Boolean,
      default: true
    },
    showCategories: {
      type: Boolean,
      default: true
    },
    showTags: {
      type: Boolean,
      default: true
    }
  },

  // Timestamps
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

// Ensure only one settings document exists
settingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    if (count > 0) {
      throw new Error('Only one settings document can exist');
    }
  }
  next();
});

module.exports = mongoose.model('Setting', settingSchema); 
