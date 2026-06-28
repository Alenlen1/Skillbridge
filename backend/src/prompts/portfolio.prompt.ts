export interface PortfolioPromptInput {
  name: string | null;
  headline: string | null;
  about: string | null;
  location: string | null;
  website: string | null;
  skills: Array<{
    name: string;
    level?: string | null;
    category?: string | null;
  }>;
  experience: Array<{
    company: string;
    role: string;
    employmentType?: string | null;
    current: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
    description?: string | null;
  }>;
  education: Array<{
    school: string;
    degree?: string | null;
    field?: string | null;
    startYear?: number | null;
    endYear?: number | null;
    current: boolean;
  }>;
  projects: Array<{
    title: string;
    description?: string | null;
    techStack: string[];
    liveUrl?: string | null;
    githubUrl?: string | null;
    featured: boolean;
  }>;
  socialLinks: Array<{ platform: string; url: string }>;
}

export interface PortfolioReviewResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export const buildPortfolioPrompt = (input: PortfolioPromptInput): string => {
  const experienceText =
    input.experience.length === 0
      ? "No experience listed."
      : input.experience
          .map((e) => {
            const period = e.current
              ? "Present"
              : e.endDate
                ? new Date(e.endDate).getFullYear()
                : "Unknown";
            const start = e.startDate
              ? new Date(e.startDate).getFullYear()
              : "Unknown";
            return `- ${e.role} at ${e.company} (${start} - ${period})${e.employmentType ? ` [${e.employmentType}]` : ""}${e.description ? `\n  Description: ${e.description}` : ""}`;
          })
          .join("\n");

  const educationText =
    input.education.length === 0
      ? "No education listed."
      : input.education
          .map((e) => {
            const period = e.current ? "Present" : (e.endYear ?? "Unknown");
            return `- ${e.degree ?? "Degree unknown"} in ${e.field ?? "Field unknown"} at ${e.school} (${e.startYear ?? "?"} - ${period})`;
          })
          .join("\n");

  const projectsText =
    input.projects.length === 0
      ? "No projects listed."
      : input.projects
          .map((p) => {
            const links = [
              p.liveUrl ? `Live: ${p.liveUrl}` : null,
              p.githubUrl ? `GitHub: ${p.githubUrl}` : null,
            ]
              .filter(Boolean)
              .join(", ");
            return `- ${p.title}${p.featured ? " [Featured]" : ""}\n  Tech: ${p.techStack.join(", ") || "Not specified"}\n  ${p.description ?? "No description."}\n  Links: ${links || "None"}`;
          })
          .join("\n");

  const skillsText =
    input.skills.length === 0
      ? "No skills listed."
      : input.skills
          .map(
            (s) =>
              `${s.name}${s.level ? ` (${s.level})` : ""}${s.category ? ` [${s.category}]` : ""}`,
          )
          .join(", ");

  const socialText =
    input.socialLinks.length === 0
      ? "No social links."
      : input.socialLinks.map((s) => `${s.platform}: ${s.url}`).join(", ");

  return `
You are a senior tech recruiter and career coach who has reviewed thousands of developer portfolios. You are reviewing a student or early-career developer's SkillBridge portfolio.

Evaluate the portfolio across these dimensions:
- Profile completeness (headline, about, location, website)
- Quality and clarity of the about/bio section
- Strength and relevance of listed skills
- Quality of project descriptions (clarity, tech stack, links, impact)
- Depth and relevance of experience
- Education presentation
- Social and professional links (GitHub, LinkedIn, etc.)
- Overall first impression for recruiters

PORTFOLIO DATA:
Name: ${input.name ?? "Not provided"}
Headline: ${input.headline ?? "Not provided"}
About: ${input.about ?? "Not provided"}
Location: ${input.location ?? "Not provided"}
Website: ${input.website ?? "Not provided"}
Social Links: ${socialText}

Skills:
${skillsText}

Experience:
${experienceText}

Education:
${educationText}

Projects:
${projectsText}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no preamble):

{
  "score": <integer 0-100>,
  "strengths": ["<specific strength>", "<specific strength>", "<specific strength>"],
  "weaknesses": ["<specific weakness>", "<specific weakness>", "<specific weakness>"],
  "suggestions": ["<actionable suggestion>", "<actionable suggestion>", "<actionable suggestion>"]
}

Rules:
- score must be an integer between 0 and 100
- Each array must contain between 3 and 6 items
- Be specific to the actual portfolio content — no generic advice
- strengths and weaknesses must reference actual data from the portfolio
- suggestions must be directly actionable (e.g. "Add a description to your SkillBridge project explaining the problem it solves")
- Return ONLY the JSON object, nothing else
`.trim();
};
