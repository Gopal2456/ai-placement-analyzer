const fs = require("fs");
const Resume = require("../models/Resume");
const { extractTextFromPDF } = require("../services/pdf.service");
const { extractResumeDataWithAI } = require("../services/ai.service");
const { chunkText } = require("../services/chunk.service");
const { createResumeEmbeddings } = require("../services/embedding.service");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    // 1. Extract text from PDF
    const extractedText = await extractTextFromPDF(req.file.path);

    // 2. Extract structured resume data using AI
    const resumeData = await extractResumeDataWithAI(extractedText);

    // 3. Save resume to MongoDB
    const resume = await Resume.create({
      userId: req.user.userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: "application/pdf",
      extractedText,
      skills: resumeData.skills,
      experience: resumeData.experience || "Fresher",
      role: resumeData.role || "Not specified",
    });

    // 4. Split resume text into chunks
    const chunks = chunkText(extractedText);

    console.log(`Resume split into ${chunks.length} chunks`);

    // 5. Generate and store embeddings
    await createResumeEmbeddings({
      userId: req.user.userId,
      resumeId: resume._id,
      chunks,
    });

    // 6. Return response
    return res.status(201).json({
      success: true,
      message: "Resume uploaded and indexed successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        mimeType: resume.mimeType,
        skills: resume.skills,
        experience: resume.experience,
        role: resume.role,
        createdAt: resume.createdAt,
      },
      rag: {
        indexed: true,
        chunks: chunks.length,
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

const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.userId,
    }).select("-filePath");

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get resume by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
};
