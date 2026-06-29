"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaTimesCircle,
  FaCheckCircle,
  FaFlag,
  FaLightbulb,
  FaRoad,
} from "react-icons/fa";
import { IconSparkles } from "@tabler/icons-react";
import api from "@/lib/api";

interface RoadmapMilestone {
  title: string;
  duration: string;
  description: string;
  skills: string[];
  actions: string[];
}

interface RoadmapResult {
  summary: string;
  estimatedTimeline: string;
  milestones: RoadmapMilestone[];
  finalGoal: string;
}

const EXPERIENCE_OPTIONS = [
  { value: "0-1 years", label: "0 - 1 year" },
  { value: "1-3 years", label: "1 - 3 years" },
  { value: "3-5 years", label: "3 - 5 years" },
  { value: "5+ years", label: "5+ years" },
];

const MILESTONE_COLORS = [
  {
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/[0.06]",
    dot: "bg-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-400",
  },
  {
    border: "border-violet-500/30",
    bg: "bg-violet-500/[0.06]",
    dot: "bg-violet-400",
    badge: "bg-violet-500/10 text-violet-400",
  },
  {
    border: "border-blue-500/30",
    bg: "bg-blue-500/[0.06]",
    dot: "bg-blue-400",
    badge: "bg-blue-500/10 text-blue-400",
  },
  {
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/[0.06]",
    dot: "bg-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-400",
  },
  {
    border: "border-teal-500/30",
    bg: "bg-teal-500/[0.06]",
    dot: "bg-teal-400",
    badge: "bg-teal-500/10 text-teal-400",
  },
  {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/[0.06]",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400",
  },
];

export default function RoadmapPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RoadmapResult | null>(null);

  const handleSubmit = async () => {
    if (!currentRole.trim()) {
      setError("Please enter your current role.");
      return;
    }
    if (!targetRole.trim()) {
      setError("Please enter your target role.");
      return;
    }
    if (!yearsOfExperience) {
      setError("Please select your years of experience.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const { data } = await api.post("/ai/roadmap", {
        currentRole: currentRole.trim(),
        targetRole: targetRole.trim(),
        yearsOfExperience,
      });

      if (data.success) {
        setResult(data.data);
      } else {
        setError(
          data.error?.message || "Something went wrong. Please try again.",
        );
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        "Failed to connect to the AI service. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setCurrentRole("");
    setTargetRole("");
    setYearsOfExperience("");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <Link
          href="/ai-assistant"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          <FaChevronLeft size={10} />
          AI Assistant
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <IconSparkles size={18} stroke={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Career Roadmap</h1>
            <p className="text-xs text-slate-500">
              Get a personalized step-by-step path from where you are to where
              you want to be
            </p>
          </div>
        </div>
      </div>

      {!result && (
        <div className="space-y-5">
          {/* Current role */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Current Role <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g. Junior Frontend Developer, CS Student, Bootcamp Graduate"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
            />
          </div>

          {/* Target role */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Target Role <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer, DevOps Engineer, Tech Lead"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
            />
          </div>

          {/* Years of experience */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Years of Experience <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setYearsOfExperience(opt.value)}
                  className={`rounded-xl border py-3 text-sm transition-colors ${
                    yearsOfExperience === opt.value
                      ? "border-indigo-500/50 bg-indigo-500/10 font-medium text-white"
                      : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.12] hover:bg-white/[0.04]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Your saved skills will be pulled automatically to personalize the
            roadmap.
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
              <FaTimesCircle
                className="mt-0.5 flex-shrink-0 text-red-400"
                size={14}
              />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !currentRole.trim() ||
              !targetRole.trim() ||
              !yearsOfExperience
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Building your roadmap...
              </>
            ) : (
              <>
                <IconSparkles size={16} stroke={1.5} />
                Generate My Roadmap
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Summary card */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400">
                <FaRoad size={14} />
                <h2 className="text-sm font-semibold text-white">
                  Your Career Path
                </h2>
              </div>
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                {result.estimatedTimeline}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {result.summary}
            </p>
          </div>

          {/* Milestones */}
          <div className="space-y-3">
            {result.milestones.map((milestone, index) => {
              const color = MILESTONE_COLORS[index % MILESTONE_COLORS.length];
              return (
                <div
                  key={index}
                  className={`rounded-xl border p-5 ${color.border} ${color.bg}`}
                >
                  {/* Milestone header */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${color.badge}`}
                      >
                        <span className="text-[10px] font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        {milestone.title}
                      </h3>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${color.badge}`}
                    >
                      {milestone.duration}
                    </span>
                  </div>

                  <p className="mb-4 text-xs leading-relaxed text-slate-400">
                    {milestone.description}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Skills */}
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Skills to Learn
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {milestone.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </p>
                      <ul className="space-y-1.5">
                        {milestone.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <FaCheckCircle
                              className={`mt-0.5 flex-shrink-0 ${color.badge.split(" ")[1]}`}
                              size={10}
                            />
                            <span className="text-xs leading-relaxed text-slate-300">
                              {action}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final goal */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
            <div className="mb-2 flex items-center gap-2 text-emerald-400">
              <FaFlag size={13} />
              <h3 className="text-sm font-semibold text-white">End Goal</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              {result.finalGoal}
            </p>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start gap-2.5">
              <FaLightbulb
                className="mt-0.5 flex-shrink-0 text-yellow-400"
                size={12}
              />
              <p className="text-xs leading-relaxed text-slate-500">
                This roadmap is based on your current skills and experience
                level. As you progress, revisit the Skill Gap Analysis tool to
                track what you have learned and update your portfolio skills
                accordingly.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-sm text-slate-400 transition-colors hover:border-white/[0.14] hover:text-white"
            >
              Generate Another Roadmap
            </button>
            <Link
              href="/ai-assistant/skill-gap"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500/10 py-2.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
            >
              <IconSparkles size={14} stroke={1.5} />
              Run Skill Gap Analysis
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
