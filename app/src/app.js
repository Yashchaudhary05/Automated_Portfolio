const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Security & middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging (disabled in test to keep output clean)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// ── Routes ──────────────────────────────────────────────

app.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "DevOps Pipeline App is running",
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/info", (_req, res) => {
  res.json({
    app: "devops-pipeline-app",
    version: process.env.APP_VERSION || "1.0.0",
    node: process.version,
    platform: process.platform,
    pid: process.pid,
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

module.exports = app;
