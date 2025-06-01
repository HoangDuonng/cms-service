const mongoose = require('mongoose');

const layoutSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['header', 'banner', 'section', 'footer', 'widget']
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'vi'
  },
  display: {
    isVisible: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    },
    conditions: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  bannerGroup: {
    type: String,
    default: null
  },
  groupOrder: {
    type: Number,
    default: 0
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

// Example content structure for different types:
// Header: { logo: '...', menu: [{ title: 'Home', url: '/' }] }
// Banner: { title: 'Welcome', description: '...', image: '...', cta: { text: 'Learn More', url: '...' } }
// Section: { title: 'About Us', content: '...', background: '...', layout: 'full-width' }
// Footer: { sections: [{ title: 'About', content: '...' }] }
// Widget: { type: 'search', title: 'Search', config: {} }

// Add query middleware to exclude soft deleted documents
layoutSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

layoutSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});

layoutSchema.pre('findById', function() {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model('Layout', layoutSchema);
