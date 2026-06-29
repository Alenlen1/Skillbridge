export interface CoverLetterPromptInput {
  companyName: string;
  jobDescription: string;
  candidateName: string | null;
  resumeText: string | null;
  portfolioSummary: string | null;
}

export interface CoverLetterResult {
  coverLetter: string;
  highlights: string[];
}

export const buildCoverLetterPrompt = (
  input: CoverLetterPromptInput,
): string => {
  const candidateSection = input.resumeText
    ? `RESUME CONTENT:
"""
${input.resumeText}
"""`
    : input.portfolioSummary
      ? `CANDIDATE PORTFOLIO DATA:
"""
${input.portfolioSummary}
"""`
      : "No resume or portfolio data provided. Write a strong general cover letter based on the job description.";

  return `
You are a professional cover letter writer with 15 years of experience helping developers and tech professionals land interviews at top companies.

Write a compelling, personalized cover letter for the following:

CANDIDATE NAME: ${input.candidateName ?? "the candidate"}
COMPANY: ${input.companyName}

JOB DESCRIPTION:
"""
${input.jobDescription}
"""

${candidateSection}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no preamble):

{
  "coverLetter": "<the full cover letter as a single string with \\n for line breaks>",
  "highlights": ["<key selling point matched to the job>", "<another highlight>", "<another highlight>"]
}

Cover letter rules:
- Professional but personable tone — not robotic or generic
- 3 to 4 paragraphs, each separated by \\n\\n
- Opening paragraph: express genuine interest in the role and company, reference something specific from the job description
- Middle paragraph(s): connect the candidate's most relevant skills and experience directly to the job requirements
- Closing paragraph: confident call to action, thank them for their time
- Do NOT use filler phrases like "I am writing to express my interest" or "I believe I would be a great fit"
- Do NOT use placeholders like [Your Name] or [Date] — use the actual candidate name if provided
- Address it to "Hiring Manager" if no specific name is available
- Keep it under 400 words
- highlights must contain 3 to 5 specific selling points that match the job requirements
- Return ONLY the JSON object, nothing else
`.trim();
};
