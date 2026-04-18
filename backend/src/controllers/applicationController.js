const mongoose = require("mongoose");
const Application = require("../models/Application");
const Program = require("../models/Program");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const { validStatusTransitions } = require("../config/constants");
const cacheService = require("../services/cacheService");
const emailService = require("../services/emailService");

const listApplications = asyncHandler(async (req, res) => {
  const { studentId, status, page = 1, limit = 20 } = req.query;
  const filters = {};

  if (req.user.role === "student") {
    // Students can only see their own applications — ignore any studentId param
    filters.student = req.user._id;
  } else if (studentId) {
    // Admins and counselors can optionally filter by a specific student
    filters.student = studentId;
  }
  // Admins with no studentId filter see all applications

  if (status) {
    filters.status = status;
  }

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 50);

  const [applications, total] = await Promise.all([
    Application.find(filters)
      .populate("student", "fullName email role")
      .populate("program", "title degreeLevel tuitionFeeUsd")
      .populate("university", "name country city")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Application.countDocuments(filters),
  ]);

  res.json({
    success: true,
    data: applications,
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

const createApplication = asyncHandler(async (req, res) => {
  const { programId, intake } = req.body;

  if (!programId || !intake) {
    throw new HttpError(400, "programId and intake are required.");
  }

  if (!mongoose.isValidObjectId(programId)) {
    throw new HttpError(400, "Invalid programId.");
  }

  const program = await Program.findById(programId);
  if (!program) {
    throw new HttpError(404, "Program not found.");
  }

  const duplicate = await Application.findOne({
    student: req.user._id,
    program: programId,
    intake,
  });

  if (duplicate) {
    throw new HttpError(
      409,
      "You have already applied to this program for this intake.",
    );
  }

  const application = await Application.create({
    student: req.user._id,
    program: programId,
    university: program.university,
    destinationCountry: program.country,
    intake,
    status: "draft",
    timeline: [{ status: "draft", note: "Application created." }],
  });

  // Invalidate dashboard cache since application count has changed
  await cacheService.delete("dashboard-overview");

  res.status(201).json({
    success: true,
    data: application,
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  if (!status) {
    throw new HttpError(400, "status is required.");
  }

  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, "Invalid application id.");
  }

  // There is no counselor-to-application assignment model yet, so deny counselor writes by default.
  if (req.user.role === "counselor") {
    throw new HttpError(
      403,
      "Counselors are not authorised to update applications without explicit assignment.",
    );
  }

  const application = await Application.findById(id);
  if (!application) {
    throw new HttpError(404, "Application not found.");
  }

  // Ownership check: students may only update their own applications (admins bypass)
  if (
    req.user.role === "student" &&
    application.student.toString() !== req.user._id.toString()
  ) {
    throw new HttpError(403, "You are not authorised to update this application.");
  }

  // Students can only advance the application to "submitted"
  if (req.user.role === "student" && status !== "submitted") {
    throw new HttpError(403, "Students can only submit applications.");
  }

  const allowedTransitions = validStatusTransitions[application.status];
  if (!allowedTransitions.includes(status)) {
    throw new HttpError(
      400,
      `Invalid transition: ${application.status} → ${status}. Allowed: ${allowedTransitions.join(", ") || "none"}`,
    );
  }

  const oldStatus = application.status;

  application.status = status;
  application.timeline.push({
    status,
    note: note || `Status updated to ${status}.`,
  });

  await application.save();

  // Invalidate dashboard cache since status breakdown has changed
  await cacheService.delete("dashboard-overview");

  // Fire-and-forget email notification
  Application.findById(application._id)
    .populate("student", "fullName email")
    .populate("program", "title")
    .lean()
    .then((populated) => {
      if (populated?.student?.email) {
        emailService.sendStatusChangeEmail(
          populated.student.email,
          populated.student.fullName,
          populated.program?.title || "your program",
          oldStatus,
          status,
        );
      }
    })
    .catch((err) => console.error("[email-notify] populate failed:", err.message));

  res.json({
    success: true,
    data: application,
  });
});

module.exports = {
  createApplication,
  listApplications,
  updateApplicationStatus,
};
