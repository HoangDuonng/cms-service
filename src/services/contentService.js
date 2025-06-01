const Content = require('../models/Content');

class ContentService {
  async create(data) {
    return await Content.create(data);
  }

  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [content, total] = await Promise.all([
      Content.find(query)
        .populate('categories')
        .populate('tags')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Content.countDocuments(query)
    ]);

    return {
      content,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id) {
    return await Content.findById(id)
      .populate('categories')
      .populate('tags');
  }

  async findBySlug(slug) {
    return await Content.findOne({ slug })
      .populate('categories')
      .populate('tags');
  }

  async update(id, data) {
    return await Content.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true }
    ).populate('categories').populate('tags');
  }

  async delete(id) {
    return await Content.findByIdAndDelete(id);
  }

  async incrementViewCount(id) {
    return await Content.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
  }

  static async getPublishedContent() {
    return await Content.find({ status: 'published' }).populate('media');
  }

  static async getPublishedContentById(id) {
    return await Content.findOne({
      _id: id,
      status: 'published'
    }).populate('media');
  }
}

module.exports = new ContentService(); 
