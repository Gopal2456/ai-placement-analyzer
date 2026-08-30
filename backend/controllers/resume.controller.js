// const fs = require("fs");

// const Resume = require("../models/Resume");
// const {
//   extractTextFromPDF,
// } = require("../services/pdf.service");

// /* -------------------- Upload Resume -------------------- */

// const uploadResume = async (req, res) => {
//   let uploadedFilePath = null;

//   try {
//     console.log("Resume upload started");

//     /* -------------------- Check File -------------------- */

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload a PDF resume",
//       });
//     }

//     uploadedFilePath = req.file.path;

//     console.log("File received:", req.file.originalname);
//     console.log("File size:", req.file.size);
//     console.log("File path:", req.file.path);

//     /* -------------------- Validate File -------------------- */

//     if (req.file.mimetype !== "application/pdf") {
//       return res.status(400).json({
//         success: false,
//         message: "Only PDF files are allowed",
//       });
//     }

//     if (req.file.size === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Uploaded PDF is empty",
//       });
//     }

//     /* -------------------- Extract PDF Text -------------------- */

//     console.log("Extracting PDF text...");

//     const extractedText = await extractTextFromPDF(
//       req.file.path
//     );

//     console.log("PDF text extracted successfully");

//     if (!extractedText) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Could not extract text from this PDF. Please upload a text-based PDF.",
//       });
//     }

//     /* -------------------- Save Resume -------------------- */

//     console.log("Saving resume to MongoDB...");

//     const resume = await Resume.create({
//       userId: req.user.userId,
//       fileName: req.file.originalname,
//       filePath: req.file.path,
//       fileSize: req.file.size,
//       mimeType: req.file.mimetype,
//       extractedText,
//     });

//     console.log("Resume saved:", resume._id);

//     /* -------------------- Response -------------------- */

//     return res.status(201).json({
//       success: true,
//       message: "Resume uploaded successfully",

//       resume: {
//         id: resume._id,
//         fileName: resume.fileName,
//         fileSize: resume.fileSize,
//         mimeType: resume.mimeType,
//         extractedText: resume.extractedText,
//         skills: resume.skills,
//         createdAt: resume.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Resume upload error:", error);

//     /* -------------------- Delete Uploaded File -------------------- */

//     if (
//       uploadedFilePath &&
//       fs.existsSync(uploadedFilePath)
//     ) {
//       try {
//         fs.unlinkSync(uploadedFilePath);

//         console.log("Uploaded file deleted");
//       } catch (deleteError) {
//         console.error(
//           "Failed to delete uploaded file:",
//           deleteError
//         );
//       }
//     }

//     /* -------------------- Known Errors -------------------- */

//     if (error.message === "PDF processing timed out") {
//       return res.status(408).json({
//         success: false,
//         message:
//           "PDF processing took too long. Please upload a smaller or simpler PDF.",
//       });
//     }

//     if (
//       error.message ===
//       "Uploaded PDF file was not found"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Uploaded PDF file could not be found",
//       });
//     }

//     if (error.message === "Uploaded PDF is empty") {
//       return res.status(400).json({
//         success: false,
//         message: "Uploaded PDF is empty",
//       });
//     }

//     /* -------------------- General Error -------------------- */

//     return res.status(500).json({
//       success: false,
//       message: "Failed to process resume",
//       error: error.message,
//     });
//   }
// };

// /* -------------------- Get User Resumes -------------------- */

// const getResumes = async (req, res) => {
//   try {
//     const resumes = await Resume.find({
//       userId: req.user.userId,
//     })
//       .select("-extractedText")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: resumes.length,
//       resumes,
//     });
//   } catch (error) {
//     console.error("Get resumes error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch resumes",
//     });
//   }
// };

// module.exports = {
//   uploadResume,
//   getResumes,
// };

const fs = require("fs");
const Resume = require("../models/Resume");

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

    const resume = await Resume.create({
      userId: req.user.userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText: "",
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
      .select("-extractedText")
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