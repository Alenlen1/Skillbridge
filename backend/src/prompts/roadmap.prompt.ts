export interface RoadmapPromptInput {
  currentRole: string;
  targetRole: string;
  yearsOfExperience: string;
  currentSkills: Array<{
    name: string;
    level?: string | null;
    category?: string | null;
  }>;
}

export interface RoadmapMilestone {
  title: string;
  duration: string;
  description: string;
  skills: string[];
  actions: string[];
}

export interface RoadmapResult {
  summary: string;
  estimatedTimeline: string;
  milestones: RoadmapMilestone[];
  finalGoal: string;
}

export const buildRoadmapPrompt = (input: RoadmapPromptInput): string => {
  const skillsText =
    input.currentSkills.length === 0
      ? "No skills listed."
      : input.currentSkills
          .map(
            (s) =>
              `${s.name}${s.level ? ` (${s.level})` : ""}${s.category ? ` [${s.category}]` : ""}`,
          )
          .join(", ");

  return `
You are a senior tech career coach with deep knowledge of career progression paths in the software industry in ${new Date().getFullYear()}.

Create a detailed, realistic, and personalized career roadmap for this candidate.

CURRENT ROLE: ${input.currentRole}
TARGET ROLE: ${input.targetRole}
YEARS OF EXPERIENCE: ${input.yearsOfExperience}
CURRENT SKILLS: ${skillsText}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no preamble):

{
  "summary": "<2-3 sentence overview of the path from current role to target role>",
  "estimatedTimeline": "<realistic total time estimate e.g. '12-18 months' or '2-3 years'>",
  "milestones": [
    {
      "title": "<milestone title e.g. 'Master Core Fundamentals'>",
      "duration": "<time for this milestone e.g. '0-3 months'>",
      "description": "<1-2 sentences explaining what this milestone is about>",
      "skills": ["<skill to learn or improve>", "<another skill>"],
      "actions": ["<concrete action to take>", "<another action>"]
    }
  ],
  "finalGoal": "<1 sentence describing what they will be capable of once they reach the target role>"
}

Rules:
- milestones must have between 3 and 6 items in logical progression order
- Each milestone must have 2 to 4 skills and 2 to 4 actions
- skills inside milestones must be specific (e.g. "React Query for server state" not just "React")
- actions must be concrete and actionable (e.g. "Build a full-stack project using Node.js and PostgreSQL and deploy it to Railway" not just "build projects")
- Take into account their existing skills — do not tell them to learn things they already know
- estimatedTimeline must be realistic based on their experience level and the gap between roles
- summary must be encouraging but honest
- Return ONLY the JSON object, nothing else
`.trim();
};
