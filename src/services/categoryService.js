const Category = require('../models/Category');

class CategoryService {
  async create(data) {
    return await Category.create(data);
  }

  async findAll(query = {}) {
    return await Category.find(query)
      .populate('parent')
      .sort({ order: 1, name: 1 });
  }

  async findById(id) {
    return await Category.findById(id).populate('parent');
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug }).populate('parent');
  }

  async update(id, data) {
    return await Category.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true }
    ).populate('parent');
  }

  async delete(id) {
    const category = await Category.findById(id);
    if (!category) return null;

    // Check if category has children
    const hasChildren = await Category.exists({ parent: category._id });
    if (hasChildren) {
      throw new Error('Cannot delete category with subcategories');
    }

    await category.remove();
    return category;
  }

  async buildTree() {
    const categories = await this.findAll();
    
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.parent?._id?.toString() === parentId?.toString())
        .map(item => ({
          ...item.toObject(),
          children: buildTree(items, item._id)
        }));
    };

    return buildTree(categories);
  }
}

module.exports = new CategoryService(); 
