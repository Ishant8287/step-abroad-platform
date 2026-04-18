const express = require("express");
const documentController = require("../controllers/documentController");
const { requireAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Require authentication for all document routes
router.use(requireAuth);

router
  .route("/")
  .get(documentController.getDocuments)
  .post(upload.single("file"), documentController.uploadDocument);

router
  .route("/:id")
  .delete(documentController.deleteDocument);

module.exports = router;
