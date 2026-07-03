import { GoogleGenAI } from "@google/genai";

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStructuredResponse = async <T>(
  prompt: string,
): Promise<T> => {
  const client = getClient();

  const response = await client.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  let cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  // Gemini sometimes appends stray text after the JSON object/array even
  // with responseMimeType set. Extract just the outermost JSON structure
  // so trailing content doesn't break JSON.parse.
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  const start =
    firstBrace === -1
      ? firstBracket
      : firstBracket === -1
        ? firstBrace
        : Math.min(firstBrace, firstBracket);

  if (start > 0) {
    cleaned = cleaned.slice(start);
  }

  const openChar = cleaned[0];
  const closeChar = openChar === "[" ? "]" : "}";
  if (openChar === "{" || openChar === "[") {
    let depth = 0;
    let inString = false;
    let escaped = false;
    let endIndex = -1;

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (char === '"') {
        inString = true;
      } else if (char === openChar) {
        depth++;
      } else if (char === closeChar) {
        depth--;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }

    if (endIndex !== -1) {
      cleaned = cleaned.slice(0, endIndex + 1);
    }
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("Gemini raw response that failed to parse:", text);
    throw error;
  }
};
