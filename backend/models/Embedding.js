const mongoose = require("mongoose");

const embeddingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    metadata: {
      chunkIndex: {
        type: Number,
        required: true,
      },

      source: {
        type: String,
        default: "resume",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Embedding", embeddingSchema);