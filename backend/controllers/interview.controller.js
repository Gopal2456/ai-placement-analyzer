const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const Job = require("../models/Job");

const {
  generateInterviewQuestionsWithAI,
  evaluateInterviewAnswersWithAI,
} = require("../services/ai.service");

const generateInterview = async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId is required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    let job = null;

    if (jobId) {
      job = await Job.findOne({
        _id: jobId,
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }
    }

    const questions = await generateInterviewQuestionsWithAI({
      resumeText: resume.extractedText,
      jobDescription: job?.description || "",
    });

    const interview = await Interview.create({
      userId: req.user.userId,
      resumeId,
      jobId: jobId || null,
      questions,
    });

    return res.status(201).json({
      success: true,
      message: "Interview questions generated successfully",
      interview,
    });
  } catch (error) {
    console.error("Generate interview error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate interview questions",
    });
  }
};

const submitInterviewAnswers = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "answers must be a non-empty array",
      });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.user.userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const resume = await Resume.findOne({
      _id: interview.resumeId,
      userId: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    let jobDescription = "";

    if (interview.jobId) {
      const job = await Job.findById(interview.jobId);

      if (job) {
        jobDescription = job.description || "";
      }
    }

    // Build questions for AI
    const questionsForAI = [];

    for (const submittedAnswer of answers) {
      const { questionId, answer } = submittedAnswer;

      if (!questionId) {
        return res.status(400).json({
          success: false,
          message: "questionId is required",
        });
      }

      if (!answer || !answer.trim()) {
        return res.status(400).json({
          success: false,
          message: `Answer is required for question ${questionId}`,
        });
      }

      const question = interview.questions.id(questionId);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: `Interview question not found: ${questionId}`,
        });
      }

      questionsForAI.push({
        questionId: question._id.toString(),
        question: question.question,
        type: question.type,
        difficulty: question.difficulty,
        answer: answer.trim(),
      });
    }

    console.log(
      `Evaluating ${questionsForAI.length} interview answers with one AI request`,
    );

    // ONE Groq request for all answers
    const evaluations = await evaluateInterviewAnswersWithAI({
      questions: questionsForAI,
      resumeText: resume.extractedText || "",
      jobDescription,
    });

    const results = [];

    // Save evaluations
    for (const evaluation of evaluations) {
      const question = interview.questions.id(evaluation.questionId);

      if (!question) {
        continue;
      }

      const submittedAnswer = questionsForAI.find(
        (item) => item.questionId === evaluation.questionId,
      );

      question.answer = submittedAnswer?.answer || "";
      question.score = evaluation.score;
      question.feedback = evaluation.feedback;
      question.strengths = evaluation.strengths;
      question.improvements = evaluation.improvements;
      question.betterAnswer = evaluation.betterAnswer;

      results.push({
        questionId: question._id,
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        betterAnswer: evaluation.betterAnswer,
      });
    }

    await interview.save();

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);

    const overallScore =
      results.length > 0 ? Number((totalScore / results.length).toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      message: "Interview answers evaluated successfully",
      overallScore,
      answeredQuestions: results.length,
      totalQuestions: interview.questions.length,
      results,
    });
  } catch (error) {
    console.error("Submit interview answers error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to evaluate interview answers",
    });
  }
};

const getInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.user.userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Get interview error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get interview",
    });
  }
};

const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    const formattedInterviews = interviews.map((interview) => {
      const answeredQuestions = interview.questions.filter(
        (question) =>
          question.answer && question.answer.trim().length > 0
      );

      const totalScore = answeredQuestions.reduce(
        (sum, question) => sum + (question.score || 0),
        0
      );

      const overallScore =
        answeredQuestions.length > 0
          ? Number(
              (totalScore / answeredQuestions.length).toFixed(1)
            )
          : null;

      return {
        _id: interview._id,
        resumeId: interview.resumeId,
        jobId: interview.jobId,

        totalQuestions: interview.questions.length,

        answeredQuestions: answeredQuestions.length,

        overallScore,

        status:
          answeredQuestions.length === interview.questions.length
            ? "completed"
            : answeredQuestions.length > 0
            ? "in-progress"
            : "not-started",

        createdAt: interview.createdAt,
        updatedAt: interview.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedInterviews.length,
      interviews: formattedInterviews,
    });
  } catch (error) {
    console.error("Get interviews error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to get interview history",
    });
  }
};

module.exports = {
  generateInterview,
  submitInterviewAnswers,
  getInterview,
  getInterviews,
};
