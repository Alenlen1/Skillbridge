import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export type SupportedMimeType =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const SUPPORTED_MIME_TYPES: SupportedMimeType[] = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const SUPPORTED_EXTENSIONS = ".pdf, .docx";

export const extractTextFromBuffer = async (
  buffer: Buffer,
  mimetype: string,
): Promise<string> => {
  if (mimetype === "application/pdf") {
    const parsed = await pdfParse(buffer);
    const text = parsed.text?.trim();
    if (!text) {
      throw new Error(
        "Could not extract text from this PDF. It may be scanned or image-based.",
      );
    }
    return text;
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value?.trim();
    if (!text) {
      throw new Error("Could not extract text from this DOCX file.");
    }
    return text;
  }

  throw new Error(
    `Unsupported file type: ${mimetype}. Please upload a PDF or DOCX file.`,
  );
};
