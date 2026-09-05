const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "Fresher",
    },
    role: {
      type: String,
      default: "Not specified",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", resumeSchema);
