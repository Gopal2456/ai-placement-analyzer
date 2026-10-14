const Analysis = require("../models/Analysis");

// GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const analyses = await Analysis.find({ userId })
      .select("overallScore matchScore missingSkills createdAt")
      .lean();

    const scores = analyses
      .map((item) => item.matchScore ?? item.overallScore)
      .filter((score) => typeof score === "number");

    const averageMatchScore = scores.length
      ? Math.round(
          scores.reduce((total, score) => total + score, 0) / scores.length,
        )
      : 0;

    const skillGaps = new Set(
      analyses.flatMap((item) => item.missingSkills || []),
    );

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const jobsAnalyzedThisMonth = analyses.filter(
      (item) => new Date(item.createdAt) >= currentMonth,
    ).length;

    return res.status(200).json({
      success: true,
      stats: {
        averageMatchScore,
        jobsAnalyzed: analyses.length,
        jobsAnalyzedThisMonth,
        skillGaps: skillGaps.size,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

// GET /api/dashboard/latest-analysis
const getLatestAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .populate("jobId", "title company")
      .populate("resumeId", "fileName")
      .lean();

    if (!analysis) {
      return res.status(200).json({
        success: true,
        analysis: null,
        message: "No analysis found yet",
      });
    }

    return res.status(200).json({
      success: true,
      analysis: {
        id: analysis._id,
        resumeId: analysis.resumeId?._id,
        score: analysis.matchScore ?? analysis.overallScore ?? 0,
        jobTitle: analysis.jobId?.title || "Job analysis",
        company: analysis.jobId?.company || "",
        matchedSkills: analysis.matchedSkills || [],
        missingSkills: analysis.missingSkills || [],
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        suggestions: analysis.suggestions || [],
        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error("Latest analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest analysis",
    });
  }
};

// GET /api/dashboard/recent-analyses
const getRecentAnalyses = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 5, 1),
      20,
    );

    const analyses = await Analysis.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("jobId")
      .lean();

    return res.status(200).json({
      success: true,
      count: analyses.length,
      analyses: analyses.map((item) => ({
        id: item._id,
        resumeId: item.resumeId,
        jobTitle: item.jobId?.title || "Job analysis",
        company: item.jobId?.company || "",
        score: item.matchScore ?? item.overallScore ?? 0,
        missingSkills: item.missingSkills || [],
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error("Recent analyses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent analyses",
    });
  }
};

const getDashboardRecommendation = async (req, res) => {
  try {
    const analyses = await Analysis.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("missingSkills suggestions")
      .lean();

    const skillCounts = {};

    for (const analysis of analyses) {
      for (const skill of analysis.missingSkills || []) {
        const normalizedSkill = skill.trim();

        if (normalizedSkill) {
          skillCounts[normalizedSkill] =
            (skillCounts[normalizedSkill] || 0) + 1;
        }
      }
    }

    const prioritySkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, occurrences]) => ({
        skill,
        occurrences,
      }));

    const latestSuggestions =
      analyses.find(
        (analysis) =>
          Array.isArray(analysis.suggestions) &&
          analysis.suggestions.length > 0,
      )?.suggestions || [];

    return res.status(200).json({
      success: true,
      recommendation: {
        message: prioritySkills.length
          ? `Focus on ${prioritySkills
              .slice(0, 2)
              .map((item) => item.skill)
              .join(" and ")} to address recurring skill gaps.`
          : "Analyze more jobs to discover your skill gaps.",
        prioritySkills,
        suggestions: latestSuggestions,
      },
    });
  } catch (error) {
    console.error("Dashboard recommendation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate dashboard recommendations",
    });
  }
};

module.exports = {
  getDashboardStats,
  getLatestAnalysis,
  getRecentAnalyses,
  getDashboardRecommendation,
};
