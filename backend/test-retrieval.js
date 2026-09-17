require("dotenv").config();

const mongoose = require("mongoose");

const {
  searchSimilarChunks,
} = require("./services/retrieval.service");

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const results = await searchSimilarChunks({
      query: "What projects did I build using Node.js?",
      userId: "6a999df25d74ada6b8f7b663",
      resumeId: "6aa96b8f55fe4fe11aca60f0",
      limit: 3,
    });

    console.log("\nSearch results:", results.length);

    results.forEach((result, index) => {
      console.log(`\n--- Result ${index + 1} ---`);
      console.log("Score:", result.score);
      console.log("Content:", result.content);
    });
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

test();