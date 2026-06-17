"use client";

import { useState, useEffect } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import api from "@/lib/api";

interface Skill {
  id: string;
  name: string;
  category: string | null;
  level: string | null;
}

const CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Mobile",
  "Tools",
  "Other",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [level, setLevel] = useState("Intermediate");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get("/portfolio/me");
      setSkills(data.data.skills || []);
    } catch {
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      setError("");
      const { data } = await api.post("/portfolio/me/skills", {
        name: name.trim(),
        category,
        level,
      });
      setSkills((prev) => [...prev, data.data]);
      setName("");
      setAdding(false);
    } catch {
      setError("Failed to add skill");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/portfolio/me/skills/${id}`);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete skill");
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
          <h2 className="text-lg font-semibold text-white">Skills</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Add your technical skills and tools
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          <IconPlus size={15} stroke={2} />
          Add skill
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {adding && (
        <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Skill name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="e.g. React"
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0f0f1a] px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0f0f1a] px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setName("");
                setError("");
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {skills.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
          <p className="text-sm text-slate-600">
            No skills yet — add your first one
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5"
            >
              <span className="text-sm text-slate-300">{skill.name}</span>
              {skill.level && (
                <span className="text-xs text-slate-600">{skill.level}</span>
              )}
              <button
                onClick={() => handleDelete(skill.id)}
                className="ml-1 text-slate-700 transition hover:text-red-400"
              >
                <IconX size={13} stroke={2} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
