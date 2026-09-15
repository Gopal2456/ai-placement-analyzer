const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          enum: ["technical", "behavioral", "project", "general"],
          required: true,
        },

        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);