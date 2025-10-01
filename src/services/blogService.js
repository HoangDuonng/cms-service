const Blog = require('../models/Blog');

function slugify(str) {
  return str
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // remove accents
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

class BlogService {
  async getBlogs() {
    return Blog.find().sort({ date: -1 });
  }

  async getBlogsByStatus(status) {
    return Blog.find({ status }).sort({ date: -1 });
  }

  async getBlogById(id) {
    return Blog.findById(id);
  }

  async getBlogBySlug(slug) {
    return Blog.findOne({ slug });
  }

  async createBlog(data) {
    let slug = data.slug || slugify(data.title);
    const existed = await Blog.findOne({ slug });
    if (existed) {
      const err = new Error('Slug đã tồn tại, vui lòng chọn slug khác hoặc đổi tiêu đề');
      err.status = 400;
      throw err;
    }
    data.slug = slug;
    return Blog.create(data);
  }

  async updateBlog(id, data) {
    if (data.title && !data.slug) {
      data.slug = slugify(data.title);
    }
    if (data.slug) {
      const existed = await Blog.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existed) {
        const err = new Error('Slug đã tồn tại, vui lòng chọn slug khác hoặc đổi tiêu đề');
        err.status = 400;
        throw err;
      }
      data.slug = slugify(data.slug);
    }
    return Blog.findByIdAndUpdate(id, data, { new: true });
  }

  async updateBlogStatus(id, status) {
    const validStatuses = ['draft', 'published', 'archived', 'deleted'];
    if (!validStatuses.includes(status)) {
      const err = new Error('Status không hợp lệ');
      err.status = 400;
      throw err;
    }
    return Blog.findByIdAndUpdate(id, { status }, { new: true });
  }

  async publishBlog(id) {
    return this.updateBlogStatus(id, 'published');
  }

  async unpublishBlog(id) {
    return this.updateBlogStatus(id, 'draft');
  }

  async archiveBlog(id) {
    return this.updateBlogStatus(id, 'archived');
  }

  async unarchiveBlog(id) {
    return this.updateBlogStatus(id, 'draft');
  }

  async deleteBlog(id) {
    return Blog.findByIdAndDelete(id);
  }
}

module.exports = new BlogService(); 
