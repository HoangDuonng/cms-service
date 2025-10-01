const blogService = require('../services/blogService');
const ApiResponse = require('../utils/apiResponse');

exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getBlogs();
    return ApiResponse.success(res, blogs);
  } catch (error) {
    next(error);
  }
};

exports.getBlogsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const blogs = await blogService.getBlogsByStatus(status);
    return ApiResponse.success(res, blogs);
  } catch (error) {
    next(error);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) return ApiResponse.error(res, 'Blog not found', 404);
    return ApiResponse.success(res, blog);
  } catch (error) {
    next(error);
  }
};

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    if (!blog) return ApiResponse.error(res, 'Blog not found', 404);
    return ApiResponse.success(res, blog);
  } catch (error) {
    next(error);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const blog = await blogService.createBlog(req.body);
    return ApiResponse.success(res, blog, 'Blog created successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    if (!blog) return ApiResponse.error(res, 'Blog not found', 404);
    return ApiResponse.success(res, blog, 'Blog updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateBlogStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const blog = await blogService.updateBlogStatus(id, status);
    if (!blog) return ApiResponse.error(res, 'Blog not found', 404);
    return ApiResponse.success(res, blog, 'Blog status updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.publishBlog = async (req, res, next) => {
  try {
    const blog = await blogService.publishBlog(req.params.id);
    if (!blog) return ApiResponse.error(res, 'Blog not found', 404);
    return ApiResponse.success(res, blog, 'Blog published successfully');
  } catch (error) {
    next(error);
  }
};

exports.unpublishBlog = async (req, res, next) => {
  try {
    const blog = await blogService.unpublishBlog(req.params.id);
    if (!blog) return ApiResponse.error(res, 'Blog not found', 404);
    return ApiResponse.success(res, blog, 'Blog unpublished successfully');
  } catch (error) {
    next(error);
  }
};

exports.archiveBlog = async (req, res, next) => {
  try {
    const blog = await blogService.archiveBlog(req.params.id);
    if (!blog) return ApiResponse.error(res, 'Blog not found', 404);
    return ApiResponse.success(res, blog, 'Blog archived successfully');
  } catch (error) {
    next(error);
  }
};

exports.unarchiveBlog = async (req, res, next) => {
  try {
    const blog = await blogService.unarchiveBlog(req.params.id);
    if (!blog) return ApiResponse.error(res, 'Blog not found', 404);
    return ApiResponse.success(res, blog, 'Blog unarchived successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await blogService.deleteBlog(req.params.id);
    if (!blog) return ApiResponse.error(res, 'Blog not found', 404);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 
