const Resume = require("../models/Resume");
const Job = require("../models/Job");
const Analysis = require("../models/Analysis");

const { analyzeJobMatchWithAI, extractJobSkillsWithAI } = require("../services/ai.service");
const { calculateMatchScore } = require("../services/scoring.service");

const createAnalysis = async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;

    // ----------------------------------
    // Validate IDs
    // ----------------------------------

    if (!resumeId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobId are required",
      });
    }

    // ----------------------------------
    // Get Resume
    // ----------------------------------

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

    // ----------------------------------
    // Get Job
    // ----------------------------------

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ----------------------------------
    // Get Skills
    // ----------------------------------

    const resumeSkills = resume.skills || [];
    let jobSkills = job.skills || [];

    if (!resumeSkills.length) {
      return res.status(400).json({
        success: false,
        message: "No skills found in resume",
      });
    }

    if (!jobSkills.length) {
      jobSkills = await extractJobSkillsWithAI(job.description || "");

      if (jobSkills.length) {
        job.skills = jobSkills;
        await job.save();
      }
    }

    if (!jobSkills.length) {
      return res.status(400).json({
        success: false,
        message:
          "This job does not have any extracted skills. Please update the job description first.",
      });
    }

    // ----------------------------------
    // Calculate Match Score
    // ----------------------------------

    const {
      matchScore,
      matchedSkills,
      missingSkills,
    } = calculateMatchScore(
      resumeSkills,
      jobSkills
    );

    console.log("Resume Skills:", resumeSkills);
    console.log("Job Skills:", jobSkills);
    console.log("Match Score:", matchScore);
    console.log("Matched Skills:", matchedSkills);
    console.log("Missing Skills:", missingSkills);

    // ----------------------------------
    // AI Explanation
    // ----------------------------------

    const aiResult = await analyzeJobMatchWithAI({
      resumeText: resume.extractedText || "",
      jobTitle: job.title,
      company: job.company,
      jobDescription: job.description,
      matchScore,
      matchedSkills,
      missingSkills,
    });

    // ----------------------------------
    // Save Analysis
    // ----------------------------------

    const analysis = await Analysis.create({
      userId: req.user.userId,
      resumeId,
      jobId,

      matchScore,
      matchedSkills,
      missingSkills,

      strengths: aiResult.strengths || [],
      weaknesses: aiResult.weaknesses || [],
      recommendations: aiResult.recommendations || [],
      summary: aiResult.summary || "",
    });

    // ----------------------------------
    // Response
    // ----------------------------------

    return res.status(201).json({
      success: true,
      message: "Resume analyzed against job successfully",

      analysis: {
        id: analysis._id,
        resumeId: analysis.resumeId,
        jobId: analysis.jobId,

        matchScore: analysis.matchScore,

        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,

        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
        summary: analysis.summary,

        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error("Create analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume against job",
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
