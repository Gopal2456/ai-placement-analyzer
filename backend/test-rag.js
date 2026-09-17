require("dotenv").config();

const mongoose = require("mongoose");

const {
  generateRAGResponse,
} = require("./services/rag.service");

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const result = await generateRAGResponse({
      question: "What projects did I build using Node.js?",
      userId: "6a999df25d74ada6b8f7b663",
      resumeId: "6aa96b8f55fe4fe11aca60f0",
    });

    console.log("\n=== RAG ANSWER ===");
    console.log(result.answer);

    console.log("\n=== SOURCES ===");

    result.sources.forEach((source, index) => {
      console.log(`\nSource ${index + 1}`);
      console.log("Score:", source.score);
      console.log("Content:", source.content);
    });
  } catch (error) {
    console.error("RAG test failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

test();