import {
  FaFileAlt,
  FaBriefcase,
  FaChartBar,
  FaEnvelopeOpenText,
  FaRoad,
  FaComments,
  FaCheckCircle,
  FaLightbulb,
} from "react-icons/fa";
import { IconRobot } from "@tabler/icons-react";

const tools = [
  { icon: <FaFileAlt size={11} />, label: "Resume Review" },
  { icon: <FaBriefcase size={11} />, label: "Portfolio Review" },
  { icon: <FaChartBar size={11} />, label: "Skill Gap Analysis" },
  { icon: <FaEnvelopeOpenText size={11} />, label: "Cover Letter" },
  { icon: <FaRoad size={11} />, label: "Career Roadmap" },
  { icon: <FaComments size={11} />, label: "Interview Prep" },
];

const strengths = [
  "Strong TypeScript and React skills highlighted throughout",
  "GitHub and live project links present on all entries",
  "Quantified achievements with measurable outcomes",
];

const suggestions = [
  "Add a professional summary section at the top",
  "Include more backend technologies in your skills section",
  "Expand project descriptions with problem-solving context",
];

export default function AIAssistantLandingPreview() {
  return (
    <div className="min-h-full bg-[#0d0d18] p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
          <IconRobot size={16} stroke={1.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AI Assistant</p>
          <p className="text-[10px] text-slate-500">
            Powered by Gemini 2.5 Flash
          </p>
        </div>
      </div>

      {/* Tool cards */}
      <div className="mb-4 grid grid-cols-3 gap-1.5">
        {tools.map((tool) => (
          <div
            key={tool.label}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-2"
          >
            <span className="text-indigo-400">{tool.icon}</span>
            <span className="text-[10px] font-medium text-slate-400">
              {tool.label}
            </span>
          </div>
        ))}
      </div>

      {/* Resume review result preview */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
        {/* Score row */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-white">
            Resume Review Result
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-emerald-400">84</span>
            <span className="text-[10px] text-slate-500">/ 100</span>
            <span className="ml-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              Excellent
            </span>
          </div>
        </div>

        {/* Score bar */}
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-emerald-400"
            style={{ width: "84%" }}
          />
        </div>

        {/* Strengths */}
        <div className="mb-3">
          <div className="mb-2 flex items-center gap-1.5 text-emerald-400">
            <FaCheckCircle size={11} />
            <p className="text-[11px] font-semibold text-white">Strengths</p>
          </div>
          <ul className="space-y-1.5">
            {strengths.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400" />
                <span className="text-[11px] leading-relaxed text-slate-400">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-indigo-400">
            <FaLightbulb size={11} />
            <p className="text-[11px] font-semibold text-white">Suggestions</p>
          </div>
          <ul className="space-y-1.5">
            {suggestions.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400" />
                <span className="text-[11px] leading-relaxed text-slate-400">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Template badge */}
      <div className="mt-3 flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
        <span className="text-[11px] text-slate-500">Reviewed as</span>
        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-400">
          Developer Template
        </span>
      </div>
    </div>
  );
}
