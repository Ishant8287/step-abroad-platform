const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const Student = require("../models/Student");
const env = require("../config/env");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    throw new HttpError(400, "fullName, email and password are required.");
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new HttpError(400, "Please provide a valid email address.");
  }

  const existing = await Student.findOne({ email });
  if (existing) {
    throw new HttpError(409, "Email already registered.");
  }

  const user = await Student.create({ fullName, email, password, role });

  const token = jwt.sign({ sub: user._id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required.");
  }

  const user = await Student.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Invalid credentials.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new HttpError(401, "Invalid credentials.");
  }

  const token = jwt.sign({ sub: user._id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

module.exports = { register, login, me };
