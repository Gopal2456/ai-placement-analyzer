const Resume = require("../models/Resume");
const Job = require("../models/Job");
const Analysis = require("../models/Analysis");

const { analyzeJobMatchWithAI } = require("../services/ai.service");
const { analyzeResumeWithAI } = require("../services/ai.service");
const { calculateMatchScore } = require("../services/scoring.service");

const createAnalysis = async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;

    if (!resumeId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobId are required",
      });
    }

    // ----------------------------------
    // Get resume
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
    // Get job
    // ----------------------------------

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ----------------------------------
    // Resume skills
    // ----------------------------------

    const resumeSkills = resume.skills || [];

    // ----------------------------------
    // Job skills
    // ----------------------------------

    const jobSkills = job.skills || [];

    if (!jobSkills.length) {
      return res.status(400).json({
        success: false,
        message:
          "This job does not have any extracted skills. Please update the job description first.",
      });
    }

    // ----------------------------------
    // Calculate deterministic score
    // ----------------------------------

    const { matchScore, matchedSkills, missingSkills } = calculateMatchScore(
      resumeSkills,
      jobSkills,
    );

    console.log("================================");
    console.log("RESUME JOB ANALYSIS");
    console.log("================================");
    console.log("Resume:", resumeId);
    console.log("Job:", jobId);
    console.log("Resume skills:", resumeSkills);
    console.log("Job skills:", jobSkills);
    console.log("Matched:", matchedSkills);
    console.log("Missing:", missingSkills);
    console.log("Match score:", matchScore);
    console.log("================================");

    // ----------------------------------
    // AI explanation
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
    // Save analysis
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

// const createAnalysis = async (req, res) => {
//   try {
//     const { resumeId } = req.body;

//     if (!resumeId) {
//       return res.status(400).json({
//         success: false,
//         message: "resumeId is required",
//       });
//     }

//     const resume = await Resume.findOne({
//       _id: resumeId,
//       userId: req.user.userId,
//     });

//     if (!resume) {
//       return res.status(404).json({
//         success: false,
//         message: "Resume not found",
//       });
//     }

//     if (!resume.extractedText) {
//       return res.status(400).json({
//         success: false,
//         message: "Resume text has not been extracted",
//       });
//     }

//     console.log("Starting resume analysis...");
//     console.log("Resume:", resume.fileName);

//     const analysisResult = await analyzeResumeWithAI(
//       resume.extractedText,
//       resume.skills,
//     );

//     console.log("AI analysis completed");

//     const analysis = await Analysis.create({
//       userId: req.user.userId,
//       resumeId: resume._id,
//       overallScore: analysisResult.overallScore,
//       skillsScore: analysisResult.skillsScore,
//       experienceScore: analysisResult.experienceScore,
//       projectsScore: analysisResult.projectsScore,
//       educationScore: analysisResult.educationScore,
//       strengths: analysisResult.strengths,
//       weaknesses: analysisResult.weaknesses,
//       suggestions: analysisResult.suggestions,
//       missingSkills: analysisResult.missingSkills,
//       summary: analysisResult.summary,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Resume analyzed successfully",
//       analysis,
//     });
//   } catch (error) {
//     console.error("Resume analysis error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to analyze resume",
//       error: error.message,
//     });
//   }
// };

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
