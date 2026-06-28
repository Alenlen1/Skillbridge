export interface PortfolioPromptInput {
  portfolioData: Record<string, unknown>;
}

export interface PortfolioReviewResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export const buildPortfolioPrompt = (_input: PortfolioPromptInput): string => {
  throw new Error("Portfolio review is not yet implemented");
};
