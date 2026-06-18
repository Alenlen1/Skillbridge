"use client";

import { useState, useEffect } from "react";
import {
  IconPlus,
  IconTrash,
  IconBrandGithub,
  IconExternalLink,
} from "@tabler/icons-react";
import api from "@/lib/api";

interface Project {
  id: string;
  title: string;
  description: string | null;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  techStack: "",
  liveUrl: "",
  githubUrl: "",
  featured: false,
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/portfolio/me");
      setProjects(data.data.projects || []);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    try {
      setError("");
      const techStack = form.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const { data } = await api.post("/portfolio/me/projects", {
        title: form.title.trim(),
        description: form.description.trim() || null,
        techStack,
        liveUrl: form.liveUrl.trim() || null,
        githubUrl: form.githubUrl.trim() || null,
        featured: form.featured,
      });

      setProjects((prev) => [...prev, data.data]);
      setForm(EMPTY_FORM);
      setAdding(false);
    } catch {
      setError("Failed to add project");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/portfolio/me/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Failed to delete project");
    }
  };

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
          <h2 className="text-lg font-semibold text-white">Projects</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Showcase your best work
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          <IconPlus size={15} stroke={2} />
          Add project
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {adding && (
        <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Project title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. SkillBridge"
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="What does this project do?"
                rows={3}
                className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Tech stack{" "}
                <span className="text-slate-600">(comma separated)</span>
              </label>
              <input
                type="text"
                value={form.techStack}
                onChange={(e) =>
                  setForm({ ...form, techStack: e.target.value })
                }
                placeholder="e.g. React, TypeScript, PostgreSQL"
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={form.githubUrl}
                  onChange={(e) =>
                    setForm({ ...form, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Live URL
                </label>
                <input
                  type="text"
                  value={form.liveUrl}
                  onChange={(e) =>
                    setForm({ ...form, liveUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="rounded border-white/10 bg-white/[0.05]"
              />
              <label htmlFor="featured" className="text-sm text-slate-400">
                Featured project
              </label>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!form.title.trim()}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add project
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setForm(EMPTY_FORM);
                setError("");
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
          <p className="text-sm text-slate-600">
            No projects yet — add your first one
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{project.title}</h3>
                    {project.featured && (
                      <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                        Featured
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="mt-1 text-sm text-slate-400">
                      {project.description}
                    </p>
                  )}
                  {project.techStack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-white"
                      >
                        <IconBrandGithub size={13} stroke={1.5} />
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-indigo-400 transition hover:text-indigo-300"
                      >
                        <IconExternalLink size={13} stroke={1.5} />
                        Live
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-slate-700 transition hover:text-red-400"
                >
                  <IconTrash size={16} stroke={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
