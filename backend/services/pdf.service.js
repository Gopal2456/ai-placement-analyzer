const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  try {
    console.log("Starting PDF extraction...");
    console.log("File:", filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error("Uploaded PDF file was not found");
    }

    const fileBuffer = fs.readFileSync(filePath);

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Uploaded PDF is empty");
    }

    console.log("PDF size:", fileBuffer.length);

    const parser = new PDFParse({
      data: fileBuffer,
    });

    try {
      const result = await parser.getText();

      if (!result || !result.text) {
        throw new Error("Could not extract text from PDF");
      }

      const extractedText = result.text.trim();

      console.log(
        "PDF text extracted successfully"
      );

      console.log(
        "Characters extracted:",
        extractedText.length
      );

      return extractedText;
    } finally {
      await parser.destroy();
    }
  } catch (error) {
    console.error(
      "PDF extraction error:",
      error
    );

    throw new Error(
      `PDF processing failed: ${error.message}`
    );
  }
};

module.exports = {
  extractTextFromPDF,
};