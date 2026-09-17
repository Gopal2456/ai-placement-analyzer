require("dotenv").config();

const mongoose = require("mongoose");

const { chunkText } = require("./services/chunk.service");
const {
  createResumeEmbeddings,
} = require("./services/embedding.service");

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const userId = "6a999df25d74ada6b8f7b663";
    const resumeId = "6aa96b8f55fe4fe11aca60f0";

    const resumeText = `
        Gopal Mahajan is a full-stack developer with experience in React.js,
        Next.js, TypeScript, Node.js, Express.js and MongoDB.

        At Codiastic Soft, he worked on Rent-Par, a multi-category rental platform.
        He developed vendor features, Super Admin functionality and role-based access control.

        He also built an AI Social Media Scheduler using React.js, TypeScript,
        Node.js, Express.js, MongoDB, Cloudinary, Google Gemini AI, Cron Jobs and JWT.

        Another project is PlacementAI, an AI-powered resume and job matching platform.
        It uses Next.js, TypeScript, Node.js, Express.js, MongoDB and AI technologies.
        `;

    const chunks = chunkText(
      resumeText,
      500,
      100
    );

    console.log("Total chunks:", chunks.length);

    const embeddings = await createResumeEmbeddings({
      userId,
      resumeId,
      chunks,
    });

    console.log(
      "Stored embeddings:",
      embeddings.length
    );

    console.log(
      "First embedding length:",
      embeddings[0].embedding.length
    );

    console.log(
      "First chunk:",
      embeddings[0].content
    );
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

test();