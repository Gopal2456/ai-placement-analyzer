const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const Job = require("../models/Job");

const {
  generateInterviewQuestionsWithAI,
} = require("../services/ai.service");

const generateInterview = async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;

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

    let job = null;

    if (jobId) {
      job = await Job.findOne({
        _id: jobId,
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }
    }

    const questions = await generateInterviewQuestionsWithAI({
      resumeText: resume.extractedText,
      jobDescription: job?.description || "",
    });

    const interview = await Interview.create({
      userId: req.user.userId,
      resumeId,
      jobId: jobId || null,
      questions,
    });

    return res.status(201).json({
      success: true,
      message: "Interview questions generated successfully",
      interview,
    });
  } catch (error) {
    console.error("Generate interview error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate interview questions",
    });
  }
};

module.exports = {
  generateInterview,
};