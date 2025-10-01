const Media = require('../models/Media');
const fs = require('fs').promises;
const amqp = require('amqplib');
const config = require('../config');

class MediaService {
  static async create(mediaData) {
    return await Media.create(mediaData);
  }

  static async findAll(query = {}) {
    return await Media.find(query).sort({ createdAt: -1 });
  }

  static async findById(id) {
    return await Media.findById(id);
  }

  static async findByType(type) {
    return await Media.find({ type, isActive: true }).sort({ createdAt: -1 });
  }

  static async delete(id) {
    const media = await Media.findById(id);
    if (!media) {
      throw new Error('Media not found');
    }

    // Soft delete
    media.isDeleted = true;
    media.deletedAt = Date.now();
    await media.save();

    // Send delete event to RabbitMQ
    await this.publishEvent('media.deleted', { mediaId: id, path: media.path });

    return true;
  }

  static async createFromFile(file) {
    const mediaType = this.getMediaType(file.mimetype);
    
    const media = await Media.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: `${config.paths.static}/${file.filename}`,
      type: mediaType
    });

    // Send processing event to RabbitMQ
    await this.publishEvent('media.uploaded', {
      mediaId: media._id,
      path: file.path,
      type: mediaType,
      filename: file.filename
    });

    return media;
  }

  static getMediaType(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  }

  static async updateMetadata(mediaId, metadata) {
    return await Media.findByIdAndUpdate(
      mediaId,
      { 
        metadata,
        updatedAt: Date.now()
      },
      { new: true }
    );
  }

  static async publishEvent(eventType, data) {
    try {
      const connection = await amqp.connect(config.rabbitmq.url);
      const channel = await connection.createChannel();
      
      const exchange = 'media_events';
      await channel.assertExchange(exchange, 'topic', { durable: true });
      
      channel.publish(exchange, eventType, Buffer.from(JSON.stringify(data)));
      
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Failed to publish RabbitMQ event:', error);
    }
  }

  static async getVideoBanners() {
    return await Media.find({
      type: 'video',
      isActive: true,
      isDeleted: false,
      'metadata.duration': { $exists: true }
    }).sort({ createdAt: -1 });
  }

  static async getBannerMedia() {
    return await Media.find({
      type: { $in: ['image', 'video'] },
      isActive: true,
      isDeleted: false,
      tags: { $in: ['banner', 'homepage'] }
    }).sort({ createdAt: -1 });
  }
}

module.exports = MediaService; 
