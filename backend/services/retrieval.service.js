const mongoose = require("mongoose");
const Embedding = require("../models/Embedding");
const { generateEmbedding } = require("./embedding.service");

const searchSimilarChunks = async ({ query, userId, resumeId, limit = 5 }) => {
  try {
    if (!query || !query.trim()) {
      throw new Error("Query is required");
    }

    if (!userId) {
      throw new Error("userId is required");
    }

    if (!resumeId) {
      throw new Error("resumeId is required");
    }

    // Convert the user's query into a vector.
    const queryEmbedding = await generateEmbedding(query);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const resumeObjectId = new mongoose.Types.ObjectId(resumeId);

    // Search MongoDB for semantically similar chunks.
    const results = await Embedding.aggregate([
      {
        $vectorSearch: {
          index: "embedding_vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit,
          filter: {
            userId: userObjectId,
            resumeId: resumeObjectId,
          },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          metadata: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    return results;
  } catch (error) {
    console.error("Semantic search error:", error);
    throw error;
  }
};

module.exports = {
  searchSimilarChunks,
};
