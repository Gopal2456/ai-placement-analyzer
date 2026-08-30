const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("Uploaded PDF file was not found");
    }

    const fileBuffer = fs.readFileSync(filePath);

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Uploaded PDF is empty");
    }

    const pdfPromise = pdfParse(fileBuffer);

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("PDF processing timed out"));
      }, 15000);
    });

    const pdfData = await Promise.race([
      pdfPromise,
      timeoutPromise,
    ]);

    if (!pdfData || !pdfData.text) {
      throw new Error("Could not extract text from PDF");
    }

    return pdfData.text.trim();
  } catch (error) {
    console.error("PDF extraction error:", error);

    throw error;
  }
};

module.exports = {
  extractTextFromPDF,
};