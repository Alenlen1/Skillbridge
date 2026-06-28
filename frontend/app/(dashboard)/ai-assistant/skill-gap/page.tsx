"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";
import { IconSparkles } from "@tabler/icons-react";
import api from "@/lib/api";

interface MissingSkill {
  name: string;
  priority: "high" | "medium" | "low";
  reason: string;
}

interface RecommendedResource {
  skill: string;
  resource: string;
}

interface SkillGapResult {
  score: number;
  targetRole: string;
  currentSkillsSummary: string;
  missingSkills: MissingSkill[];
  existingRelevantSkills: string[];
  recommendedResources: RecommendedResource[];
  suggestions: string[];
}

function ReadinessRing({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-yellow-400"
        : "text-red-400";
  const ringColor =
    score >= 80
      ? "stroke-emerald-400"
      : score >= 60
        ? "stroke-yellow-400"
        : "stroke-red-400";
  const label =
    score >= 80 ? "Role Ready" : score >= 60 ? "Almost There" : "Gap to Close";
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg
          className="-rotate-90"
          width="112"
          height="112"
          viewBox="0 0 88 88"
        >
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="7"
          />
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            className={ringColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
          <span className="text-[10px] text-slate-500">/ 100</span>
        </div>
      </div>
      <span className={`text-xs font-medium ${color}`}>{label}</span>
    </div>
  );
}

const PRIORITY_STYLES = {
  high: {
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
  medium: {
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    dot: "bg-yellow-400",
  },
  low: {
    badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    dot: "bg-slate-500",
  },
};

export default function SkillGapPage() {
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SkillGapResult | null>(null);

  const handleSubmit = async () => {
    if (!targetRole.trim()) {
      setError("Please enter a target role.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const { data } = await api.post("/ai/skill-gap", {
        targetRole: targetRole.trim(),
        jobDescription: jobDescription.trim() || undefined,
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
    setTargetRole("");
    setJobDescription("");
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
            <h1 className="text-xl font-semibold text-white">
              Skill Gap Analysis
            </h1>
            <p className="text-xs text-slate-500">
              Compare your current skills against your target role and find out
              what to learn next
            </p>
          </div>
        </div>
      </div>

      {!result && (
        <div className="space-y-5">
          {/* Target role input */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Target Role <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Developer, Full Stack Engineer, DevOps Engineer"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
            />
          </div>

          {/* Job description input */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Job Description{" "}
              <span className="text-slate-600">(optional but recommended)</span>
            </label>
            <p className="mb-3 text-xs text-slate-600">
              Paste a real job posting to get a more accurate skill gap based on
              exact requirements.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
            />
          </div>

          <p className="text-xs text-slate-600">
            Your saved skills from your portfolio will be pulled automatically.
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
            disabled={loading || !targetRole.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Analyzing skill gap...
              </>
            ) : (
              <>
                <IconSparkles size={16} stroke={1.5} />
                Analyze My Skills
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Score card */}
          <div className="flex flex-col items-center gap-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 sm:flex-row sm:items-start">
            <ReadinessRing score={result.score} />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="mb-1 text-base font-semibold text-white">
                Readiness for{" "}
                <span className="text-indigo-400">{result.targetRole}</span>
              </h2>
              <p className="mb-3 text-xs leading-relaxed text-slate-400">
                {result.currentSkillsSummary}
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-slate-400">
                  {result.existingRelevantSkills.length} relevant skills
                </span>
                <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-slate-400">
                  {result.missingSkills.length} skills to learn
                </span>
              </div>
            </div>
          </div>

          {/* Existing relevant skills */}
          {result.existingRelevantSkills.length > 0 && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
              <div className="mb-4 flex items-center gap-2 text-emerald-400">
                <FaCheckCircle size={14} />
                <h3 className="text-sm font-semibold text-white">
                  Skills You Already Have
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.existingRelevantSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing skills */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center gap-2 text-red-400">
              <FaExclamationCircle size={14} />
              <h3 className="text-sm font-semibold text-white">
                Skills to Learn
              </h3>
            </div>
            <div className="space-y-3">
              {result.missingSkills.map((skill) => {
                const styles = PRIORITY_STYLES[skill.priority];
                return (
                  <div
                    key={skill.name}
                    className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3"
                  >
                    <span
                      className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${styles.dot} mt-1.5`}
                    />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {skill.name}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles.badge}`}
                        >
                          {skill.priority}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-500">
                        {skill.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended resources */}
          {result.recommendedResources.length > 0 && (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.05] p-5">
              <div className="mb-4 flex items-center gap-2 text-indigo-400">
                <FaLightbulb size={14} />
                <h3 className="text-sm font-semibold text-white">
                  Recommended Resources
                </h3>
              </div>
              <div className="space-y-2.5">
                {result.recommendedResources.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <FaArrowRight
                      className="mt-0.5 flex-shrink-0 text-indigo-400"
                      size={10}
                    />
                    <div>
                      <span className="text-xs font-medium text-white">
                        {r.skill}:{" "}
                      </span>
                      <span className="text-xs text-slate-400">
                        {r.resource}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center gap-2 text-slate-400">
                <FaLightbulb size={14} />
                <h3 className="text-sm font-semibold text-white">Next Steps</h3>
              </div>
              <ul className="space-y-2.5">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-500" />
                    <span className="text-xs leading-relaxed text-slate-300">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-sm text-slate-400 transition-colors hover:border-white/[0.14] hover:text-white"
            >
              Analyze Another Role
            </button>
            <Link
              href="/portfolio"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500/10 py-2.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
            >
              Update My Skills
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
