const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logDir = process.env.LOG_DIR || 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
  console.log(`Created log directory: ${logDir}`);
}

// Logger configuration from environment variables
const loggerConfig = {
  maxSize: process.env.LOG_MAX_SIZE || '20m',
  maxFiles: process.env.LOG_MAX_FILES || '14d',
  datePattern: process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD',
  zippedArchive: process.env.LOG_ZIPPED_ARCHIVE === 'true',
  level: process.env.LOG_LEVEL || 'info'
};

console.log('Logger config:', loggerConfig);

// Custom format to clean up stack traces
const cleanStackFormat = winston.format((info) => {
  if (info.stack) {
    // Remove node_modules paths and clean up stack trace
    info.stack = info.stack
      .split('\n')
      .filter(line => !line.includes('node_modules'))
      .slice(0, 3)  // Only keep first 3 lines
      .join('\n');
  }
  return info;
});

// Custom format to clean up request info
const requestFormat = winston.format((info) => {
  if (info.body) {
    // Remove empty arrays and objects
    if (Object.keys(info.body).length === 0) delete info.body;
  }
  if (info.params && Object.keys(info.params).length === 0) delete info.params;
  if (info.query && Object.keys(info.query).length === 0) delete info.query;
  return info;
});

// Common format configuration
const logFormat = winston.format.combine(
  cleanStackFormat(),
  requestFormat(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.json()
);

// Create rotate transport
const createRotateTransport = (filename, level) => {
  const transport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, `${filename}-%DATE%.log`),
    datePattern: loggerConfig.datePattern,
    maxSize: loggerConfig.maxSize,
    maxFiles: loggerConfig.maxFiles,
    zippedArchive: loggerConfig.zippedArchive,
    level: level,
    format: logFormat
  });

  // Log when a new file is created
  transport.on('new', (filename) => {
    console.log(`New log file created: ${filename}`);
  });

  // Log when a file is rotated
  transport.on('rotate', (oldFilename, newFilename) => {
    console.log(`Log file rotated from ${oldFilename} to ${newFilename}`);
  });

  return transport;
};

const logger = winston.createLogger({
  level: loggerConfig.level,
  format: logFormat,
  transports: [
    createRotateTransport('error', 'error'),
    createRotateTransport('combined', 'info')
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Test log on startup
logger.info('Logger initialized', {
  config: loggerConfig,
  logDir: logDir
});

// Request logger middleware
const requestLogger = (req, res, next) => {
  // Store original end function
  const originalEnd = res.end;

  // Override end function
  res.end = function (chunk, encoding) {
    // Restore original end
    res.end = originalEnd;

    // Only log successful requests (status < 400)
    if (res.statusCode < 400) {
      const logData = {
        method: req.method,
        path: req.path,
        ip: req.ip,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString()
      };
      logger.info('Request completed', logData);
    }

    // Call original end
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = logger;
module.exports.requestLogger = requestLogger; 
