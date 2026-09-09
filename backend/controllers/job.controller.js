// const Job = require("../models/Job");
// const { extractSkills } = require("../services/skill.service");

// const createJob = async (req, res) => {
//   try {
//     const { title, company, description } = req.body;

//     if (!title || !company || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, company and description are required",
//       });
//     }

//     const skills = extractSkills(description);

//     const job = await Job.create({
//       userId: req.user.userId,
//       title,
//       company,
//       description,
//       skills,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Job description created successfully",
//       job,
//     });
//   } catch (error) {
//     console.error("Create job error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create job",
//       error: error.message,
//     });
//   }
// };

// const getJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({
//       userId: req.user.userId,
//     }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: jobs.length,
//       jobs,
//     });
//   } catch (error) {
//     console.error("Get jobs error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch jobs",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   createJob,
//   getJobs,
// };

const Job = require("../models/Job");
const { extractSkills } = require("../services/skill.service");
const { searchAdzunaJobs } = require("../services/adzuna.service");

const createJob = async (req, res) => {
  try {
    const { title, company, description } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, company and description are required",
      });
    }

    const skills = extractSkills(description);

    const job = await Job.create({
      userId: req.user.userId,
      title,
      company,
      description,
      skills,
      source: "manual",
    });

    return res.status(201).json({
      success: true,
      message: "Job description created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};


const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};


const importJobs = async (req, res) => {
  try {
    const {
      query = "Full Stack Developer",
      location = "Pune",
      page = 1,
      limit = 10,
    } = req.query;

    console.log("================================");
    console.log("ADZUNA JOB IMPORT");
    console.log("Query:", query);
    console.log("Location:", location);
    console.log("================================");

    const data = await searchAdzunaJobs({
      query,
      location,
      page,
      resultsPerPage: limit,
    });

    const jobs = data.results || [];

    const importedJobs = [];

    for (const ad of jobs) {
      const description = ad.description || "";

      const skills = extractSkills(description);

      const job = await Job.findOneAndUpdate(
        {
          source: "adzuna",
          externalId: String(ad.id),
        },
        {
          userId: null,

          title: ad.title || "Untitled Job",

          company:
            ad.company?.display_name || "Unknown Company",

          description,

          location:
            ad.location?.display_name || location,

          skills,

          source: "adzuna",

          externalId: String(ad.id),

          url: ad.redirect_url || "",

          salaryMin:
            typeof ad.salary_min === "number"
              ? ad.salary_min
              : null,

          salaryMax:
            typeof ad.salary_max === "number"
              ? ad.salary_max
              : null,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      importedJobs.push(job);
    }

    return res.status(200).json({
      success: true,
      message: "Jobs imported successfully",

      search: {
        query,
        location,
        page: Number(page),
      },

      count: importedJobs.length,

      jobs: importedJobs,
    });
  } catch (error) {
    console.error("Import jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to import jobs",
      error: error.message,
    });
  }
};


module.exports = {
  createJob,
  getJobs,
  importJobs,
};