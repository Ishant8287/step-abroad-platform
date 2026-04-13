const express = require("express");

const {
  listPopularUniversities,
  listUniversities,
} = require("../controllers/universityController");

const router = express.Router();

// so that GET /popular is not matched as an ID.
router.get("/popular", listPopularUniversities);
router.get("/", listUniversities);

module.exports = router;
