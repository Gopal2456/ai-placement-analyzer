const DEFAULT_CHUNK_SIZE = 500;
const DEFAULT_CHUNK_OVERLAP = 100;

const normalizeText = (text) => {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const chunkText = (
  text,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_CHUNK_OVERLAP
) => {
  if (!text || !text.trim()) {
    return [];
  }

  if (overlap >= chunkSize) {
    throw new Error("Chunk overlap must be smaller than chunk size");
  }

  const normalizedText = normalizeText(text);

  const words = normalizedText.split(/\s+/);

  const chunks = [];
  let currentWords = [];
  let currentLength = 0;

  for (const word of words) {
    const additionalLength =
      currentWords.length === 0
        ? word.length
        : word.length + 1;

    if (
      currentLength + additionalLength > chunkSize &&
      currentWords.length > 0
    ) {
      const chunk = currentWords.join(" ");

      chunks.push(chunk);

      // Keep words from the end of the previous chunk
      // until we reach the desired overlap.
      const overlapWords = [];
      let overlapLength = 0;

      for (let i = currentWords.length - 1; i >= 0; i--) {
        const wordLength =
          currentWords[i].length +
          (overlapWords.length > 0 ? 1 : 0);

        if (overlapLength + wordLength > overlap) {
          break;
        }

        overlapWords.unshift(currentWords[i]);
        overlapLength += wordLength;
      }

      currentWords = overlapWords;
      currentLength = overlapLength;
    }

    currentWords.push(word);
    currentLength += additionalLength;
  }

  if (currentWords.length > 0) {
    chunks.push(currentWords.join(" "));
  }

  return chunks;
};

module.exports = {
  chunkText,
};