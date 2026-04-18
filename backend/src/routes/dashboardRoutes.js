const express = require("express");

const { getOverview } = require("../controllers/dashboardController");
const { requireAuth } = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.get("/overview", requireAuth, requireRole("admin", "counselor"), getOverview);

module.exports = router;
