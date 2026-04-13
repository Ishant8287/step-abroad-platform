const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const Student = require("../models/Student");
const env = require("../config/env");

//Register controller
const register = asyncHandler(async (req, res, next) => {
  //Get data from body
  const { fullName, email, password, role } = req.body;

  //If any of the field is missing
  if (!fullName || !email || !password) {
    throw new HttpError(400, "fullName, email and password are required.");
  }

  //If student exists-> check using email
  const existing = await Student.findOne({ email });
  if (existing) {
    throw new HttpError(409, "Email already registered.");
  }

  //IF not exists then create one
  const user = await Student.create({ fullName, email, password, role });

  //generating token using payload and secret key
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

//Login controller
const login = asyncHandler(async (req, res, next) => {
  //Extract email and pass from body
  const { email, password } = req.body;

  //If any field is missing
  if (!email || !password) {
    throw new HttpError(400, "Email and password are required.");
  }

  //Find user with email
  const user = await Student.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Invalid credentials.");
  }

  //Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new HttpError(401, "Invalid credentials.");
  }

  //Generate token
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

//get/me controller
const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

module.exports = { register, login, me };
