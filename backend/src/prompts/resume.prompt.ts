export interface ResumePromptInput {
  template: string;
  resumeText: string;
}

export interface ResumeReviewResult {
  score: number;
  template: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

const TEMPLATE_CONTEXT: Record<string, string> = {
  ats: `
This is an ATS (Applicant Tracking System) resume. Evaluate with these criteria:
- Standard section headings (Experience, Education, Skills, Summary)
- Absence of tables, columns, graphics, or special characters that break parsers
- Keyword density and alignment with job-description terminology
- Clean plain-text formatting with consistent date formats
- No headers/footers or text boxes
- Quantified achievements using numbers and percentages
- Action verbs at the start of each bullet
Do NOT penalize for minimal design — ATS resumes should be intentionally plain.
`,
  student: `
This is a Student resume. Evaluate with these criteria:
- Education section placed prominently (before experience if limited work history)
- GPA inclusion if above 3.0/4.0 or equivalent
- Internships, part-time roles, and academic projects highlighted effectively
- Extracurricular activities, clubs, and leadership roles
- Volunteer work and community involvement
- Relevant coursework listed when experience is thin
- Certifications and online courses to supplement credentials
- Appropriate conciseness — should fit one page for most students
`,
  developer: `
This is a Developer resume. Evaluate with these criteria:
- Prominent technical skills section listing languages, frameworks, tools, and platforms
- Project section with clear descriptions of problems solved, technologies used, and measurable outcomes
- GitHub or portfolio links presence and placement
- Open-source contributions or personal projects
- Clear separation of frontend, backend, DevOps skills where applicable
- Appropriate detail on tech stack used at each position
- No vague buzzwords — specifics matter (e.g. "React 18 with TypeScript" vs just "React")
`,
};

export const buildResumePrompt = (input: ResumePromptInput): string => {
  const templateKey = input.template.toLowerCase();
  const templateContext =
    TEMPLATE_CONTEXT[templateKey] || TEMPLATE_CONTEXT["ats"];

  return `
You are a senior career coach and professional resume reviewer with 15 years of experience helping candidates land roles at top companies.

You are reviewing a "${input.template}" resume. Apply the following template-specific evaluation criteria:
${templateContext}

RESUME CONTENT:
"""
${input.resumeText}
"""

Evaluate the resume thoroughly and return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no preamble):

{
  "score": <integer 0-100>,
  "template": "${input.template}",
  "strengths": ["<specific strength>", "<specific strength>", "<specific strength>"],
  "weaknesses": ["<specific weakness>", "<specific weakness>", "<specific weakness>"],
  "suggestions": ["<actionable suggestion>", "<actionable suggestion>", "<actionable suggestion>"]
}

Rules:
- score must be an integer between 0 and 100
- Each array must contain between 3 and 6 items
- Be specific to the actual content — do not give generic advice
- strengths and weaknesses must reference actual content from the resume
- suggestions must be directly actionable
- Return ONLY the JSON object, nothing else
`.trim();
};
