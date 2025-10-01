const amqp = require('amqplib');
const MediaService = require('./mediaService');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

class MediaProcessorService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(config.rabbitmq.url);
      this.channel = await this.connection.createChannel();
      
      const exchange = 'media_events';
      await this.channel.assertExchange(exchange, 'topic', { durable: true });
      
      // Create queue for media processing
      const queue = config.rabbitmq.queue;
      await this.channel.assertQueue(queue, { durable: true });
      
      // Bind queue to exchange
      await this.channel.bindQueue(queue, exchange, 'media.uploaded');
      await this.channel.bindQueue(queue, exchange, 'media.deleted');
      
      console.log('Connected to RabbitMQ for media processing');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async startProcessing() {
    if (!this.channel) {
      await this.connect();
    }

    this.channel.consume(config.rabbitmq.queue, async (msg) => {
      if (msg) {
        try {
          const data = JSON.parse(msg.content.toString());
          const routingKey = msg.fields.routingKey;
          
          console.log(`Processing ${routingKey}:`, data);
          
          if (routingKey === 'media.uploaded') {
            await this.processUploadedMedia(data);
          } else if (routingKey === 'media.deleted') {
            await this.processDeletedMedia(data);
          }
          
          this.channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel.nack(msg);
        }
      }
    });
  }

  async processUploadedMedia(data) {
    const { mediaId, path: filePath, type, filename } = data;
    
    try {
      if (type === 'video') {
        await this.processVideo(filePath, mediaId);
      } else if (type === 'image') {
        await this.processImage(filePath, mediaId);
      }
    } catch (error) {
      console.error(`Error processing ${type} ${filename}:`, error);
    }
  }

  async processVideo(filePath, mediaId) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, async (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
          const duration = metadata.format.duration;
          
          const videoMetadata = {
            duration: Math.round(duration),
            width: videoStream.width,
            height: videoStream.height,
            format: metadata.format.format_name,
            codec: videoStream.codec_name
          };

          await MediaService.updateMetadata(mediaId, videoMetadata);
          
          // Generate poster image
          await this.generateVideoPoster(filePath, mediaId);
          
          console.log(`Video processed: ${mediaId}`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async processImage(filePath, mediaId) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, async (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const imageStream = metadata.streams.find(stream => stream.codec_type === 'video');
          
          const imageMetadata = {
            width: imageStream.width,
            height: imageStream.height,
            format: metadata.format.format_name
          };

          await MediaService.updateMetadata(mediaId, imageMetadata);
          
          console.log(`Image processed: ${mediaId}`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async generateVideoPoster(videoPath, mediaId) {
    const posterPath = videoPath.replace(path.extname(videoPath), '_poster.jpg');
    
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['00:00:01'],
          filename: path.basename(posterPath),
          folder: path.dirname(posterPath),
          size: '1280x720'
        })
        .on('end', async () => {
          try {
            // Create new media record for poster
            const posterMedia = await MediaService.create({
              filename: path.basename(posterPath),
              originalName: path.basename(posterPath),
              mimeType: 'image/jpeg',
              size: (await fs.stat(posterPath)).size,
              path: posterPath,
              url: `${config.paths.static}/${path.basename(posterPath)}`,
              type: 'image',
              tags: ['poster', 'video-thumbnail']
            });
            
            // Update original video with poster reference
            await MediaService.updateMetadata(mediaId, { posterId: posterMedia._id });
            
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  async processDeletedMedia(data) {
    const { mediaId, path: filePath } = data;
    
    try {
      // Delete physical file
      await fs.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }

  async disconnect() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

module.exports = new MediaProcessorService(); 
