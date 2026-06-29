"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaTimesCircle,
  FaComments,
  FaCode,
  FaUserTie,
  FaSitemap,
  FaLightbulb,
} from "react-icons/fa";
import { IconSparkles } from "@tabler/icons-react";
import api from "@/lib/api";

interface InterviewQuestion {
  question: string;
  type: "technical" | "behavioral" | "situational";
  tip: string;
}

interface InterviewPrepResult {
  targetRole: string;
  summary: string;
  questions: InterviewQuestion[];
  generalTips: string[];
}

const TYPE_STYLES = {
  technical: {
    label: "Technical",
    icon: <FaCode size={10} />,
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    dot: "bg-indigo-400",
  },
  behavioral: {
    label: "Behavioral",
    icon: <FaUserTie size={10} />,
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  situational: {
    label: "Situational",
    icon: <FaSitemap size={10} />,
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    dot: "bg-yellow-400",
  },
};

export default function InterviewPrepPage() {
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<InterviewPrepResult | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!targetRole.trim()) {
      setError("Please enter a target role.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);
    setExpanded(null);

    try {
      const { data } = await api.post("/ai/interview-prep", {
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
    setExpanded(null);
  };

  const technicalCount =
    result?.questions.filter((q) => q.type === "technical").length ?? 0;
  const behavioralCount =
    result?.questions.filter((q) => q.type === "behavioral").length ?? 0;
  const situationalCount =
    result?.questions.filter((q) => q.type === "situational").length ?? 0;

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
            <h1 className="text-xl font-semibold text-white">Interview Prep</h1>
            <p className="text-xs text-slate-500">
              Get role-specific interview questions with expert tips tailored to
              your skills
            </p>
          </div>
        </div>
      </div>

      {!result && (
        <div className="space-y-5">
          {/* Target role */}
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

          {/* Job description */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Job Description{" "}
              <span className="text-slate-600">(optional but recommended)</span>
            </label>
            <p className="mb-3 text-xs text-slate-600">
              Paste a real job posting to get questions tailored to that
              specific role.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={7}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
            />
          </div>

          <p className="text-xs text-slate-600">
            Your saved skills will be pulled automatically to personalize the
            questions.
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
                Generating questions...
              </>
            ) : (
              <>
                <IconSparkles size={16} stroke={1.5} />
                Generate Interview Questions
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Summary card */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center gap-2 text-indigo-400">
              <FaComments size={14} />
              <h2 className="text-sm font-semibold text-white">
                Interview Prep for{" "}
                <span className="text-indigo-400">{result.targetRole}</span>
              </h2>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-slate-400">
              {result.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400">
                {technicalCount} Technical
              </span>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                {behavioralCount} Behavioral
              </span>
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                {situationalCount} Situational
              </span>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-2">
            {result.questions.map((q, index) => {
              const style = TYPE_STYLES[q.type];
              const isOpen = expanded === index;

              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : index)}
                    className="flex w-full items-start gap-3 px-4 py-4 text-left"
                  >
                    <span className="mt-0.5 flex-shrink-0 text-xs font-bold text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {q.question}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <span
                        className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${style.badge}`}
                      >
                        {style.icon}
                        {style.label}
                      </span>
                      <svg
                        className={`h-3.5 w-3.5 flex-shrink-0 text-slate-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/[0.06] px-4 py-4">
                      <div className="flex items-start gap-2.5">
                        <FaLightbulb
                          className="mt-0.5 flex-shrink-0 text-indigo-400"
                          size={12}
                        />
                        <div>
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            How to answer
                          </p>
                          <p className="text-xs leading-relaxed text-slate-300">
                            {q.tip}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* General tips */}
          {result.generalTips.length > 0 && (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.05] p-5">
              <div className="mb-4 flex items-center gap-2 text-indigo-400">
                <FaLightbulb size={13} />
                <h3 className="text-sm font-semibold text-white">
                  General Interview Tips
                </h3>
              </div>
              <ul className="space-y-2.5">
                {result.generalTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                    <span className="text-xs leading-relaxed text-slate-300">
                      {tip}
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
              Prep for Another Role
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
