const { searchSimilarChunks } = require("./retrieval.service");
const { groq } = require("./ai.service");

const generateRAGResponse = async ({
  question,
  userId,
  resumeId,
}) => {
  try {
    if (!question || !question.trim()) {
      throw new Error("Question is required");
    }

    if (!userId) {
      throw new Error("userId is required");
    }

    if (!resumeId) {
      throw new Error("resumeId is required");
    }

    // 1. Retrieve relevant resume chunks
    const results = await searchSimilarChunks({
      query: question,
      userId,
      resumeId,
      limit: 5,
    });

    // 2. Build context for the LLM
    const context = results
      .map(
        (result, index) =>
          `Context ${index + 1}:\n${result.content}`
      )
      .join("\n\n");

    // 3. Send retrieved context to Groq
    const prompt = `
You are an AI career assistant.

Answer the user's question using ONLY the resume context below.

Resume Context:
${context || "No relevant information found."}

User Question:
${question}

Rules:
- Use only the provided resume context.
- Do not invent experience, skills, projects, or education.
- If the information is not available, say:
"I could not find that information in the resume."
- Keep the answer concise and useful.
`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const answer = response.choices[0]?.message?.content;

    if (!answer) {
      throw new Error("AI returned an empty response");
    }

    return {
      answer,
      sources: results.map((result) => ({
        content: result.content,
        score: result.score,
      })),
    };
  } catch (error) {
    console.error("RAG response error:", error);
    throw error;
  }
};

module.exports = {
  generateRAGResponse,
};