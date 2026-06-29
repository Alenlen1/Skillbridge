"use client";

import Link from "next/link";
import {
  FaFileAlt,
  FaBriefcase,
  FaChartBar,
  FaEnvelopeOpenText,
  FaRoad,
  FaComments,
} from "react-icons/fa";
import { IconRobot } from "@tabler/icons-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  available: boolean;
}

const AI_TOOLS: Tool[] = [
  {
    id: "resume-review",
    title: "Resume Review",
    description:
      "Get a detailed AI-powered analysis of your resume with a score, strengths, weaknesses, and actionable suggestions tailored to your chosen template.",
    icon: <FaFileAlt size={20} />,
    href: "/ai-assistant/resume-review",
    available: true,
  },
  {
    id: "portfolio-review",
    title: "Portfolio Review",
    description:
      "Receive feedback on your portfolio presentation, project descriptions, and overall first impression for recruiters and clients.",
    icon: <FaBriefcase size={20} />,
    href: "/ai-assistant/portfolio-review",
    available: true,
  },
  {
    id: "skill-gap",
    title: "Skill Gap Analysis",
    description:
      "Compare your current skill set against your target role and discover exactly what to learn next to close the gap.",
    icon: <FaChartBar size={20} />,
    href: "/ai-assistant/skill-gap",
    available: true,
  },
  {
    id: "cover-letter",
    title: "Cover Letter Generator",
    description:
      "Generate a tailored, professional cover letter based on your resume and a job description in seconds.",
    icon: <FaEnvelopeOpenText size={20} />,
    href: "/ai-assistant/cover-letter",
    available: true,
  },
  {
    id: "career-roadmap",
    title: "Career Roadmap",
    description:
      "Get a personalized step-by-step roadmap from your current position to your target role with milestones and timelines.",
    icon: <FaRoad size={20} />,
    href: "/ai-assistant/roadmap",
    available: true,
  },
  {
    id: "interview-prep",
    title: "Interview Prep",
    description:
      "Get role-specific interview questions with expert tips on how to answer them, tailored to your skills and target position.",
    icon: <FaComments size={20} />,
    href: "/ai-assistant/interview-prep",
    available: true,
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  const inner = (
    <div
      className={`group relative flex flex-col gap-4 rounded-xl border p-5 transition-colors ${
        tool.available
          ? "cursor-pointer border-white/[0.08] bg-white/[0.03] hover:border-indigo-500/40 hover:bg-indigo-500/[0.05]"
          : "cursor-default border-white/[0.05] bg-white/[0.02]"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          tool.available
            ? "bg-indigo-500/15 text-indigo-400"
            : "bg-white/[0.05] text-slate-600"
        }`}
      >
        {tool.icon}
      </div>

      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h2
            className={`text-sm font-semibold ${
              tool.available ? "text-white" : "text-slate-500"
            }`}
          >
            {tool.title}
          </h2>
          {!tool.available && (
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Coming Soon
            </span>
          )}
        </div>
        <p
          className={`text-xs leading-relaxed ${
            tool.available ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {tool.description}
        </p>
      </div>

      {tool.available && (
        <div className="flex items-center gap-1 text-xs font-medium text-indigo-400">
          Get started
          <svg
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </div>
  );

  if (!tool.available) return inner;
  return <Link href={tool.href}>{inner}</Link>;
}

export default function AIAssistantPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <IconRobot size={18} stroke={1.5} />
          </div>
          <h1 className="text-xl font-semibold text-white">AI Assistant</h1>
        </div>
        <p className="text-sm text-slate-400">
          Leverage AI to accelerate your career. Get instant feedback, generate
          content, and identify opportunities for growth.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {AI_TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
