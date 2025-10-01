const mongoose = require('mongoose');

const ContentBlockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  text: String,
  src: String,
  alt: String
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: String,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  author: { type: String, default: 'Admin' },
  slug: { type: String, required: true, unique: true, lowercase: true },
  content: [ContentBlockSchema]
});

module.exports = mongoose.model('Blog', BlogSchema); 
