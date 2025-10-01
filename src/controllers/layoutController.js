const layoutService = require('../services/layoutService');
const ApiResponse = require('../utils/apiResponse');

exports.createLayout = async (req, res, next) => {
  try {
    // Transform displayPeriod to display object
    if (req.body.displayPeriod) {
      req.body.display = {
        ...req.body.display,
        startDate: req.body.displayPeriod.startDate,
        endDate: req.body.displayPeriod.endDate
      };
      delete req.body.displayPeriod;
    }

    // Transform group to bannerGroup
    if (req.body.group) {
      req.body.bannerGroup = req.body.group;
      delete req.body.group;
    }

    const layout = await layoutService.create(req.body);
    return ApiResponse.success(res, layout, 'Layout created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllLayouts = async (req, res, next) => {
  try {
    const { type, position, language, isActive } = req.query;
    const query = {};

    if (type) query.type = type;
    if (position) query.position = position;
    if (language) query.language = language;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const layouts = await layoutService.findAll(query);
    return ApiResponse.success(res, layouts);
  } catch (error) {
    next(error);
  }
};

exports.getLayoutById = async (req, res, next) => {
  try {
    const layout = await layoutService.findById(req.params.id);
    if (!layout) {
      return ApiResponse.error(res, 'Layout not found', 404);
    }
    return ApiResponse.success(res, layout);
  } catch (error) {
    next(error);
  }
};

exports.updateLayout = async (req, res, next) => {
  try {
    // Transform displayPeriod to display object
    if (req.body.displayPeriod) {
      req.body.display = {
        ...req.body.display,
        startDate: req.body.displayPeriod.startDate,
        endDate: req.body.displayPeriod.endDate
      };
      delete req.body.displayPeriod;
    }

    // Transform group to bannerGroup
    if (req.body.group) {
      req.body.bannerGroup = req.body.group;
      delete req.body.group;
    }

    const layout = await layoutService.update(req.params.id, req.body);
    if (!layout) {
      return ApiResponse.error(res, 'Layout not found', 404);
    }
    return ApiResponse.success(res, layout);
  } catch (error) {
    next(error);
  }
};

exports.deleteLayout = async (req, res, next) => {
  try {
    const layout = await layoutService.softDelete(req.params.id);
    if (!layout) {
      return ApiResponse.error(res, 'Layout not found', 404);
    }
    return ApiResponse.success(res, null, 'Layout deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.getLayoutsByType = async (req, res, next) => {
  try {
    const { language, isActive } = req.query;
    const layouts = await layoutService.findByType(req.params.type, {
      language,
      isActive: isActive === 'true'
    });
    return ApiResponse.success(res, layouts);
  } catch (error) {
    next(error);
  }
};

exports.getLayoutsByPosition = async (req, res, next) => {
  try {
    const { language, isActive } = req.query;
    const layouts = await layoutService.findByPosition(req.params.position, {
      language,
      isActive: isActive === 'true'
    });
    return ApiResponse.success(res, layouts);
  } catch (error) {
    next(error);
  }
};

exports.updateLayoutOrder = async (req, res, next) => {
  try {
    const layouts = await layoutService.updateOrder(req.body);
    return ApiResponse.success(res, layouts);
  } catch (error) {
    next(error);
  }
};

exports.updateGroupOrder = async (req, res, next) => {
  try {
    const { group, items } = req.body;
    const layouts = await layoutService.updateGroupOrder(group, items);
    return ApiResponse.success(res, layouts);
  } catch (error) {
    next(error);
  }
};

exports.toggleVisibility = async (req, res, next) => {
  try {
    const layout = await layoutService.toggleVisibility(req.params.id);
    if (!layout) {
      return ApiResponse.error(res, 'Layout not found', 404);
    }
    return ApiResponse.success(res, layout);
  } catch (error) {
    next(error);
  }
};

exports.setDisplayPeriod = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const layout = await layoutService.setDisplayPeriod(
      req.params.id,
      startDate,
      endDate
    );
    if (!layout) {
      return ApiResponse.error(res, 'Layout not found', 404);
    }
    return ApiResponse.success(res, layout);
  } catch (error) {
    next(error);
  }
};

exports.getActiveBanners = async (req, res, next) => {
  try {
    const { group, includeMedia = 'true' } = req.query;
    const banners = await layoutService.getActiveBanners(group);
    
    // If includeMedia is true, fetch associated media for video banners
    if (includeMedia === 'true') {
      const MediaService = require('../services/mediaService');
      for (let banner of banners) {
        if (banner.content && banner.content.video && banner.content.video.mediaId) {
          const media = await MediaService.findById(banner.content.video.mediaId);
          if (media) {
            banner.content.video = {
              ...banner.content.video,
              url: media.url,
              duration: media.metadata?.duration,
              width: media.metadata?.width,
              height: media.metadata?.height,
              format: media.metadata?.format,
              poster: banner.content.video.poster || null
            };
          }
        }
      }
    }
    
    return ApiResponse.success(res, banners);
  } catch (error) {
    next(error);
  }
};

exports.getHomepageBanner = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    
    // Get active banner for homepage
    const banners = await layoutService.getActiveBanners('homepage');
    const homepageBanner = banners.find(banner => 
      banner.language === language && 
      banner.content && 
      banner.content.video
    );

    if (!homepageBanner) {
      return ApiResponse.error(res, 'Homepage banner not found', 404);
    }

    // Fetch video media details
    const MediaService = require('../services/mediaService');
    if (homepageBanner.content.video.mediaId) {
      const media = await MediaService.findById(homepageBanner.content.video.mediaId);
      if (media) {
        homepageBanner.content.video = {
          ...homepageBanner.content.video,
          url: media.url,
          duration: media.metadata?.duration,
          width: media.metadata?.width,
          height: media.metadata?.height,
          format: media.metadata?.format,
          poster: homepageBanner.content.video.poster || null
        };
      }
    }

    return ApiResponse.success(res, homepageBanner);
  } catch (error) {
    next(error);
  }
};

exports.getAllBannersRaw = async (req, res, next) => {
  const Layout = require('../models/Layout');
  try {
    const banners = await Layout.find({ type: 'banner' }).lean();
    return res.json({ success: true, message: 'Success', data: banners });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBannersByPosition = async (req, res, next) => {
  try {
    const { language, isActive, group } = req.query;
    const banners = await layoutService.getBannersByPosition(req.params.position, {
      language,
      isActive: isActive === 'true',
      group
    });
    return ApiResponse.success(res, banners);
  } catch (error) {
    next(error);
  }
};
