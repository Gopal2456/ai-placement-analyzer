const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractSkillsWithAI = async (resumeText) => {
  try {
    if (!resumeText || !resumeText.trim()) {
      throw new Error("Resume text is empty");
    }

    const prompt = `
      You are a resume skill extraction system.

      Analyze the resume below and extract the candidate's technical and professional skills.

      Return ONLY a valid JSON array of strings.

      Rules:
      - Include programming languages
      - Include frameworks
      - Include libraries
      - Include databases
      - Include cloud technologies
      - Include developer tools
      - Include AI/ML technologies
      - Include relevant professional/technical skills
      - Do not include names
      - Do not include companies
      - Do not include job titles
      - Do not include degrees
      - Do not include universities
      - Do not include locations
      - Do not include generic qualities like "hardworking" or "team player"

      Example:
      [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB",
        "Git"
      ]

      Resume:
      ${resumeText}
      `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const output = response.text.trim();

    console.log("Gemini response:", output);

    // Remove markdown code fences if Gemini adds them
    const cleanedOutput = output
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const skills = JSON.parse(cleanedOutput);

    if (!Array.isArray(skills)) {
      throw new Error("Gemini returned invalid skill format");
    }

    return [...new Set(skills)];
  } catch (error) {
    console.error("Gemini skill extraction error:", error);

    throw new Error(`AI skill extraction failed: ${error.message}`);
  }
};

const analyzeResumeWithAI = async (resumeText, skills) => {
  try {
    if (!resumeText || !resumeText.trim()) {
      throw new Error("Resume text is empty");
    }

    const prompt = `
      You are an expert resume analyzer for a career placement platform.

      Analyze the following resume carefully.

      Resume Skills:
      ${JSON.stringify(skills)}

      Resume:
      ${resumeText}

      Return ONLY valid JSON.

      Use exactly this structure:

      {
        "overallScore": 0,
        "skillsScore": 0,
        "experienceScore": 0,
        "projectsScore": 0,
        "educationScore": 0,
        "strengths": [],
        "weaknesses": [],
        "suggestions": [],
        "missingSkills": [],
        "summary": ""
      }

      Rules:

      - All scores must be between 0 and 100.
      - overallScore should represent the overall placement readiness of the resume.
      - skillsScore should evaluate the quality and relevance of technical skills.
      - experienceScore should evaluate work/internship experience.
      - projectsScore should evaluate projects and practical experience.
      - educationScore should evaluate education relevance.
      - strengths should contain 3 to 5 useful points.
      - weaknesses should contain 3 to 5 useful points.
      - suggestions should contain 3 to 5 actionable improvements.
      - missingSkills should contain useful skills that would improve the candidate's employability based on their existing profile.
      - summary should be a short professional assessment.
      - Do not invent experience, education, projects, or skills that are not present in the resume.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const output = response.text.trim();

    const cleanedOutput = output
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const analysis = JSON.parse(cleanedOutput);

    return analysis;
  } catch (error) {
    console.error("Resume AI analysis error:", error);

    throw new Error(
      `Resume analysis failed: ${error.message}`
    );
  }
};

module.exports = {
  extractSkillsWithAI,
  analyzeResumeWithAI,
};
