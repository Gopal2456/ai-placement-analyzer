const skillAliases = {
  // Frontend
  react: "react",
  "react.js": "react",
  "react js": "react",
  reactjs: "react",

  nextjs: "next.js",
  "next.js": "next.js",
  "next js": "next.js",

  vue: "vue.js",
  "vue.js": "vue.js",
  "vue js": "vue.js",
  vuejs: "vue.js",

  angular: "angular",
  angularjs: "angular",

  // JavaScript / TypeScript
  javascript: "javascript",
  "java script": "javascript",
  js: "javascript",

  typescript: "typescript",
  "type script": "typescript",
  ts: "typescript",

  // Backend
  node: "node.js",
  nodejs: "node.js",
  "node.js": "node.js",
  "node js": "node.js",

  express: "express.js",
  expressjs: "express.js",
  "express.js": "express.js",
  "express js": "express.js",

  // APIs
  "rest api": "rest api",
  "rest apis": "rest api",
  restapi: "rest api",
  restapis: "rest api",
  "restful api": "rest api",
  "restful apis": "rest api",
  "restful apis": "rest api",

  graphql: "graphql",
  "graph ql": "graphql",

  // Databases
  mongodb: "mongodb",
  "mongo db": "mongodb",
  mongo: "mongodb",

  mysql: "mysql",
  "my sql": "mysql",

  postgresql: "postgresql",
  postgres: "postgresql",
  "postgre sql": "postgresql",

  redis: "redis",

  // Styling
  "tailwind css": "tailwind css",
  tailwind: "tailwind css",

  bootstrap: "bootstrap",

  "material ui": "material ui",
  mui: "material ui",

  // Version control
  git: "git",
  github: "github",
  "git hub": "github",
  gitlab: "gitlab",
  "git lab": "gitlab",

  // DevOps
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",

  // Cloud
  aws: "aws",
  "amazon web services": "aws",

  azure: "azure",
  "microsoft azure": "azure",

  "google cloud": "google cloud",
  gcp: "google cloud",

  // Languages
  python: "python",
  java: "java",
  "c++": "c++",
  cpp: "c++",
  "c#": "c#",
  csharp: "c#",

  // AI
  "machine learning": "machine learning",
  ml: "machine learning",

  "artificial intelligence": "artificial intelligence",
  ai: "artificial intelligence",

  "generative ai": "generative ai",
  genai: "generative ai",

  // Tools
  postman: "postman",
  figma: "figma",
  jira: "jira",
};

const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== "string") {
    return "";
  }

  let normalized = skill
    .toLowerCase()
    .trim()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ");

  // Check alias
  if (skillAliases[normalized]) {
    return skillAliases[normalized];
  }

  return normalized;
};

const calculateMatchScore = (resumeSkills = [], jobSkills = []) => {
  if (!jobSkills.length) {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const resumeSkillMap = new Map();

  resumeSkills.forEach((skill) => {
    const normalizedSkill = normalizeSkill(skill);

    if (normalizedSkill) {
      resumeSkillMap.set(normalizedSkill, skill);
    }
  });

  const uniqueJobSkills = new Map();

  jobSkills.forEach((skill) => {
    const normalizedSkill = normalizeSkill(skill);

    if (normalizedSkill && !uniqueJobSkills.has(normalizedSkill)) {
      uniqueJobSkills.set(normalizedSkill, skill);
    }
  });

  const matchedSkills = [];
  const missingSkills = [];

  uniqueJobSkills.forEach((originalJobSkill, normalizedJobSkill) => {
    if (resumeSkillMap.has(normalizedJobSkill)) {
      matchedSkills.push(originalJobSkill);
    } else {
      missingSkills.push(originalJobSkill);
    }
  });

  const totalSkills = uniqueJobSkills.size;

  const matchScore =
    totalSkills === 0
      ? 0
      : Math.round((matchedSkills.length / totalSkills) * 100);

  return {
    matchScore,
    matchedSkills,
    missingSkills,
  };
};

// const calculateMatchScore = (resumeSkills = [], jobSkills = []) => {
//   if (!jobSkills.length) {
//     return {
//       matchScore: 0,
//       matchedSkills: [],
//       missingSkills: [],
//     };
//   }

//   const resumeSkillMap = new Map();

//   resumeSkills.forEach((skill) => {
//     const normalizedSkill = normalizeSkill(skill);

//     if (normalizedSkill) {
//       resumeSkillMap.set(normalizedSkill, skill);
//     }
//   });

//   const matchedSkills = [];
//   const missingSkills = [];

//   jobSkills.forEach((jobSkill) => {
//     const normalizedJobSkill = normalizeSkill(jobSkill);

//     if (!normalizedJobSkill) {
//       return;
//     }

//     if (resumeSkillMap.has(normalizedJobSkill)) {
//       matchedSkills.push(jobSkill);
//     } else {
//       missingSkills.push(jobSkill);
//     }
//   });

//   const matchScore = Math.round(
//     (matchedSkills.length / jobSkills.length) * 100
//   );

//   return {
//     matchScore,
//     matchedSkills,
//     missingSkills,
//   };
// };

module.exports = {
  normalizeSkill,
  calculateMatchScore,
};