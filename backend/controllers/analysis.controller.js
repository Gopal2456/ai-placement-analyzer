const Resume = require("../models/Resume");
const Analysis = require("../models/Analysis");

const { analyzeResumeWithAI } = require("../services/ai.service");

const createAnalysis = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId is required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (!resume.extractedText) {
      return res.status(400).json({
        success: false,
        message: "Resume text has not been extracted",
      });
    }

    console.log("Starting resume analysis...");
    console.log("Resume:", resume.fileName);

    const analysisResult = await analyzeResumeWithAI(
      resume.extractedText,
      resume.skills,
    );

    console.log("AI analysis completed");

    const analysis = await Analysis.create({
      userId: req.user.userId,
      resumeId: resume._id,
      overallScore: analysisResult.overallScore,
      skillsScore: analysisResult.skillsScore,
      experienceScore: analysisResult.experienceScore,
      projectsScore: analysisResult.projectsScore,
      educationScore: analysisResult.educationScore,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      suggestions: analysisResult.suggestions,
      missingSkills: analysisResult.missingSkills,
      summary: analysisResult.summary,
    });

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message,
    });
  }
};

const getAnalysis = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const analysis = await Analysis.findOne({
      resumeId,
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found for this resume",
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume analysis",
      error: error.message,
    });
  }
};

module.exports = {
  createAnalysis,
  getAnalysis,
};
