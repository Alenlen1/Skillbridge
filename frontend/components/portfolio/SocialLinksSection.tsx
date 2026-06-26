"use client";

import { useState, useEffect } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import api from "@/lib/api";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

const PLATFORMS = [
  {
    value: "LinkedIn",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    value: "GitHub",
    label: "GitHub",
    placeholder: "https://github.com/username",
  },
  {
    value: "Twitter",
    label: "Twitter / X",
    placeholder: "https://twitter.com/username",
  },
  {
    value: "YouTube",
    label: "YouTube",
    placeholder: "https://youtube.com/@channel",
  },
  {
    value: "Facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/username",
  },
  {
    value: "Instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/username",
  },
  {
    value: "Website",
    label: "Personal Website",
    placeholder: "https://yourwebsite.com",
  },
  { value: "Other", label: "Other", placeholder: "https://..." },
];

const PLATFORM_ICONS: Record<string, string> = {
  LinkedIn: "in",
  GitHub: "gh",
  Twitter: "𝕏",
  YouTube: "▶",
  Facebook: "f",
  Instagram: "ig",
  Website: "🌐",
  Other: "🔗",
};

export default function SocialLinksSection() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [platform, setPlatform] = useState("LinkedIn");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data } = await api.get("/portfolio/me");
      setLinks(data.data.socialLinks || []);
    } catch {
      setError("Failed to load social links");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!url.trim()) return;
    try {
      setError("");
      const { data } = await api.post("/portfolio/me/social-links", {
        platform,
        url: url.trim(),
      });
      setLinks((prev) => [...prev, data.data]);
      setUrl("");
      setPlatform("LinkedIn");
      setAdding(false);
    } catch {
      setError("Failed to add social link");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/portfolio/me/social-links/${id}`);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("Failed to delete social link");
    }
  };

  const selectedPlatform = PLATFORMS.find((p) => p.value === platform);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="mt-10 border-t border-white/[0.06] pt-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Social Links</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Add your social profiles and links
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          <IconPlus size={15} stroke={2} />
          Add link
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {adding && (
        <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value);
                  setUrl("");
                }}
                className="w-full rounded-lg border border-white/10 bg-[#0f0f1a] px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder={selectedPlatform?.placeholder}
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!url.trim()}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setUrl("");
                setError("");
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {links.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
          <p className="text-sm text-slate-600">
            No social links yet — add your first one
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-xs font-bold text-indigo-400">
                {PLATFORM_ICONS[link.platform] || "🔗"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-400">
                  {link.platform}
                </p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm text-white transition hover:text-indigo-400"
                >
                  {link.url}
                </a>
              </div>
              <button
                onClick={() => handleDelete(link.id)}
                className="text-slate-700 transition hover:text-red-400"
              >
                <IconX size={15} stroke={2} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
