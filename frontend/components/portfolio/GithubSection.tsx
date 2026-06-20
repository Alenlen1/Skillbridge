"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  IconBrandGithub,
  IconStar,
  IconPlus,
  IconCheck,
} from "@tabler/icons-react";
import api from "@/lib/api";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  language: string | null;
  updatedAt: string;
}

export default function GithubSection() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [connected, setConnected] = useState(false);
  const [checking, setChecking] = useState(true);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [importedIds, setImportedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Detect redirect back from GitHub OAuth (?github=connected or ?github=error)
  useEffect(() => {
    const githubParam = searchParams.get("github");
    if (githubParam === "connected") {
      setStatusMessage("GitHub connected successfully");
      setConnected(true);
      // Clean the URL so refreshing doesn't re-trigger the message
      router.replace("/portfolio");
    } else if (githubParam === "error") {
      setError("Failed to connect GitHub. Please try again.");
      router.replace("/portfolio");
    }
    setChecking(false);
  }, [searchParams, router]);

  // Try loading repos on mount — if it works, we know GitHub is connected
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data } = await api.get("/github/repos");
      setRepos(Array.isArray(data.data) ? data.data : []);
      setConnected(true);
    } catch {
      setConnected(false);
    } finally {
      setChecking(false);
    }
  };

  const handleConnect = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const token = localStorage.getItem("accessToken");
    // We open a direct browser navigation (not an axios call) since this is
    // a full OAuth redirect flow, not an API request.
    window.location.href = `${apiUrl}/github/connect?token=${token}`;
  };

  const handleLoadRepos = async () => {
    try {
      setLoadingRepos(true);
      setError("");
      const { data } = await api.get("/github/repos");
      setRepos(Array.isArray(data.data) ? data.data : []);
    } catch {
      setError("Failed to load repositories");
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleImport = async (repo: Repo) => {
    try {
      await api.post("/github/import", {
        name: repo.name,
        description: repo.description,
        url: repo.url,
        language: repo.language,
      });
      setImportedIds((prev) => new Set(prev).add(repo.id));
    } catch {
      setError(`Failed to import ${repo.name}`);
    }
  };

  if (checking) {
    return (
      <div className="mt-10 border-t border-white/[0.06] pt-10">
        <div className="flex items-center justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 border-t border-white/[0.06] pt-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <IconBrandGithub size={20} stroke={1.5} />
            GitHub
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Connect your GitHub account to import repositories as projects
          </p>
        </div>

        {!connected && (
          <button
            onClick={handleConnect}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            <IconBrandGithub size={15} stroke={2} />
            Connect GitHub
          </button>
        )}
      </div>

      {statusMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <IconCheck size={15} stroke={2} />
          {statusMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {connected && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm text-green-400">
              <IconCheck size={14} stroke={2} />
              GitHub connected
            </p>
            <button
              onClick={handleLoadRepos}
              disabled={loadingRepos}
              className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
            >
              {loadingRepos ? "Loading..." : "Refresh repos"}
            </button>
          </div>

          {repos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
              <p className="text-sm text-slate-600">
                No repositories found, or none loaded yet
              </p>
              <button
                onClick={handleLoadRepos}
                className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
              >
                Load repositories →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {repos.map((repo) => {
                const imported = importedIds.has(repo.id);
                return (
                  <div
                    key={repo.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-white">
                          {repo.name}
                        </p>
                        {repo.language && (
                          <span className="flex-shrink-0 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {repo.description}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                        <IconStar size={11} stroke={1.5} />
                        {repo.stars}
                      </div>
                    </div>
                    <button
                      onClick={() => handleImport(repo)}
                      disabled={imported}
                      className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-500/40 hover:text-white disabled:cursor-not-allowed disabled:border-green-500/20 disabled:text-green-400"
                    >
                      {imported ? (
                        <>
                          <IconCheck size={13} stroke={2} />
                          Imported
                        </>
                      ) : (
                        <>
                          <IconPlus size={13} stroke={2} />
                          Import
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
