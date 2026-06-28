"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";
import { IconSparkles } from "@tabler/icons-react";
import api from "@/lib/api";

interface ReviewResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

function ScoreMeter({ score }: { score: number }) {
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
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";
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

function ResultSection({
  icon,
  title,
  items,
  variant,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  variant: "strength" | "weakness" | "suggestion";
}) {
  const colors = {
    strength: {
      icon: "text-emerald-400",
      dot: "bg-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/[0.05]",
    },
    weakness: {
      icon: "text-red-400",
      dot: "bg-red-400",
      border: "border-red-500/20",
      bg: "bg-red-500/[0.05]",
    },
    suggestion: {
      icon: "text-indigo-400",
      dot: "bg-indigo-400",
      border: "border-indigo-500/20",
      bg: "bg-indigo-500/[0.05]",
    },
  };
  const c = colors[variant];

  return (
    <div className={`rounded-xl border p-5 ${c.border} ${c.bg}`}>
      <div className={`mb-4 flex items-center gap-2 ${c.icon}`}>
        {icon}
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${c.dot}`}
            />
            <span className="text-xs leading-relaxed text-slate-300">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PortfolioReviewPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);

  const handleReview = async () => {
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const { data } = await api.post("/ai/portfolio-review");

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
              Portfolio Review
            </h1>
            <p className="text-xs text-slate-500">
              AI analysis of your SkillBridge portfolio based on your current
              data
            </p>
          </div>
        </div>
      </div>

      {!result && (
        <div className="space-y-5">
          {/* Info card */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center gap-2 text-indigo-400">
              <FaBriefcase size={14} />
              <h2 className="text-sm font-semibold text-white">
                What gets reviewed
              </h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "Profile completeness (headline, bio, location)",
                "Skills and their presentation",
                "Project descriptions and tech stack",
                "Work experience and descriptions",
                "Education background",
                "Social and professional links",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <FaCheckCircle
                    className="mt-0.5 flex-shrink-0 text-indigo-400"
                    size={11}
                  />
                  <span className="text-xs text-slate-400">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-600">
              Your portfolio data is pulled automatically — no manual input
              required.
            </p>
          </div>

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

          {/* CTA */}
          <button
            onClick={handleReview}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Analyzing your portfolio...
              </>
            ) : (
              <>
                <IconSparkles size={16} stroke={1.5} />
                Review My Portfolio
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Score card */}
          <div className="flex flex-col items-center gap-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 sm:flex-row sm:items-start">
            <ScoreMeter score={result.score} />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="mb-1 text-base font-semibold text-white">
                Overall Portfolio Score
              </h2>
              <p className="mb-3 text-xs text-slate-400">
                Scored based on profile completeness, project quality, skill
                presentation, and overall recruiter impression.
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-slate-400">
                  {result.strengths.length} strengths found
                </span>
                <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-slate-400">
                  {result.weaknesses.length} areas to improve
                </span>
                <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-slate-400">
                  {result.suggestions.length} suggestions
                </span>
              </div>
            </div>
          </div>

          <ResultSection
            icon={<FaCheckCircle size={14} />}
            title="Strengths"
            items={result.strengths}
            variant="strength"
          />
          <ResultSection
            icon={<FaTimesCircle size={14} />}
            title="Weaknesses"
            items={result.weaknesses}
            variant="weakness"
          />
          <ResultSection
            icon={<FaLightbulb size={14} />}
            title="Suggestions for Improvement"
            items={result.suggestions}
            variant="suggestion"
          />

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-sm text-slate-400 transition-colors hover:border-white/[0.14] hover:text-white"
            >
              Review Again
            </button>
            <Link
              href="/portfolio"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500/10 py-2.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
            >
              <FaRocket size={12} />
              Go to Portfolio Builder
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
