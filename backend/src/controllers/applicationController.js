const Application = require("../models/Application");
const Program = require("../models/Program");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");
const { validStatusTransitions } = require("../config/constants");

const listApplications = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query;
  const filters = {};

  if (studentId) {
    filters.student = studentId;
  }

  if (status) {
    filters.status = status;
  }

  const applications = await Application.find(filters)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFeeUsd")
    .populate("university", "name country city")
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: applications,
  });
});

const createApplication = asyncHandler(async (req, res, next) => {
  //extract program Id and intake from body
  const { programId, intake } = req.body;

  //If any required field is missing
  if (!programId || !intake) {
    throw new HttpError(400, "programId and intake are required.");
  }

  //Create program
  const program = await Program.findById(programId);
  if (!program) {
    throw new HttpError(404, "Program not found.");
  }

  // prevent duplicate application
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

  //create application
  const application = await Application.create({
    student: req.user._id,
    program: programId,
    university: program.university,
    destinationCountry: program.country,
    intake,
    status: "draft",
    timeline: [{ status: "draft", note: "Application created." }],
  });

  res.status(201).json({
    success: true,
    data: application,
  });
});

//Update controller
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  if (!status) {
    throw new HttpError(400, "status is required.");
  }

  //Find app by id
  const application = await Application.findById(id);
  if (!application) {
    throw new HttpError(404, "Application not found.");
  }

  // check valid transition
  const allowedTransitions = validStatusTransitions[application.status];
  if (!allowedTransitions.includes(status)) {
    throw new HttpError(
      400,
      `Invalid transition: ${application.status} → ${status}. Allowed: ${allowedTransitions.join(", ") || "none"}`,
    );
  }

  application.status = status;
  application.timeline.push({
    status,
    note: note || `Status updated to ${status}.`,
  });

  await application.save();

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
