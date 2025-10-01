const Comment = require('../models/Comment');
const Content = require('../models/Content');
const ApiResponse = require('../utils/apiResponse');

exports.createComment = async (req, res, next) => {
  try {
    const { text, author, contentId, parent } = req.body;

    // Validate required fields
    if (!text || !author || !contentId) {
      return ApiResponse.error(res, 'Comment text, author and content ID are required', 400);
    }

    // Validate content exists
    const contentExists = await Content.findById(contentId);
    if (!contentExists) {
      return ApiResponse.error(res, 'Content not found', 400);
    }

    // Validate parent comment exists if provided
    if (parent) {
      const parentComment = await Comment.findById(parent);
      if (!parentComment) {
        return ApiResponse.error(res, 'Parent comment not found', 400);
      }
      // Validate parent comment belongs to the same content
      if (parentComment.contentId && parentComment.contentId.toString() !== contentId) {
        return ApiResponse.error(res, 'Parent comment does not belong to the specified content', 400);
      }
    }

    const comment = await Comment.create({
      text,
      author,
      contentId,
      parent: parent || null,
      status: 'pending',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Update comment count in content
    await contentExists.updateCommentCount();

    // Populate content information
    const populatedComment = await Comment.findById(comment._id)
      .populate('contentId', 'title slug type status')
      .populate('parent', 'text author');

    return ApiResponse.success(res, populatedComment, 'Comment created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllComments = async (req, res, next) => {
  try {
    const { contentId, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (contentId) query.contentId = contentId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const comments = await Comment.find(query)
      .populate('contentId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(query);

    return ApiResponse.success(res, {
      comments,
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

exports.getCommentById = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('contentId');

    if (!comment) {
      return ApiResponse.error(res, 'Comment not found', 404);
    }

    return ApiResponse.success(res, comment);
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('contentId');

    if (!comment) {
      return ApiResponse.error(res, 'Comment not found', 404);
    }

    // Update comment count in content if status changed
    if (req.body.status) {
      const content = await Content.findById(comment.contentId);
      if (content) {
        await content.updateCommentCount();
      }
    }

    return ApiResponse.success(res, comment);
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return ApiResponse.error(res, 'Comment not found', 404);
    }

    // Get content before deleting comment
    const content = await Content.findById(comment.contentId);

    await comment.remove();

    // Update comment count in content
    if (content) {
      await content.updateCommentCount();
    }

    return ApiResponse.success(res, null, 'Comment deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getContentComments = async (req, res, next) => {
  try {
    const { status = 'approved', page = 1, limit = 10 } = req.query;
    const query = {
      contentId: req.params.contentId,
      status
    };

    const skip = (page - 1) * limit;
    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(query);

    return ApiResponse.success(res, {
      comments,
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
