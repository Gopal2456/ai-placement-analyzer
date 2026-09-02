const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createAnalysis,
  getAnalysis,
} = require("../controllers/analysis.controller");

router.post("/", auth, createAnalysis);
router.get("/:resumeId", auth, getAnalysis);

module.exports = router;