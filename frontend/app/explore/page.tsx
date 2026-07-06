"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconSearch,
  IconMapPin,
  IconArrowRight,
  IconDownload,
} from "@tabler/icons-react";
import api from "@/lib/api";

interface DirectoryEntry {
  headline: string | null;
  location: string | null;
  updatedAt: string;
  user: {
    name: string | null;
    username: string;
    avatar: string | null;
  };
  skills: { name: string }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type SortOption = "recent" | "skills" | "name";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Recently updated",
  skills: "Most skills listed",
  name: "Name (A-Z)",
};

const PAGE_SIZE = 20;
const NEW_THRESHOLD_DAYS = 7;

function isRecentlyUpdated(updatedAt: string): boolean {
  const days =
    (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= NEW_THRESHOLD_DAYS;
}

export default function ExplorePage() {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("recent");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [topSkills, setTopSkills] = useState<string[]>([]);
  const [downloadingUsername, setDownloadingUsername] = useState<string | null>(
    null,
  );

  const handleDownloadResume = async (
    e: React.MouseEvent,
    username: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (downloadingUsername) return;

    try {
      setDownloadingUsername(username);
      const { data } = await api.get(`/portfolio/${username}`);
      const p = data.data;

      const resumeData = {
        name: p.name || p.username,
        username: p.username,
        email: "",
        headline: p.portfolio?.headline ?? null,
        about: p.portfolio?.about ?? null,
        location: p.portfolio?.location ?? null,
        website: p.portfolio?.website ?? null,
        phone: null,
        skills: p.portfolio?.skills || [],
        education: p.portfolio?.education || [],
        experience: p.portfolio?.experience || [],
        projects: p.portfolio?.projects || [],
        certificates: p.certificates || [],
        socialLinks: p.portfolio?.socialLinks || [],
      };

      const { pdf } = await import("@react-pdf/renderer");
      const { default: ResumeATS } =
        await import("@/components/resume/ResumeATS");
      const blob = await pdf(<ResumeATS data={resumeData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}-resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download resume:", err);
    } finally {
      setDownloadingUsername(null);
    }
  };

  const fetchPortfolios = useCallback(
    async (
      searchTerm: string,
      skills: string[],
      pageNum: number,
      sortOption: SortOption,
    ) => {
      try {
        setLoading(true);
        const { data } = await api.get("/portfolio/explore", {
          params: {
            search: searchTerm,
            skills: skills.join(","),
            page: pageNum,
            limit: PAGE_SIZE,
            sort: sortOption,
          },
        });
        setEntries(data.data.portfolios);
        setPagination(data.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch top skill chips once on mount
  useEffect(() => {
    api
      .get("/portfolio/explore/top-skills")
      .then(({ data }) => setTopSkills(data.data.skills))
      .catch(() => setTopSkills([]));
  }, []);

  const effectiveSearch = search;

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPortfolios(effectiveSearch, activeSkills, 1, sort);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSearch, activeSkills, sort]);

  useEffect(() => {
    if (page === 1) return;
    fetchPortfolios(effectiveSearch, activeSkills, page, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSkillClick = (skill: string) => {
    setActiveSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-slate-900 dark:text-white">
      {/* Nav */}
      <header className="border-b border-slate-200 dark:border-white/[0.06]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SkillBridge"
              width={36}
              height={22}
              className="h-9 w-auto"
            />
            <span className="text-sm font-semibold">SkillBridge</span>
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            Create your portfolio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Browse Talent
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Explore public portfolios from students and job seekers on
            SkillBridge. No account required.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-md">
          <IconSearch
            size={16}
            stroke={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, skill, or headline..."
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Skill filter chips */}
        {topSkills.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {topSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillClick(skill)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  activeSkills.includes(skill)
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 hover:border-indigo-500/40"
                }`}
              >
                {skill}
              </button>
            ))}
            {activeSkills.length > 0 && (
              <button
                onClick={() => setActiveSkills([])}
                className="text-xs font-medium text-slate-500 underline hover:text-slate-700 dark:hover:text-slate-300"
              >
                Clear ({activeSkills.length})
              </button>
            )}
          </div>
        )}

        {/* Result count + sort */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {loading
              ? "Searching..."
              : `${pagination?.total ?? 0} portfolio${pagination?.total === 1 ? "" : "s"} found`}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 outline-none transition focus:border-indigo-500"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE > 12 ? 9 : PAGE_SIZE }).map(
              (_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]"
                />
              ),
            )}
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 py-16 text-center text-slate-500 dark:text-slate-500">
            No portfolios found
            {effectiveSearch ? ` for "${effectiveSearch}"` : ""}
            {activeSkills.length > 0 ? ` with ${activeSkills.join(" + ")}` : ""}
            .
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <Link
                  key={entry.user.username}
                  href={`/${entry.user.username}`}
                  className="group flex min-h-[180px] flex-col rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-5 transition-colors hover:border-indigo-500/40 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                >
                  <div className="mb-3 flex items-center gap-3">
                    {entry.user.avatar ? (
                      <Image
                        src={entry.user.avatar}
                        alt={entry.user.name || entry.user.username}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-medium text-indigo-400">
                        {(entry.user.name || entry.user.username)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {entry.user.name || entry.user.username}
                        </p>
                        {isRecentlyUpdated(entry.updatedAt) && (
                          <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            New
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        @{entry.user.username}
                      </p>
                    </div>
                  </div>

                  <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                    {entry.headline || (
                      <span className="text-slate-400 dark:text-slate-600">
                        No headline yet
                      </span>
                    )}
                  </p>

                  {entry.location && (
                    <p className="mb-3 flex items-center gap-1 text-xs text-slate-500">
                      <IconMapPin size={12} stroke={1.75} />
                      {entry.location}
                    </p>
                  )}

                  {entry.skills.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {entry.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill.name}
                          className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs font-medium text-indigo-400 opacity-60 transition-opacity group-hover:opacity-100">
                      View portfolio
                      <IconArrowRight size={12} stroke={2} />
                    </div>
                    <button
                      onClick={(e) =>
                        handleDownloadResume(e, entry.user.username)
                      }
                      disabled={downloadingUsername === entry.user.username}
                      title="Download resume"
                      className="flex flex-shrink-0 items-center gap-1 rounded-md border border-slate-200 dark:border-white/10 px-2 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 transition hover:border-indigo-500/40 hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <IconDownload size={12} stroke={1.75} />
                      {downloadingUsername === entry.user.username
                        ? "..."
                        : "Resume"}
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                  className="rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
