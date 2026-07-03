export interface GenerateQuestionsInput {
  targetRole: string;
  jobDescription: string | null;
  resumeText: string | null;
}

export interface GeneratedQuestion {
  question: string;
  type: "technical" | "behavioral" | "situational";
  tip: string;
}

export interface GenerateQuestionsResult {
  questions: GeneratedQuestion[];
}

export const buildInterviewQuestionsPrompt = (
  input: GenerateQuestionsInput,
): string => {
  const jobDescriptionSection = input.jobDescription
    ? `JOB DESCRIPTION:
"""
${input.jobDescription}
"""`
    : "No job description provided — generate questions based on the target role title alone.";

  const resumeSection = input.resumeText
    ? `CANDIDATE'S RESUME:
"""
${input.resumeText.slice(0, 6000)}
"""`
    : "No resume provided — generate general questions for this role.";

  return `
You are a senior technical interviewer conducting a mock interview.

Generate a set of realistic interview questions for this candidate.

TARGET ROLE: ${input.targetRole}

${jobDescriptionSection}

${resumeSection}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no preamble):

{
  "questions": [
    {
      "question": "<interview question>",
      "type": "<technical | behavioral | situational>",
      "tip": "<one specific tip on what a strong answer covers>"
    }
  ]
}

Rules:
- questions must have exactly 8 items
- Mix of types: at least 3 technical, 3 behavioral, 2 situational
- Base technical questions on the candidate's resume/skills when provided, otherwise on the target role
- behavioral and situational questions should follow the STAR method style
- Questions must be realistic — the kind actually asked in real interviews for this role
- Return ONLY the JSON object, nothing else
`.trim();
};

export interface GradeAnswerInput {
  targetRole: string;
  question: string;
  questionType: string;
  answer: string;
}

export interface GradeAnswerResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export const buildAnswerFeedbackPrompt = (input: GradeAnswerInput): string => {
  return `
You are a senior interviewer giving direct, constructive feedback on a mock interview answer.

TARGET ROLE: ${input.targetRole}
QUESTION TYPE: ${input.questionType}
QUESTION: ${input.question}

CANDIDATE'S ANSWER:
"""
${input.answer}
"""

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no preamble):

{
  "score": <integer 0 to 100>,
  "feedback": "<2 to 3 sentence direct assessment of the answer>",
  "strengths": ["<specific strength>", "<another strength if present>"],
  "improvements": ["<specific actionable improvement>", "<another improvement>"]
}

Rules:
- Be honest and specific, not generically encouraging
- If the answer is short, vague, or off-topic, the score should reflect that (below 50)
- strengths can be an empty array if there are genuinely none
- improvements must have at least 1 item unless the answer is excellent (score 90+)
- Return ONLY the JSON object, nothing else
`.trim();
};

export interface SessionSummaryInput {
  targetRole: string;
  attempts: Array<{
    question: string;
    type: string;
    answer: string | null;
    score: number | null;
  }>;
}

export interface SessionSummaryResult {
  overallScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
}

export const buildSessionSummaryPrompt = (
  input: SessionSummaryInput,
): string => {
  const answeredCount = input.attempts.filter((a) => a.answer).length;
  const transcript = input.attempts
    .map(
      (a, i) =>
        `Q${i + 1} (${a.type}): ${a.question}\nAnswer: ${a.answer ?? "(skipped)"}${a.score !== null ? ` [scored ${a.score}/100]` : ""}`,
    )
    .join("\n\n");

  return `
You are a senior interviewer writing a final performance summary for a completed mock interview session.

TARGET ROLE: ${input.targetRole}
QUESTIONS ANSWERED: ${answeredCount} of ${input.attempts.length}

FULL TRANSCRIPT:
"""
${transcript}
"""

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no preamble):

{
  "overallScore": <integer 0 to 100, weighted average reflecting overall performance>,
  "overallFeedback": "<3 to 4 sentence summary of how the candidate performed overall>",
  "strengths": ["<pattern of strength across the session>", "<another>"],
  "improvements": ["<pattern to improve across the session>", "<another>"]
}

Rules:
- Base the score on the actual quality of answers given, not just completion
- Skipped questions should slightly lower the overall score
- strengths and improvements should reflect PATTERNS across multiple answers, not repeat single-question feedback
- Return ONLY the JSON object, nothing else
`.trim();
};
