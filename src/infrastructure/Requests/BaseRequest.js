import { validationResult } from 'express-validator';

class BaseRequest {
  constructor() {
  }

  validate(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    // errors.array().forEach((val) => console.log(val.msg));
    // req.flash('oldValue', req.body);
    return res.status(500).json({ messages: req.flash('errors', errors.array()), success: errors.array()});
  }
}

export default BaseRequest;
