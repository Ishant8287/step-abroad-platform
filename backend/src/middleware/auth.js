const jwt = require("jsonwebtoken");

const env = require("../config/env");
const Student = require("../models/Student");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const requireAuth = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Authorization token missing.");
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  // Step 1: verify the token first — throw immediately if invalid/expired
  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new HttpError(401, "Invalid or expired token.");
  }

  // Step 2: look up the user — this is a separate concern from token validity
  const student = await Student.findById(decoded.sub).select("-password -createdAt -updatedAt -__v");
  if (!student) {
    throw new HttpError(401, "Authenticated user no longer exists.");
  }

  req.user = student;
  next();
});

module.exports = {
  requireAuth,
};
