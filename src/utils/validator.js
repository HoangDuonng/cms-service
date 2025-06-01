const ApiResponse = require('./apiResponse');

class Validator {
  static validate(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
        return ApiResponse.validationError(res, errors);
      }

      next();
    };
  }

  static validateQuery(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
        return ApiResponse.validationError(res, errors);
      }

      next();
    };
  }

  static validateParams(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
        return ApiResponse.validationError(res, errors);
      }

      next();
    };
  }
}

module.exports = Validator; 
