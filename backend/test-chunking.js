const { chunkText } = require("./services/chunk.service");

const sampleText = `
Gopal Mahajan is a full-stack developer with experience in React.js,
Next.js, TypeScript, Node.js, Express.js and MongoDB.

At Codiastic Soft, he worked on Rent-Par, a multi-category rental platform.
He developed vendor features, Super Admin functionality and role-based access control.

He also built an AI Social Media Scheduler using React.js, TypeScript,
Node.js, Express.js, MongoDB, Cloudinary, Google Gemini AI, Cron Jobs and JWT.

Another project is PlacementAI, an AI-powered resume and job matching platform.
`;

const chunks = chunkText(sampleText, 200, 40);

console.log("Total chunks:", chunks.length);

chunks.forEach((chunk, index) => {
  console.log(`\n--- Chunk ${index + 1} ---`);
  console.log(chunk);
});