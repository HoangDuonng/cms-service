const headerService = require('../../services/layout/headerService');
const ApiResponse = require('../../utils/apiResponse');

exports.getHeader = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const headerData = await headerService.getHeader(language);
    return ApiResponse.success(res, headerData);
  } catch (error) {
    next(error);
  }
};

exports.updateHeader = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const headerData = await headerService.updateHeader(language, req.body);
    return ApiResponse.success(res, headerData, 'Header updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateHeaderLogo = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const { logo } = req.body;
    const headerData = await headerService.updateHeaderLogo(language, logo);
    return ApiResponse.success(res, headerData, 'Logo updated successfully');
  } catch (error) {
    if (error.message === 'Header not found') {
      return ApiResponse.error(res, 'Header not found', 404);
    }
    next(error);
  }
};

exports.updateHeaderNavigation = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const { navigation } = req.body;
    const headerData = await headerService.updateHeaderNavigation(language, navigation);
    return ApiResponse.success(res, headerData, 'Navigation updated successfully');
  } catch (error) {
    if (error.message === 'Header not found') {
      return ApiResponse.error(res, 'Header not found', 404);
    }
    next(error);
  }
};

exports.addNavigationItem = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const { title, href } = req.body;
    const headerData = await headerService.addNavigationItem(language, title, href);
    return ApiResponse.success(res, headerData, 'Navigation item added successfully');
  } catch (error) {
    if (error.message === 'Header not found') {
      return ApiResponse.error(res, 'Header not found', 404);
    }
    next(error);
  }
};

exports.removeNavigationItem = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const { href } = req.params;
    const headerData = await headerService.removeNavigationItem(language, href);
    return ApiResponse.success(res, headerData, 'Navigation item removed successfully');
  } catch (error) {
    if (error.message === 'Header not found') {
      return ApiResponse.error(res, 'Header not found', 404);
    }
    next(error);
  }
};

exports.updateHeaderLanguages = async (req, res, next) => {
  try {
    const { language = 'vi' } = req.query;
    const { languages } = req.body;
    const headerData = await headerService.updateHeaderLanguages(language, languages);
    return ApiResponse.success(res, headerData, 'Languages updated successfully');
  } catch (error) {
    if (error.message === 'Header not found') {
      return ApiResponse.error(res, 'Header not found', 404);
    }
    next(error);
  }
}; 
