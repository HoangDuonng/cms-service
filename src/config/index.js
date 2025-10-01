require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8086,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/db-cms',
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/cms',
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : [
          process.env.FRONTEND_CLIENT_URL || 'http://localhost:3000',
          process.env.FRONTEND_ADMIN_URL || 'http://localhost:3001', 
        ]
  },
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || '100mb',
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    mediaPath: process.env.MEDIA_PATH || './uploads/media',
    tempPath: process.env.TEMP_PATH || './uploads/temp'
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    queue: process.env.RABBITMQ_QUEUE || 'media_processing'
  },
  paths: {
    logs: process.env.LOGS_PATH || './logs',
    public: process.env.PUBLIC_PATH || './public',
    static: process.env.STATIC_PATH || './public/static'
  },
  logLevel: process.env.LOG_LEVEL || 'info'
}; 
