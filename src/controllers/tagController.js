const Tag = require('../models/Tag');
const ApiResponse = require('../utils/apiResponse');

exports.createTag = async (req, res, next) => {
  try {
    const tag = await Tag.create(req.body);
    return ApiResponse.success(res, tag, 'Tag created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllTags = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const tags = await Tag.find(query).sort({ name: 1 });
    return ApiResponse.success(res, tags);
  } catch (error) {
    next(error);
  }
};

exports.getTagById = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return ApiResponse.error(res, 'Tag not found', 404);
    }
    return ApiResponse.success(res, tag);
  } catch (error) {
    next(error);
  }
};

exports.getTagBySlug = async (req, res, next) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) {
      return ApiResponse.error(res, 'Tag not found', 404);
    }
    return ApiResponse.success(res, tag);
  } catch (error) {
    next(error);
  }
};

exports.updateTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!tag) {
      return ApiResponse.error(res, 'Tag not found', 404);
    }

    return ApiResponse.success(res, tag);
  } catch (error) {
    next(error);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return ApiResponse.error(res, 'Tag not found', 404);
    }

    await tag.remove();
    return ApiResponse.success(res, null, 'Tag deleted successfully');
  } catch (error) {
    next(error);
  }
}; 
