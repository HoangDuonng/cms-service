const Tag = require('../models/Tag');

class TagService {
  async create(data) {
    return await Tag.create(data);
  }

  async findAll(query = {}) {
    return await Tag.find(query).sort({ name: 1 });
  }

  async findById(id) {
    return await Tag.findById(id);
  }

  async findBySlug(slug) {
    return await Tag.findOne({ slug });
  }

  async update(id, data) {
    return await Tag.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true }
    );
  }

  async delete(id) {
    const tag = await Tag.findById(id);
    if (!tag) return null;
    await tag.remove();
    return tag;
  }
}

module.exports = new TagService(); 
