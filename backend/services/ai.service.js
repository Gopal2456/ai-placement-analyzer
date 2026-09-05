const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractResumeDataWithAI = async (resumeText) => {
  try {
    if (!resumeText || !resumeText.trim()) {
      throw new Error("Resume text is empty");
    }

    const prompt = `
      You are a resume information extraction system.

      Analyze the resume below and extract:
      1. Technical/professional skills
      2. Total professional work experience
      3. The candidate's most relevant/current professional role

      Return ONLY a valid JSON object in exactly this format:

      {
        "skills": [],
        "experience": "",
        "role": ""
      }

      Rules for skills:
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

      Rules for experience:
      - Calculate the candidate's total professional work experience.
      - Use explicitly mentioned total experience if available.
      - Otherwise calculate it from employment dates.
      - Include internships only if they represent meaningful professional experience.
      - Do not count education duration as work experience.
      - Return a human-readable value such as:
        "2+ years"
        "3 years"
        "1 year 8 months"
        "6 months"
      - If the candidate has no professional experience, return "Fresher".

      Rules for role:
      - Extract the candidate's most relevant professional role.
      - Prefer the current/latest job title if available.
      - If there is no current job, use the most recent relevant job title.
      - If the resume is for a fresher, infer the most appropriate role from their skills, projects, and resume content.
      - Keep the role concise.
      - Examples:
        "Frontend Developer"
        "Full Stack Developer"
        "Software Engineer"
        "Backend Developer"
        "Data Analyst"
        "AI/ML Engineer"
      - Return ONLY the role name.
      - Do not include company names.

      Example:

      {
        "skills": [
          "JavaScript",
          "React",
          "Node.js",
          "MongoDB",
          "Git"
        ],
        "experience": "2+ years",
        "role": "Full Stack Developer"
      }

      Resume:
      ${resumeText}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const output = response.text.trim();

    console.log("Gemini response:", output);

    // Remove markdown code fences
    const cleanedOutput = output
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const resumeData = JSON.parse(cleanedOutput);

    if (
      !resumeData ||
      typeof resumeData !== "object" ||
      !Array.isArray(resumeData.skills)
    ) {
      throw new Error("Gemini returned invalid resume data format");
    }

    const skills = [
      ...new Set(
        resumeData.skills
          .filter((skill) => typeof skill === "string")
          .map((skill) => skill.trim())
          .filter(Boolean),
      ),
    ];

    const experience =
      typeof resumeData.experience === "string" && resumeData.experience.trim()
        ? resumeData.experience.trim()
        : "Fresher";

    const role =
      typeof resumeData.role === "string" && resumeData.role.trim()
        ? resumeData.role.trim()
        : "Not specified";

    return {
      skills,
      experience,
      role,
    };
  } catch (error) {
    console.error("Gemini resume extraction error:", error);

    throw new Error(`AI resume extraction failed: ${error.message}`);
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

    throw new Error(`Resume analysis failed: ${error.message}`);
  }
};

module.exports = {
  extractResumeDataWithAI,
  analyzeResumeWithAI,
};
