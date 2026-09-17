const { generateRAGResponse } = require("../services/rag.service");

const askResumeAssistant = async (req, res) => {
  try {
    const { question, resumeId } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId is required",
      });
    }

    const result = await generateRAGResponse({
      question: question.trim(),
      userId: req.user.userId,
      resumeId,
    });

    return res.status(200).json({
      success: true,
      question: question.trim(),
      answer: result.answer,
      sources: result.sources,
    });
  } catch (error) {
    console.error("Resume assistant error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to generate resume assistant response",
    });
  }
};

module.exports = {
  askResumeAssistant,
};