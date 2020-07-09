import { validationResult } from 'express-validator/check';

class BaseRequest {
  static validate(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    req.flash('oldValue', req.body);
    req.flash('errors', errors.array());

    return res.redirectBack();
  }
}

export default BaseRequest;
