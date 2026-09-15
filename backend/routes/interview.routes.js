const express = require("express");

const router = express.Router();

const {
  generateInterview,
} = require("../controllers/interview.controller");

const auth = require("../middleware/auth");

router.post("/generate", auth, generateInterview);

module.exports = router;