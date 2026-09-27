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

    questionType: {
      type: String,
      enum: [
        "all",
        "technical",
        "behavioral",
        "resume",
        "skill-gaps",
      ],
      default: "all",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "mixed"],
      default: "mixed",
    },

    questionCount: {
      type: Number,
      enum: [5, 10, 15, 20],
      default: 10,
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

        score: {
          type: Number,
          default: null,
          min: 0,
          max: 10,
        },

        feedback: {
          type: String,
          default: "",
        },

        strengths: {
          type: [String],
          default: [],
        },

        improvements: {
          type: [String],
          default: [],
        },

        betterAnswer: {
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