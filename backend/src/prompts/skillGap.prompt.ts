export interface SkillGapPromptInput {
  targetRole: string;
  jobDescription: string | null;
  currentSkills: Array<{
    name: string;
    level?: string | null;
    category?: string | null;
  }>;
}

export interface SkillGapResult {
  score: number;
  targetRole: string;
  currentSkillsSummary: string;
  missingSkills: Array<{
    name: string;
    priority: "high" | "medium" | "low";
    reason: string;
  }>;
  existingRelevantSkills: string[];
  recommendedResources: Array<{
    skill: string;
    resource: string;
  }>;
  suggestions: string[];
}

export const buildSkillGapPrompt = (input: SkillGapPromptInput): string => {
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
    : "No job description provided — evaluate based on the target role title alone.";

  return `
You are a senior tech career coach and hiring manager with deep knowledge of what skills are required for various tech roles in ${new Date().getFullYear()}.

Analyze the skill gap between the candidate's current skills and what is required for their target role.

TARGET ROLE: ${input.targetRole}

CANDIDATE'S CURRENT SKILLS:
${skillsText}

${jobDescriptionSection}

Evaluate thoroughly and return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no preamble):

{
  "score": <integer 0-100 representing how ready they are for the target role>,
  "targetRole": "${input.targetRole}",
  "currentSkillsSummary": "<1-2 sentence summary of their current skill level>",
  "missingSkills": [
    {
      "name": "<skill name>",
      "priority": "<high | medium | low>",
      "reason": "<why this skill matters for the target role>"
    }
  ],
  "existingRelevantSkills": ["<skill they already have that is relevant>"],
  "recommendedResources": [
    {
      "skill": "<skill to learn>",
      "resource": "<specific course, platform, or resource to learn it>"
    }
  ],
  "suggestions": ["<actionable next step>", "<actionable next step>"]
}

Rules:
- score reflects readiness: 0 = no relevant skills, 100 = fully qualified
- missingSkills must have 3 to 8 items ordered by priority (high first)
- existingRelevantSkills must reference skills actually in their list that are relevant to the target role
- recommendedResources should cover the top 3 high-priority missing skills with specific platforms (e.g. "Learn TypeScript on The Odin Project or official docs")
- suggestions must be directly actionable career steps (not just "learn X")
- Return ONLY the JSON object, nothing else
`.trim();
};
