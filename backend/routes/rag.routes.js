const express = require("express");

const router = express.Router();

const {
  askResumeAssistant,
} = require("../controllers/rag.controller");

const auth = require("../middleware/auth");

router.post("/ask", auth, askResumeAssistant);

module.exports = router;