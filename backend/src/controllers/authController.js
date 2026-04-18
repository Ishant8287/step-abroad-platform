const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const Student = require("../models/Student");
const RefreshToken = require("../models/RefreshToken");
const env = require("../config/env");
const cacheService = require("../services/cacheService");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateAccessToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

/**
 * Create a cryptographically random refresh token, hash it, persist it, and
 * return the plain-text version for the client.
 */
async function generateRefreshToken(userId) {
  const plainToken = crypto.randomBytes(40).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(plainToken)
    .digest("hex");

  // Parse the human-readable expiry (e.g. "7d") into milliseconds
  const daysMatch = env.refreshTokenExpiresIn.match(/^(\d+)d$/);
  const expiresInMs = daysMatch
    ? Number(daysMatch[1]) * 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000; // fallback 7 days

  await RefreshToken.create({
    token: hashedToken,
    user: userId,
    expiresAt: new Date(Date.now() + expiresInMs),
  });

  return plainToken;
}

function buildUserPayload(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    throw new HttpError(400, "fullName, email and password are required.");
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new HttpError(400, "Please provide a valid email address.");
  }

  // Prevent self-registration as admin
  if (role === "admin") {
    throw new HttpError(403, "Admin accounts cannot be created via registration.");
  }

  const existing = await Student.findOne({ email });
  if (existing) {
    throw new HttpError(409, "Email already registered.");
  }

  const user = await Student.create({ fullName, email, password, role });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      token: accessToken,
      refreshToken,
      user: buildUserPayload(user),
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

  const accessToken = generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);

  res.json({
    success: true,
    data: {
      token: accessToken,
      refreshToken,
      user: buildUserPayload(user),
    },
  });
});

const me = asyncHandler(async (req, res) => {
  const user = req.user.toObject ? req.user.toObject() : req.user;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;

  res.json({
    success: true,
    data: user,
  });
});

// ---------------------------------------------------------------------------
// Refresh Token
// ---------------------------------------------------------------------------

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken: plainToken } = req.body;

  if (!plainToken) {
    throw new HttpError(400, "refreshToken is required.");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(plainToken)
    .digest("hex");

  const stored = await RefreshToken.findOne({ token: hashedToken });
  if (!stored) {
    throw new HttpError(401, "Invalid or expired refresh token.");
  }

  if (stored.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ _id: stored._id });
    throw new HttpError(401, "Refresh token has expired.");
  }

  // Token rotation: delete old, issue new pair
  await RefreshToken.deleteOne({ _id: stored._id });

  const user = await Student.findById(stored.user).select("-password");
  if (!user) {
    throw new HttpError(401, "User no longer exists.");
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = await generateRefreshToken(user._id);

  res.json({
    success: true,
    data: {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      user: buildUserPayload(user),
    },
  });
});

// ---------------------------------------------------------------------------
// Logout — invalidate the refresh token
// ---------------------------------------------------------------------------

const logout = asyncHandler(async (req, res) => {
  const { refreshToken: plainToken } = req.body;

  if (plainToken) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");

    await RefreshToken.deleteOne({ token: hashedToken });
  }

  res.json({ success: true, message: "Logged out." });
});

// ---------------------------------------------------------------------------
// Profile Update
// ---------------------------------------------------------------------------

const ALLOWED_PROFILE_FIELDS = [
  "fullName",
  "targetCountries",
  "interestedFields",
  "preferredIntake",
  "maxBudgetUsd",
  "englishTest",
];

const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};

  for (const field of ALLOWED_PROFILE_FIELDS) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, "No valid fields to update.");
  }

  const user = await Student.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  // Auto-mark profile as complete when key fields are filled
  const isComplete =
    user.fullName &&
    user.targetCountries?.length > 0 &&
    user.interestedFields?.length > 0 &&
    user.preferredIntake &&
    user.maxBudgetUsd != null;

  if (isComplete && !user.profileComplete) {
    user.profileComplete = true;
    await user.save();
  }

  // Invalidate recommendation cache so fresh ones are fetched
  await cacheService.delete(`recommendations-${req.user._id}-pinecone`);
  await cacheService.delete(`recommendations-${req.user._id}-fallback`);

  res.json({
    success: true,
    data: user,
  });
});

module.exports = { register, login, me, refresh, logout, updateProfile };
