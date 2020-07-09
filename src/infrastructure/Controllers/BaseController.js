class BaseController {
  callMethod(method) {
    return this[method].bind(this);
  }
}

export default BaseController;
