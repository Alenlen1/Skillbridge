"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  FaFilePdf,
  FaUserGraduate,
  FaLaptopCode,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaChevronLeft,
  FaUpload,
  FaFileAlt,
  FaTrash,
} from "react-icons/fa";
import { IconSparkles } from "@tabler/icons-react";
import api from "@/lib/api";

type Template = "ats" | "developer" | "student";

interface ReviewResult {
  score: number;
  template: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

const TEMPLATES: {
  id: Template;
  name: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "ats",
    name: "ATS Professional",
    description: "Optimized for applicant tracking systems",
    icon: <FaFilePdf size={18} />,
  },
  {
    id: "developer",
    name: "Developer",
    description: "Technical layout focused on skills and projects",
    icon: <FaLaptopCode size={18} />,
  },
  {
    id: "student",
    name: "Student",
    description: "Academic-first layout for new graduates",
    icon: <FaUserGraduate size={18} />,
  },
];

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

function FileDropzone({
  file,
  onFile,
  onClear,
}: {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/[0.06] px-4 py-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
          <FaFileAlt size={18} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium text-white">{file.name}</p>
          <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
        </div>
        <button
          onClick={onClear}
          className="flex-shrink-0 text-slate-500 transition-colors hover:text-red-400"
        >
          <FaTrash size={13} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
        dragging
          ? "border-indigo-500/60 bg-indigo-500/[0.08]"
          : "border-white/[0.08] hover:border-indigo-500/40 hover:bg-indigo-500/[0.04]"
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500">
        <FaUpload size={18} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-300">
          Drop your resume here or{" "}
          <span className="text-indigo-400">browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-600">PDF or DOCX — max 5MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
}

export default function ResumeReviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>("ats");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload your resume file before reviewing.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("template", selectedTemplate);

      const { data } = await api.post("/ai/resume-review", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
    setFile(null);
    setError("");
  };

  return (
    <div>
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
            <h1 className="text-xl font-semibold text-white">Resume Review</h1>
            <p className="text-xs text-slate-500">
              Upload your resume and select its template for an accurate AI
              review
            </p>
          </div>
        </div>
      </div>

      {!result && (
        <div className="space-y-5">
          {/* Template selector */}
          <div>
            <label className="mb-3 block text-xs font-medium text-slate-400">
              Resume Template
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                    selectedTemplate === t.id
                      ? "border-indigo-500/50 bg-indigo-500/10"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`mt-0.5 ${selectedTemplate === t.id ? "text-indigo-400" : "text-slate-600"}`}
                  >
                    {t.icon}
                  </span>
                  <div>
                    <p
                      className={`text-sm font-medium ${selectedTemplate === t.id ? "text-white" : "text-slate-400"}`}
                    >
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {t.description}
                    </p>
                  </div>
                  {selectedTemplate === t.id && (
                    <span className="ml-auto mt-0.5 text-indigo-400">
                      <FaCheckCircle size={13} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* File upload */}
          <div>
            <label className="mb-3 block text-xs font-medium text-slate-400">
              Resume File
            </label>
            <FileDropzone
              file={file}
              onFile={setFile}
              onClear={() => setFile(null)}
            />
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

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Analyzing your resume...
              </>
            ) : (
              <>
                <IconSparkles size={16} stroke={1.5} />
                Review My Resume
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 sm:flex-row sm:items-start">
            <ScoreMeter score={result.score} />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="mb-1 text-base font-semibold text-white">
                Overall Resume Score
              </h2>
              <p className="mb-3 text-xs text-slate-400">
                Reviewed as a{" "}
                <span className="font-medium text-indigo-400">
                  {result.template}
                </span>{" "}
                resume. Scores are based on structure, content quality, template
                alignment, and recruiter readability.
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

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-sm text-slate-400 transition-colors hover:border-white/[0.14] hover:text-white"
            >
              Review Another Resume
            </button>
            <Link
              href="/resume"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500/10 py-2.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
            >
              Go to Resume Builder
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
