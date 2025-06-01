const Setting = require('../models/Setting');
const ApiResponse = require('../utils/apiResponse');

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        siteName: 'My CMS',
        siteDescription: 'Content Management System',
        content: {
          defaultLanguage: 'vi',
          postsPerPage: 10,
          enableComments: true,
          enableRelatedPosts: true,
          relatedPostsCount: 3
        },
        display: {
          showAuthor: true,
          showDate: true,
          showCategories: true,
          showTags: true
        }
      });
    }
    return ApiResponse.success(res, settings);
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
      return ApiResponse.success(res, settings, 'Settings created successfully', 201);
    }

    settings = await Setting.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    return ApiResponse.success(res, settings);
  } catch (error) {
    next(error);
  }
};

exports.updatePartialSettings = async (req, res, next) => {
  try {
    const { section, data } = req.body;
    if (!section || !data) {
      return ApiResponse.error(res, 'Section and data are required', 400);
    }

    let settings = await Setting.findOne();
    if (!settings) {
      return ApiResponse.error(res, 'Settings not found', 404);
    }

    settings[section] = {
      ...settings[section],
      ...data
    };

    await settings.save();
    return ApiResponse.success(res, settings);
  } catch (error) {
    next(error);
  }
};

exports.deleteSettings = async (req, res, next) => {
  try {
    const settings = await Setting.findOne();
    if (!settings) {
      return ApiResponse.error(res, 'Settings not found', 404);
    }

    await settings.deleteOne();
    return ApiResponse.success(res, null, 'Settings deleted successfully');
  } catch (error) {
    next(error);
  }
}; 
