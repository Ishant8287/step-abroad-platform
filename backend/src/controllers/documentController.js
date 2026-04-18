const Document = require("../models/Document");
const uploadService = require("../services/uploadService");
const HttpError = require("../utils/httpError");
const asyncHandler = require("../utils/asyncHandler");

exports.uploadDocument = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new HttpError(400, "No file uploaded."));
  }

  const { application, student, docType } = req.body;

  if (!application || !student || !docType) {
    return next(new HttpError(400, "application, student, and docType are required fields."));
  }

  const validDocTypes = ["sop", "transcript", "passport", "english-test", "other"];
  if (!validDocTypes.includes(docType)) {
    return next(new HttpError(400, `Invalid docType. Allowed values: ${validDocTypes.join(", ")}`));
  }

  // Check for existing document of this type for this application
  const existingDoc = await Document.findOne({ application, docType });
  if (existingDoc && docType !== "other") {
    // We allow multiple 'other' documents, but only one of each specific type
    return next(new HttpError(400, `A document of type '${docType}' already exists for this application.`));
  }

  const { originalname, buffer, size } = req.file;

  // Upload to Cloudinary
  const result = await uploadService.uploadToCloudinary(buffer, originalname, "study-abroad/documents");

  // Create document record
  const document = await Document.create({
    application,
    student,
    docType,
    originalName: originalname,
    cloudinaryUrl: result.url,
    cloudinaryPublicId: result.publicId,
    sizeBytes: size,
  });

  res.status(201).json({
    status: "success",
    data: {
      document,
    },
  });
});

exports.getDocuments = asyncHandler(async (req, res, next) => {
  const { application, student, docType } = req.query;

  const filter = {};
  if (application) filter.application = application;
  if (student) filter.student = student;
  if (docType) filter.docType = docType;

  const documents = await Document.find(filter).sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: documents.length,
    data: {
      documents,
    },
  });
});

exports.deleteDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(new HttpError(404, "No document found with that ID"));
  }

  // Delete from Cloudinary
  await uploadService.deleteFromCloudinary(document.cloudinaryPublicId);

  // Delete from Database
  await document.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
