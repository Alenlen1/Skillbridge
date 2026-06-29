"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaTimesCircle,
  FaFileAlt,
  FaTrash,
  FaUpload,
  FaCopy,
  FaCheck,
  FaLightbulb,
} from "react-icons/fa";
import { IconSparkles } from "@tabler/icons-react";
import api from "@/lib/api";

interface CoverLetterResult {
  coverLetter: string;
  highlights: string[];
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
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${
        dragging
          ? "border-indigo-500/60 bg-indigo-500/[0.08]"
          : "border-white/[0.08] hover:border-indigo-500/40 hover:bg-indigo-500/[0.04]"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500">
        <FaUpload size={16} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-300">
          Drop your resume or <span className="text-indigo-400">browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-600">
          PDF or DOCX — optional, falls back to your portfolio
        </p>
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

export default function CoverLetterPage() {
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      setError("Please enter the company name.");
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      setError("Please paste the job description (at least 50 characters).");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("companyName", companyName.trim());
      formData.append("jobDescription", jobDescription.trim());
      if (file) formData.append("resume", file);

      const { data } = await api.post("/ai/cover-letter", formData, {
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

  const handleCopy = async () => {
    if (!result?.coverLetter) return;
    await navigator.clipboard.writeText(result.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setCompanyName("");
    setJobDescription("");
    setFile(null);
    setCopied(false);
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
              Cover Letter Generator
            </h1>
            <p className="text-xs text-slate-500">
              Generate a tailored cover letter based on the job description and
              your background
            </p>
          </div>
        </div>
      </div>

      {!result && (
        <div className="space-y-5">
          {/* Company name */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Shopify, Acme Corp"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
            />
          </div>

          {/* Job description */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Job Description <span className="text-red-400">*</span>
            </label>
            <p className="mb-3 text-xs text-slate-600">
              Paste the full job posting for the most tailored result.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
            />
          </div>

          {/* Resume upload */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Resume <span className="text-slate-600">(optional)</span>
            </label>
            <FileDropzone
              file={file}
              onFile={setFile}
              onClear={() => setFile(null)}
            />
            {!file && (
              <p className="mt-2 text-xs text-slate-600">
                No file? Your portfolio data will be used automatically.
              </p>
            )}
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

          <button
            onClick={handleSubmit}
            disabled={loading || !companyName.trim() || !jobDescription.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Generating cover letter...
              </>
            ) : (
              <>
                <IconSparkles size={16} stroke={1.5} />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Highlights */}
          {result.highlights.length > 0 && (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.05] p-5">
              <div className="mb-4 flex items-center gap-2 text-indigo-400">
                <FaLightbulb size={14} />
                <h3 className="text-sm font-semibold text-white">
                  Key Selling Points
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cover letter */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Cover Letter</h3>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  copied
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-white/[0.05] text-slate-400 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {copied ? (
                  <>
                    <FaCheck size={11} />
                    Copied
                  </>
                ) : (
                  <>
                    <FaCopy size={11} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="px-5 py-5">
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                {result.coverLetter}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-sm text-slate-400 transition-colors hover:border-white/[0.14] hover:text-white"
            >
              Generate Another
            </button>
            <button
              onClick={handleCopy}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500/10 py-2.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
            >
              <FaCopy size={12} />
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
