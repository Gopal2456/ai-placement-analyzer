// ------------- the skillsList will be fetched from ai LLM ----------------

const skillsList = [
  // Frontend
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Tailwind CSS",
  "Bootstrap",

  // Backend
  "Node.js",
  "Express.js",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring Boot",
  "C++",
  "C#",
  "PHP",
  "Laravel",

  // Databases
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQL",
  "Redis",
  "Firebase",

  // Cloud / DevOps
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "GitLab",
  "CI/CD",

  // AI / ML
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "OpenCV",

  // Other
  "REST API",
  "GraphQL",
  "Redux",
  "Figma",
  "Jira",
];

const extractSkills = (text) => {
  if (!text) {
    return [];
  }

  const normalizedText = text.toLowerCase();

  const foundSkills = skillsList.filter((skill) => {
    const skillLower = skill.toLowerCase();

    return normalizedText.includes(skillLower);
  });

  return [...new Set(foundSkills)];
};

module.exports = {
  extractSkills,
};