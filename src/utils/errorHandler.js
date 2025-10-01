const logger = require('../middlewares/logger');

class ErrorHandler {
  static handle(err, req, res, next) {
    // Log error
    logger.error({
      message: err.message,
      stack: err.stack,
      status: err.status || 500,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      errors: err.errors
    });

    // Send response
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
      errors: err.errors || null
    });
  }
}

module.exports = ErrorHandler;
