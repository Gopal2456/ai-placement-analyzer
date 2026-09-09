const express = require("express");

const {
  createJob,
  getJobs,
  importJobs,
} = require("../controllers/job.controller");

const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createJob);
router.get("/", auth, getJobs);
router.get("/import", auth, importJobs);

module.exports = router;