"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaTimesCircle,
  FaCode,
  FaUserTie,
  FaSitemap,
  FaCircle,
  FaTrash,
} from "react-icons/fa";
import { IconSparkles } from "@tabler/icons-react";
import api from "@/lib/api";

interface SessionSummary {
  id: string;
  targetRole: string;
  status: "in_progress" | "completed" | "abandoned";
  overallScore: number | null;
  createdAt: string;
  completedAt: string | null;
  _count: { questions: number };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const scoreColor = (score: number | null) => {
  if (score === null) return "text-slate-400";
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

const STALE_DAYS = 3;
const isStale = (createdAt: string) => {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs > STALE_DAYS * 24 * 60 * 60 * 1000;
};

export default function InterviewHistoryPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SessionSummary | null>(
    null,
  );

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/interview/history");
        if (data.success) {
          setSessions(data.data);
        } else {
          setError(data.error?.message || "Could not load interview history.");
        }
      } catch {
        setError("Failed to load your interview history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDeleteClick = (e: React.MouseEvent, session: SessionSummary) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingDelete(session);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const sessionId = pendingDelete.id;

    setDeletingId(sessionId);
    setPendingDelete(null);
    try {
      const { data } = await api.delete(`/interview/${sessionId}`);
      if (data.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } else {
        setError(data.error?.message || "Could not delete this session.");
      }
    } catch {
      setError("Failed to delete this session. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const averageScore =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) /
            completedSessions.length,
        )
      : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <Link
          href="/ai-assistant/interview-prep"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          <FaChevronLeft size={10} />
          Interview Prep
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <IconSparkles size={18} stroke={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">
              Interview History
            </h1>
            <p className="text-xs text-slate-500">
              Review your past mock interview sessions and track your progress
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
          <FaTimesCircle
            className="mt-0.5 flex-shrink-0 text-red-400"
            size={14}
          />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {!loading && !error && sessions.length === 0 && (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
            <IconSparkles size={20} stroke={1.5} />
          </div>
          <p className="mb-1 text-sm font-medium text-white">
            No interview sessions yet
          </p>
          <p className="mb-5 text-xs text-slate-500">
            Generate interview questions and start practicing to see your
            history here.
          </p>
          <Link
            href="/ai-assistant/interview-prep"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          >
            <IconSparkles size={14} stroke={1.5} />
            Start Interview Prep
          </Link>
        </div>
      )}

      {!loading && !error && sessions.length > 0 && (
        <div className="space-y-5">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
              <p className="text-2xl font-bold text-white">{sessions.length}</p>
              <p className="text-[11px] text-slate-500">Total Sessions</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {completedSessions.length}
              </p>
              <p className="text-[11px] text-slate-500">Completed</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
              <p className={`text-2xl font-bold ${scoreColor(averageScore)}`}>
                {averageScore !== null ? averageScore : "—"}
              </p>
              <p className="text-[11px] text-slate-500">Avg Score</p>
            </div>
          </div>

          {/* Sessions list */}
          <div className="space-y-2.5">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/ai-assistant/interview-prep/practice/${session.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04]"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-white">
                      {session.targetRole}
                    </p>
                    {session.status === "in_progress" && (
                      <span className="flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
                        <FaCircle size={5} />
                        In Progress
                      </span>
                    )}
                    {session.status === "in_progress" &&
                      isStale(session.createdAt) && (
                        <span className="rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                          Inactive
                        </span>
                      )}
                    {session.status === "abandoned" && (
                      <span className="flex items-center gap-1 rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        <FaCircle size={5} />
                        Abandoned
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {formatDate(session.createdAt)} · {session._count.questions}{" "}
                    questions
                  </p>
                </div>
                {session.overallScore !== null && (
                  <div className="flex-shrink-0 text-right">
                    <p
                      className={`text-lg font-bold ${scoreColor(session.overallScore)}`}
                    >
                      {session.overallScore}
                    </p>
                    <p className="text-[10px] text-slate-600">/ 100</p>
                  </div>
                )}
                <button
                  onClick={(e) => handleDeleteClick(e, session)}
                  disabled={deletingId === session.id}
                  className="flex-shrink-0 rounded-lg p-2 text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  aria-label="Delete session"
                >
                  {deletingId === session.id ? (
                    <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-red-400" />
                  ) : (
                    <FaTrash size={12} />
                  )}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setPendingDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0d0d14] p-6 shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <FaTrash size={18} />
            </div>
            <h3 className="mb-2 text-center text-base font-semibold text-white">
              Delete interview session?
            </h3>
            <p className="mb-6 text-center text-xs leading-relaxed text-slate-400">
              You&apos;re about to delete your{" "}
              <span className="font-medium text-slate-300">
                {pendingDelete.targetRole}
              </span>{" "}
              session and all its answers and feedback. This can&apos;t be
              undone.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setPendingDelete(null)}
                className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-sm text-slate-300 transition-colors hover:border-white/[0.14] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
