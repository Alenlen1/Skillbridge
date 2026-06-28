export interface SkillGapPromptInput {
  currentSkills: string[];
  targetRole: string;
}

export interface SkillGapResult {
  missingSkills: string[];
  recommendedResources: string[];
  estimatedTimeToReady: string;
}

export const buildSkillGapPrompt = (_input: SkillGapPromptInput): string => {
  throw new Error("Skill gap analysis is not yet implemented");
};
