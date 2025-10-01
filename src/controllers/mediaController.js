const MediaService = require('../services/mediaService');
const ApiResponse = require('../utils/apiResponse');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|wmv|flv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

exports.uploadMedia = [
  upload.single('media'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return ApiResponse.error(res, 'No file uploaded', 400);
      }

      const media = await MediaService.createFromFile(req.file);
      return ApiResponse.success(res, media, 'Media uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }
];

exports.getAllMedia = async (req, res, next) => {
  try {
    const { type, tags } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (tags) query.tags = { $in: tags.split(',') };

    const media = await MediaService.findAll(query);
    return ApiResponse.success(res, media);
  } catch (error) {
    next(error);
  }
};

exports.getMediaById = async (req, res, next) => {
  try {
    const media = await MediaService.findById(req.params.id);
    if (!media) {
      return ApiResponse.error(res, 'Media not found', 404);
    }
    return ApiResponse.success(res, media);
  } catch (error) {
    next(error);
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const result = await MediaService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Media deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getVideoBanners = async (req, res, next) => {
  try {
    const videos = await MediaService.getVideoBanners();
    return ApiResponse.success(res, videos);
  } catch (error) {
    next(error);
  }
};

exports.getBannerMedia = async (req, res, next) => {
  try {
    const media = await MediaService.getBannerMedia();
    return ApiResponse.success(res, media);
  } catch (error) {
    next(error);
  }
};

exports.updateMediaMetadata = async (req, res, next) => {
  try {
    const { metadata } = req.body;
    const media = await MediaService.updateMetadata(req.params.id, metadata);
    if (!media) {
      return ApiResponse.error(res, 'Media not found', 404);
    }
    return ApiResponse.success(res, media, 'Metadata updated successfully');
  } catch (error) {
    next(error);
  }
};

// Export upload middleware for use in routes
exports.upload = upload; 
