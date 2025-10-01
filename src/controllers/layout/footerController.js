const footerService = require('../../services/layout/footerService');
const ApiResponse = require('../../utils/apiResponse');

exports.getFooter = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const footerData = await footerService.getFooter(language);
    return ApiResponse.success(res, footerData);
  } catch (error) {
    next(error);
  }
};

exports.updateFooter = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const footerData = await footerService.updateFooter(language, req.body);
    return ApiResponse.success(res, footerData, 'Footer updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteFooter = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const deleted = await footerService.deleteFooter(language);
    if (deleted) {
      return ApiResponse.success(res, null, 'Footer deleted successfully');
    } else {
      return ApiResponse.error(res, 'Footer not found', 404);
    }
  } catch (error) {
    next(error);
  }
}; 
