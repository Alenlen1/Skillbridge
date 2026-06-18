"use client";

import { useState, useEffect } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import api from "@/lib/api";

interface Education {
  id: string;
  school: string;
  degree: string | null;
  field: string | null;
  startYear: number | null;
  endYear: number | null;
  current: boolean;
}

const EMPTY_FORM = {
  school: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
  current: false,
};

export default function EducationSection() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data } = await api.get("/portfolio/me");
      setEducation(data.data.education || []);
    } catch {
      setError("Failed to load education");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.school.trim()) return;
    try {
      setError("");
      const { data } = await api.post("/portfolio/me/education", {
        school: form.school.trim(),
        degree: form.degree.trim() || null,
        field: form.field.trim() || null,
        startYear: form.startYear || null,
        endYear: form.current ? null : form.endYear || null,
        current: form.current,
      });
      setEducation((prev) => [...prev, data.data]);
      setForm(EMPTY_FORM);
      setAdding(false);
    } catch {
      setError("Failed to add education");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/portfolio/me/education/${id}`);
      setEducation((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError("Failed to delete education");
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
          <h2 className="text-lg font-semibold text-white">Education</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Add your academic background
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          <IconPlus size={15} stroke={2} />
          Add education
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
                School <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
                placeholder="e.g. University of the Philippines"
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Degree
                </label>
                <input
                  type="text"
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Field of study
                </label>
                <input
                  type="text"
                  value={form.field}
                  onChange={(e) => setForm({ ...form, field: e.target.value })}
                  placeholder="e.g. Information Technology"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Start year
                </label>
                <input
                  type="number"
                  value={form.startYear}
                  onChange={(e) =>
                    setForm({ ...form, startYear: e.target.value })
                  }
                  placeholder="e.g. 2023"
                  min="1900"
                  max="2100"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  End year
                </label>
                <input
                  type="number"
                  value={form.current ? "" : form.endYear}
                  onChange={(e) =>
                    setForm({ ...form, endYear: e.target.value })
                  }
                  placeholder={form.current ? "Present" : "e.g. 2027"}
                  disabled={form.current}
                  min="1900"
                  max="2100"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="current-edu"
                checked={form.current}
                onChange={(e) =>
                  setForm({ ...form, current: e.target.checked })
                }
                className="rounded border-white/10 bg-white/[0.05]"
              />
              <label htmlFor="current-edu" className="text-sm text-slate-400">
                I currently study here
              </label>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!form.school.trim()}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add education
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

      {education.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
          <p className="text-sm text-slate-600">
            No education yet — add your first one
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-white">{edu.school}</h3>
                  {edu.degree && (
                    <p className="mt-1 text-sm text-slate-400">
                      {edu.degree} {edu.field && `· ${edu.field}`}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-600">
                    {edu.startYear} — {edu.current ? "Present" : edu.endYear}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(edu.id)}
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
