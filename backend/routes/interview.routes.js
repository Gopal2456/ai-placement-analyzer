const express = require("express");

const router = express.Router();

const {
  generateInterview,
  submitInterviewAnswers,
  getInterview,
  getInterviews,
} = require("../controllers/interview.controller");

const auth = require("../middleware/auth");

router.post("/generate", auth, generateInterview);
router.post("/:interviewId/answers", auth, submitInterviewAnswers);
router.get("/", auth, getInterviews);
router.get("/:interviewId", auth, getInterview);

module.exports = router;
