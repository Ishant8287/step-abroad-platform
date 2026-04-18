const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const documentRoutes = require("./routes/documentRoutes");
const healthRoutes = require("./routes/healthRoutes");
const programRoutes = require("./routes/programRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const universityRoutes = require("./routes/universityRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const sanitizeBody = require("./middleware/sanitize");
const env = require("./config/env");

const app = express();

// Security headers
app.use(helmet());

app.use(cors({
  origin: env.corsOrigin,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

// Sanitize every incoming JSON body to strip HTML/script tags (XSS prevention)
app.use(sanitizeBody);

// Use compact 'combined' log format in production; verbose 'dev' format otherwise
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/documents", documentRoutes);
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "StepAbroad API is running",
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
