export interface RoadmapPromptInput {
  currentRole: string;
  targetRole: string;
  yearsOfExperience: number;
}

export interface RoadmapResult {
  milestones: Array<{ title: string; duration: string; skills: string[] }>;
}

export const buildRoadmapPrompt = (_input: RoadmapPromptInput): string => {
  throw new Error("Career roadmap is not yet implemented");
};
