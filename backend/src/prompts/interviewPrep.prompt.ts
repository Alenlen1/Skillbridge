export interface InterviewPrepPromptInput {
  targetRole: string;
  jobDescription: string | null;
  currentSkills: Array<{
    name: string;
    level?: string | null;
    category?: string | null;
  }>;
}

export interface InterviewQuestion {
  question: string;
  type: "technical" | "behavioral" | "situational";
  tip: string;
}

export interface InterviewPrepResult {
  targetRole: string;
  summary: string;
  questions: InterviewQuestion[];
  generalTips: string[];
}

export const buildInterviewPrepPrompt = (
  input: InterviewPrepPromptInput,
): string => {
  const skillsText =
    input.currentSkills.length === 0
      ? "No skills listed."
      : input.currentSkills
          .map(
            (s) =>
              `${s.name}${s.level ? ` (${s.level})` : ""}${s.category ? ` [${s.category}]` : ""}`,
          )
          .join(", ");

  const jobDescriptionSection = input.jobDescription
    ? `JOB DESCRIPTION:
"""
${input.jobDescription}
"""`
    : "No job description provided — generate questions based on the target role title alone.";

  return `
You are a senior technical interviewer and career coach with 15 years of experience conducting interviews at top tech companies.

Generate a comprehensive interview preparation guide for the following candidate.

TARGET ROLE: ${input.targetRole}
CANDIDATE'S CURRENT SKILLS: ${skillsText}

${jobDescriptionSection}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no preamble):

{
  "targetRole": "${input.targetRole}",
  "summary": "<2 sentence overview of what to expect in interviews for this role>",
  "questions": [
    {
      "question": "<interview question>",
      "type": "<technical | behavioral | situational>",
      "tip": "<specific tip on how to answer this question well>"
    }
  ],
  "generalTips": ["<general interview tip>", "<another tip>", "<another tip>"]
}

Rules:
- questions must have exactly 8 to 10 items
- Mix of types: at least 3 technical, 3 behavioral, 2 situational
- technical questions must be specific to the target role and candidate's skills
- behavioral questions must follow the STAR method format
- Each tip must be specific and actionable, not generic
- generalTips must have 3 to 5 items
- Questions must be realistic — the kind actually asked in real interviews for this role
- Return ONLY the JSON object, nothing else
`.trim();
};
