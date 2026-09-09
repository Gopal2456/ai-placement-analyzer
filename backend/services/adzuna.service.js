const searchAdzunaJobs = async ({
  query = "Full Stack Developer",
  location = "Pune",
  page = 1,
  resultsPerPage = 10,
}) => {
  try {
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
      throw new Error("Adzuna API credentials are missing");
    }

    const params = new URLSearchParams({
      app_id: process.env.ADZUNA_APP_ID,
      app_key: process.env.ADZUNA_APP_KEY,
      results_per_page: String(resultsPerPage),
      what: query,
      where: location,
      "content-type": "application/json",
    });

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Adzuna API error ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Adzuna service error:", error);
    throw error;
  }
};

module.exports = {
  searchAdzunaJobs,
};