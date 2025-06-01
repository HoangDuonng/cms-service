const Content = require('../models/Content');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const ApiResponse = require('../utils/apiResponse');

exports.createContent = async (req, res, next) => {
  try {
    // Validate categories if provided
    if (req.body.categories && req.body.categories.length > 0) {
      const categories = await Category.find({ _id: { $in: req.body.categories } });
      if (categories.length !== req.body.categories.length) {
        return ApiResponse.error(res, 'One or more categories not found', 400);
      }
    }

    // Validate tags if provided
    if (req.body.tags && req.body.tags.length > 0) {
      const tags = await Tag.find({ _id: { $in: req.body.tags } });
      if (tags.length !== req.body.tags.length) {
        return ApiResponse.error(res, 'One or more tags not found', 400);
      }
    }

    const content = await Content.create({
      ...req.body,
      slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      status: req.body.status || 'draft',
      viewCount: 0
    });

    // Populate categories and tags in response
    const populatedContent = await Content.findById(content._id)
      .populate('categories')
      .populate('tags');

    return ApiResponse.success(res, populatedContent, 'Content created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllContent = async (req, res, next) => {
  try {
    const { type, status, category, tag, language, page = 1, limit = 10 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (language) query.language = language;

    const skip = (page - 1) * limit;
    const content = await Content.find(query)
      .populate('categories')
      .populate('tags')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Content.countDocuments(query);

    return ApiResponse.success(res, {
      content,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('categories')
      .populate('tags');

    if (!content) {
      return ApiResponse.error(res, 'Content not found', 404);
    }

    // Increment view count
    content.viewCount += 1;
    await content.save();

    return ApiResponse.success(res, content);
  } catch (error) {
    next(error);
  }
};

exports.getContentBySlug = async (req, res, next) => {
  try {
    const content = await Content.findOne({ slug: req.params.slug })
      .populate('categories')
      .populate('tags');

    if (!content) {
      return ApiResponse.error(res, 'Content not found', 404);
    }

    // Increment view count
    content.viewCount += 1;
    await content.save();

    return ApiResponse.success(res, content);
  } catch (error) {
    next(error);
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('categories').populate('tags');
    
    if (!content) {
      return ApiResponse.error(res, 'Content not found', 404);
    }
    return ApiResponse.success(res, content);
  } catch (error) {
    next(error);
  }
};

exports.deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return ApiResponse.error(res, 'Content not found', 404);
    }
    return ApiResponse.success(res, null, 'Content deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getPublishedContent = async (req, res, next) => {
  try {
    const { type, category, tag, language, page = 1, limit = 10 } = req.query;
    const query = { status: 'published' };

    if (type) query.type = type;
    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (language) query.language = language;

    const skip = (page - 1) * limit;
    const content = await Content.find(query)
      .populate('categories')
      .populate('tags')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Content.countDocuments(query);

    return ApiResponse.success(res, {
      content,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPublishedContentBySlug = async (req, res, next) => {
  try {
    const content = await Content.findOne({
      slug: req.params.slug,
      status: 'published'
    }).populate('categories').populate('tags');
    
    if (!content) {
      return ApiResponse.error(res, 'Content not found', 404);
    }

    // Increment view count
    content.viewCount += 1;
    await content.save();

    return ApiResponse.success(res, content);
  } catch (error) {
    next(error);
  }
}; 
