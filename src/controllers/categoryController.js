const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return ApiResponse.success(res, category, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const categories = await Category.find(query)
      .populate('parent')
      .sort({ order: 1, name: 1 });

    return ApiResponse.success(res, categories);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent');

    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }

    return ApiResponse.success(res, category);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parent');

    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }

    return ApiResponse.success(res, category);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('parent');

    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }

    return ApiResponse.success(res, category);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }

    // Check if category has children
    const hasChildren = await Category.exists({ parent: category._id });
    if (hasChildren) {
      return ApiResponse.error(res, 'Cannot delete category with subcategories', 400);
    }

    await category.remove();
    return ApiResponse.success(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getCategoryTree = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate('parent')
      .sort({ order: 1, name: 1 });

    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.parent?._id?.toString() === parentId?.toString())
        .map(item => ({
          ...item.toObject(),
          children: buildTree(items, item._id)
        }));
    };

    const tree = buildTree(categories);
    return ApiResponse.success(res, tree);
  } catch (error) {
    next(error);
  }
}; 
