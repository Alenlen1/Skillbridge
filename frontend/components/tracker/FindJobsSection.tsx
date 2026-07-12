"use client";

import { useState, useEffect } from "react";
import {
  IconSearch,
  IconMapPin,
  IconExternalLink,
  IconPlus,
} from "@tabler/icons-react";
import api from "@/lib/api";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  tags: string[];
  url: string;
  postedAt: string | null;
  source: "Jooble";
}

interface FindJobsSectionProps {
  onTrack: (company: string, role: string) => void;
}

// Location bias stays fixed and hidden — no visible input for it
const DEFAULT_LOCATION = "Philippines";

export default function FindJobsSection({ onTrack }: FindJobsSectionProps) {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const runSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/jobs/search", {
        params: { q: searchQuery, location: DEFAULT_LOCATION },
      });
      setJobs(data.data.jobs || []);
      setSearched(true);
    } catch (err: unknown) {
      const e2 = err as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(
        e2.response?.data?.error?.message ||
          "Couldn't load job listings right now. Try again in a bit.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    runSearch(query);
  };

  // Show some listings right away when the tab opens, instead of making
  // people type something before they see anything at all. Defaults to
  // an IT/tech-focused term since that's SkillBridge's actual audience —
  // a generic term like "job" pulls totally unrelated results (server,
  // bartender, etc).
  useEffect(() => {
    runSearch("software developer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-3">
        <div className="relative max-w-md flex-1">
          <IconSearch
            size={16}
            stroke={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search job title, company, or skill..."
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]"
            />
          ))}
        </div>
      ) : !searched ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-600">
            Search real job listings from across the web
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-600">
            No listings found{query ? ` for "${query}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {job.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {job.company}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-600">
                    <IconMapPin size={12} stroke={1.75} />
                    {job.location}
                    {job.remote && (
                      <span className="ml-1 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] font-medium text-green-500">
                        Remote
                      </span>
                    )}
                  </div>
                  {job.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-shrink-0 flex-col gap-2">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-400"
                  >
                    Apply
                    <IconExternalLink size={12} stroke={2} />
                  </a>
                  <button
                    onClick={() => onTrack(job.company, job.title)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:border-indigo-500/40 hover:text-indigo-400"
                  >
                    <IconPlus size={12} stroke={2} />
                    Track
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}