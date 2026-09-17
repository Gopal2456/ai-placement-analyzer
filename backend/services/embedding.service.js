const { pipeline } = require("@xenova/transformers");

const Embedding = require("../models/Embedding");

let embedder = null;

const getEmbedder = async () => {
  if (!embedder) {
    console.log("Loading embedding model...");

    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log("Embedding model loaded");
  }

  return embedder;
};

const generateEmbedding = async (text) => {
  try {
    if (!text || !text.trim()) {
      throw new Error("Text is required to generate embedding");
    }

    const model = await getEmbedder();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  } catch (error) {
    console.error("Embedding generation error:", error);
    throw error;
  }
};

const createResumeEmbeddings = async ({
  userId,
  resumeId,
  chunks,
}) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    if (!resumeId) {
      throw new Error("resumeId is required");
    }

    if (!Array.isArray(chunks) || chunks.length === 0) {
      throw new Error("Chunks are required");
    }

    console.log(
      `Creating embeddings for ${chunks.length} chunks...`
    );

    // Remove existing embeddings for this resume.
    await Embedding.deleteMany({
      userId,
      resumeId,
    });

    const embeddingDocuments = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      console.log(
        `Generating embedding ${i + 1}/${chunks.length}`
      );

      const embedding = await generateEmbedding(chunk);

      embeddingDocuments.push({
        userId,
        resumeId,
        content: chunk,
        embedding,
        metadata: {
          chunkIndex: i,
          source: "resume",
        },
      });
    }

    const savedEmbeddings = await Embedding.insertMany(
      embeddingDocuments
    );

    console.log(
      `Successfully stored ${savedEmbeddings.length} embeddings`
    );

    return savedEmbeddings;
  } catch (error) {
    console.error(
      "Resume embedding creation error:",
      error
    );

    throw error;
  }
};

module.exports = {
  generateEmbedding,
  createResumeEmbeddings,
};