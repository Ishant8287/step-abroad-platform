const HttpError = require("../utils/httpError");
function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, "Insufficient permissions."));
    }
    next();
  };
}

module.exports = requireRole;
