"use client";

import { useEffect, useState } from "react";
import { IconQuote, IconClock, IconCopy, IconCheck } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { usePortfolioRefreshStore } from "@/lib/portfolio-refresh";

interface Endorsement {
  status: "PENDING" | "APPROVED" | "REJECTED";
}

// Surfaces at the top of the Portfolio dashboard to keep the endorsements
// feature visible, whatever state it's in — instead of only appearing once
// (at zero) and then disappearing the moment anything comes in. Fetches its
// own (small) count independently of EndorsementsSection so it can render
// above the fold without waiting on the rest of the form.
export default function EndorsementNudge() {
  const { user } = useAuthStore();
  const refreshVersion = usePortfolioRefreshStore((s) => s.version);
  const [endorsements, setEndorsements] = useState<Endorsement[] | null>(null); // null = still loading
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchEndorsements = async () => {
      try {
        const { data } = await api.get("/portfolio/me/endorsements");
        if (!cancelled) setEndorsements(data.data.endorsements);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEndorsements();

    if (!user?.username) {
      return () => {
        cancelled = true;
      };
    }

    // Live updates — if a visitor submits an endorsement while this is on
    // screen, the message updates without needing a refresh.
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const eventSource = new EventSource(
      `${apiUrl}/portfolio/${user.username}/live`,
    );

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "update") fetchEndorsements();
      } catch {
        // ignore malformed events (e.g. heartbeat comments)
      }
    };

    return () => {
      cancelled = true;
      eventSource.close();
    };
    // refreshVersion: catches approve/reject/delete actions taken in
    // EndorsementsSection, which only update local state and don't go
    // through the SSE broadcast above.
  }, [user?.username, refreshVersion]);

  const handleCopy = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const link = `${appUrl}/${user?.username}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReview = () => {
    document
      .getElementById("endorsements")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Stay invisible while loading
  if (endorsements === null) return null;

  const approvedCount = endorsements.filter(
    (e) => e.status === "APPROVED",
  ).length;
  const pendingCount = endorsements.filter(
    (e) => e.status === "PENDING",
  ).length;

  // Nothing submitted at all yet — plain call to action to go share the link
  if (approvedCount === 0 && pendingCount === 0) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-indigo-500/20 bg-indigo-500/[0.06] px-4 py-3 text-sm">
        <div className="flex items-center gap-2.5">
          <IconQuote
            size={16}
            stroke={1.75}
            className="flex-shrink-0 text-indigo-400"
          />
          <p className="text-slate-700 dark:text-slate-300">
            You have 0 endorsements yet — share your portfolio link and ask
            someone to leave one.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-400"
        >
          {copied ? (
            <>
              <IconCheck size={13} stroke={2} />
              Copied
            </>
          ) : (
            <>
              <IconCopy size={13} stroke={2} />
              Copy link
            </>
          )}
        </button>
      </div>
    );
  }

  // Endorsements are sitting in the queue but none are live yet — nudge
  // toward reviewing them, since that's the blocker, not sharing the link.
  if (approvedCount === 0 && pendingCount > 0) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-sm">
        <div className="flex items-center gap-2.5">
          <IconClock
            size={16}
            stroke={1.75}
            className="flex-shrink-0 text-amber-400"
          />
          <p className="text-slate-700 dark:text-slate-300">
            You have {pendingCount} endorsement{pendingCount === 1 ? "" : "s"}{" "}
            awaiting your approval — review {pendingCount === 1 ? "it" : "them"}{" "}
            to get {pendingCount === 1 ? "it" : "them"} live on your public
            portfolio.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReview}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-400"
        >
          Review now
        </button>
      </div>
    );
  }

  // At least one live endorsement — keep the momentum going instead of
  // going quiet now that the feature has been proven out.
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-sm">
      <div className="flex items-center gap-2.5">
        <IconQuote
          size={16}
          stroke={1.75}
          className="flex-shrink-0 text-green-500"
        />
        <p className="text-slate-700 dark:text-slate-300">
          You have {approvedCount} endorsement{approvedCount === 1 ? "" : "s"}{" "}
          live on your portfolio
          {pendingCount > 0
            ? ` (and ${pendingCount} more awaiting review)`
            : ""}{" "}
          — keep sharing your link to get more.
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex flex-shrink-0 items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-500"
      >
        {copied ? (
          <>
            <IconCheck size={13} stroke={2} />
            Copied
          </>
        ) : (
          <>
            <IconCopy size={13} stroke={2} />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
