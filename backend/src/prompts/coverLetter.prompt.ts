export interface CoverLetterPromptInput {
  resumeText: string;
  jobDescription: string;
  companyName: string;
}

export interface CoverLetterResult {
  coverLetter: string;
}

export const buildCoverLetterPrompt = (
  _input: CoverLetterPromptInput,
): string => {
  throw new Error("Cover letter generation is not yet implemented");
};
