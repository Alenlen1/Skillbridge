"use client";

import { useEffect, useState } from "react";
import { IconCheck, IconX, IconTrash, IconQuote } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { usePortfolioRefreshStore } from "@/lib/portfolio-refresh";

interface Endorsement {
  id: string;
  endorserName: string;
  endorserRole: string;
  endorserEmail: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function EndorsementsSection() {
  const { user } = useAuthStore();
  const bumpPortfolioRefresh = usePortfolioRefreshStore((s) => s.bump);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchEndorsements();
  }, []);

  // Live updates — a visitor submitting a new endorsement on the public
  // page (or an approval happening elsewhere) pushes here instantly,
  // instead of needing a manual refresh to see it.
  useEffect(() => {
    if (!user?.username) return;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const eventSource = new EventSource(
      `${apiUrl}/portfolio/${user.username}/live`,
    );

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "update") {
          fetchEndorsements();
        }
      } catch {
        // ignore malformed events (e.g. heartbeat comments)
      }
    };

    return () => eventSource.close();
  }, [user?.username]);

  const fetchEndorsements = async () => {
    try {
      const { data } = await api.get("/portfolio/me/endorsements");
      setEndorsements(data.data.endorsements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      setBusyId(id);
      await api.patch(`/portfolio/me/endorsements/${id}`, { status });
      setEndorsements((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e)),
      );
      // This only updates local state — nothing broadcasts an SSE event for
      // approve/reject, so nudge this on to let other sections (e.g. the
      // endorsement nudge) know they should refetch.
      bumpPortfolioRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setBusyId(id);
      await api.delete(`/portfolio/me/endorsements/${id}`);
      setEndorsements((prev) => prev.filter((e) => e.id !== id));
      // Same as above — deletion doesn't broadcast an SSE event either.
      bumpPortfolioRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  };

  const pending = endorsements.filter((e) => e.status === "PENDING");
  const reviewed = endorsements.filter((e) => e.status !== "PENDING");

  if (loading) {
    return (
      <section id="endorsements" className="mt-10 scroll-mt-6">
        <div className="h-24 animate-pulse rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]" />
      </section>
    );
  }

  return (
    <section id="endorsements" className="mt-10 scroll-mt-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Endorsements
        </h2>
        {pending.length > 0 && (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-500">
            {pending.length} pending
          </span>
        )}
      </div>
      <p className="mb-5 text-sm text-slate-500">
        Approve endorsements before they appear on your public portfolio.
      </p>

      {endorsements.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 dark:border-white/10 py-10 text-center">
          <IconQuote size={20} stroke={1.5} className="text-slate-400" />
          <p className="text-sm text-slate-500">
            No endorsements yet. Share your portfolio link and ask someone to
            leave one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4"
            >
              <p className="text-sm text-slate-700 dark:text-slate-200">
                &ldquo;{e.message}&rdquo;
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {e.endorserName}
                {e.endorserRole ? ` · ${e.endorserRole}` : ""} ·{" "}
                {e.endorserEmail}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleStatusChange(e.id, "APPROVED")}
                  disabled={busyId === e.id}
                  className="flex items-center gap-1 rounded-md bg-green-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-400 disabled:opacity-50"
                >
                  <IconCheck size={13} stroke={2} />
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(e.id, "REJECTED")}
                  disabled={busyId === e.id}
                  className="flex items-center gap-1 rounded-md border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
                >
                  <IconX size={13} stroke={2} />
                  Reject
                </button>
              </div>
            </div>
          ))}

          {reviewed.map((e) => (
            <div
              key={e.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-4"
            >
              <div className="min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  &ldquo;{e.message}&rdquo;
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {e.endorserName}
                  {e.endorserRole ? ` · ${e.endorserRole}` : ""}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    e.status === "APPROVED"
                      ? "bg-green-500/15 text-green-500"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {e.status === "APPROVED" ? "Approved" : "Rejected"}
                </span>
              </div>
              <button
                onClick={() => handleDelete(e.id)}
                disabled={busyId === e.id}
                title="Delete"
                className="flex-shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
              >
                <IconTrash size={14} stroke={1.75} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
