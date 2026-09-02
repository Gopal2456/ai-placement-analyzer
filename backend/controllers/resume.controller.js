const fs = require("fs");
const Resume = require("../models/Resume");
const { extractTextFromPDF } = require("../services/pdf.service");
// const { extractSkills } = require("../services/skill.service");
const { extractSkillsWithAI } = require("../services/ai.service");

const uploadResume = async (req, res) => {
  try {
    console.log("================================");
    console.log("UPLOAD REQUEST RECEIVED");
    console.log("================================");

    console.log("User:", req.user);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    console.log("Extracting PDF text...");

    const extractedText = await extractTextFromPDF(req.file.path);

    console.log("PDF extraction completed");

    const skills = await extractSkillsWithAI(extractedText);

    console.log("Skills found:", skills);

    const resume = await Resume.create({
      userId: req.user.userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: "application/pdf",
      extractedText,
      skills,
    });

    console.log("Resume saved:", resume._id);

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        mimeType: resume.mimeType,
        skills: resume.skills,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("UPLOAD ERROR:");
    console.error(error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
      error: error.message,
    });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user.userId,
    })
      .select("-extractedText -filePath")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

module.exports = {
  uploadResume,
  getResumes,
};
