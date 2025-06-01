const Comment = require('../models/Comment');

class CommentService {
  async create(data) {
    return await Comment.create(data);
  }

  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find(query)
        .populate('post')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Comment.countDocuments(query)
    ]);

    return {
      comments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id) {
    return await Comment.findById(id).populate('post');
  }

  async update(id, data) {
    return await Comment.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true }
    ).populate('post');
  }

  async delete(id) {
    const comment = await Comment.findById(id);
    if (!comment) return null;
    await comment.remove();
    return comment;
  }

  async findByPost(postId, options = {}) {
    const { status = 'approved', page = 1, limit = 10 } = options;
    return this.findAll(
      { post: postId, status },
      { page, limit, sort: { createdAt: -1 } }
    );
  }
}

module.exports = new CommentService(); 
