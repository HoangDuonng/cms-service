const Media = require('../models/Media');
const fs = require('fs').promises;

class MediaService {
  static async create(mediaData) {
    return await Media.create(mediaData);
  }

  static async findAll() {
    return await Media.find();
  }

  static async findById(id) {
    return await Media.findById(id);
  }

  static async delete(id) {
    const media = await Media.findById(id);
    if (!media) {
      throw new Error('Media not found');
    }

    // Delete file from filesystem
    await fs.unlink(media.path);
    
    // Delete from database
    await media.remove();

    return true;
  }

  static async createFromFile(file) {
    return await Media.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`
    });
  }
}

module.exports = MediaService; 
