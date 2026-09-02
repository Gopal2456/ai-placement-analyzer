const express = require("express");

const {
  uploadResume,
  getResumes,
} = require("../controllers/resume.controller");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

/* -------------------- Upload Resume -------------------- */

router.post(
  "/upload",
  auth,
  (req, res, next) => {
    upload.single("resume")(req, res, (error) => {
      if (error) {
        console.error("Multer error:", error);

        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            message:
              "Resume file is too large. Maximum size is 5 MB.",
          });
        }

        if (
          error.message ===
          "Only PDF files are allowed"
        ) {
          return res.status(400).json({
            success: false,
            message: "Only PDF files are allowed",
          });
        }

        return res.status(400).json({
          success: false,
          message:
            error.message || "Failed to upload file",
        });
      }

      next();
    });
  },
  uploadResume
);

/* -------------------- Get Resumes -------------------- */

router.get("/", auth, getResumes);

module.exports = router;