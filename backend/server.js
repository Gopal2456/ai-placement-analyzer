const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const jobRoutes = require("./routes/job.routes");
const analysisRoutes = require("./routes/analysis.routes");
const interviewRoutes = require("./routes/interview.routes");

const app = express();

const PORT = process.env.PORT || 5000;

/* -------------------- Middleware -------------------- */

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- Health Check -------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Placement Analyzer API is running",
  });
});

/* -------------------- Routes -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/analysis", analysisRoutes);

/* -------------------- 404 -------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* -------------------- Error Handler -------------------- */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* -------------------- Database -------------------- */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully ");

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.timeout = 30000;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();
