
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getDashboardStats,
  getLatestAnalysis,
  getRecentAnalyses,
  getDashboardRecommendation,
} = require("../controllers/dashboard.controller");

router.get("/stats", auth, getDashboardStats);
router.get("/latest-analysis", auth, getLatestAnalysis);
router.get("/recent-analyses", auth, getRecentAnalyses);
router.get("/recommendation", auth, getDashboardRecommendation);

module.exports = router;
