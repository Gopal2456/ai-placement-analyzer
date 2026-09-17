const { generateEmbedding } = require("./services/embedding.service");

const test = async () => {
  try {
    const text =
      "I am a full-stack developer with experience in React, Next.js, Node.js and MongoDB.";

    const embedding = await generateEmbedding(text);

    console.log("Embedding generated successfully");
    console.log("Vector length:", embedding.length);
    console.log("First 10 values:", embedding.slice(0, 10));
  } catch (error) {
    console.error("Test failed:", error);
  }
};

test();