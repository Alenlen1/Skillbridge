"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import { IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";

import {
  HiBriefcase,
  HiBuildingOffice2,
  HiCalendarDays,
  HiMapPin,
} from "react-icons/hi2";
import { set } from "zod";

interface Experience {
  id: string;
  company: string;
  role: string;
  employmentType: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string | null;
}

const EMPTY_FORM = {
  company: "",
  role: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

export default function ExperienceSection() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const { data } = await api.get("/portfolio/me");

      setExperience(
        (data.data.experience || []).sort(
          (a: Experience, b: Experience) =>
            Number(b.current) - Number(a.current),
        ),
      );
    } catch {
      setError("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setAdding(false);
  };

  const handleAdd = async () => {
    setError("")
    if (!form.company.trim()) {
      setError("Company is required");
      return;
    }

    if (!form.role.trim()) {
      setError("Job title is required");
      return;
    }
    try {
      const { data } = await api.post("/portfolio/me/experience", form);

      setExperience((prev) => [...prev, data.data]);

      resetForm();
    } catch {
      setError("Failed to add experience");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      await api.put(`/portfolio/me/experience/${editingId}`, form);

      await fetchExperience();

      resetForm();
    } catch {
      setError("Failed to update experience");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/portfolio/me/experience/${id}`);

      setExperience((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete experience");
    }
  };

  const startEdit = (item: Experience) => {
    setEditingId(item.id);

    setForm({
      company: item.company,
      role: item.role,
      employmentType: item.employmentType || "",
      location: item.location || "",
      startDate: item.startDate ? item.startDate.slice(0, 10) : "",
      endDate: item.endDate ? item.endDate.slice(0, 10) : "",
      current: item.current,
      description: item.description || "",
    });

    setAdding(true);
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Professional Experience
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Showcase your internships, jobs, freelance work, and volunteer
            experience.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setAdding(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          <IconPlus size={14} />
          Add Experience
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      {adding && (
        <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <div className="space-y-4">
            {/* Company */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Company <span className="text-red-400">*</span>
              </label>

              <input
                value={form.company}
                onChange={(e) =>
                  setForm({
                    ...form,
                    company: e.target.value,
                  })
                }
                placeholder="e.g. Google"
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Job Title <span className="text-red-400">*</span>
              </label>

              <input
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
                placeholder="e.g. Software Engineer Intern"
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Employment Type + Location */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Employment Type
                </label>

                <select
                  value={form.employmentType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      employmentType: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#11111b] px-3 py-2 text-sm text-white"
                >
                  <option value="">Select</option>
                  <option>Internship</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Freelance</option>
                  <option>Contract</option>
                  <option>Volunteer</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Location
                </label>

                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g. Santa Rosa, Laguna"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Start Date
                </label>

                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  End Date
                </label>

                <input
                  type="date"
                  disabled={form.current}
                  value={form.current ? "" : form.endDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white disabled:opacity-40"
                />
              </div>
            </div>

            {/* Current Job */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.current}
                onChange={(e) =>
                  setForm({
                    ...form,
                    current: e.target.checked,
                  })
                }
              />

              <span className="text-sm text-slate-400">
                I currently work here
              </span>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Description
              </label>

              <textarea
                maxLength={1000}
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your responsibilities and achievements..."
                className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={editingId ? handleUpdate : handleAdd}
                className="rounded-lg bg-indigo-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                {editingId ? "Update Experience" : "Add Experience"}
              </button>

              <button
                onClick={resetForm}
                className="rounded-lg border border-white/10 px-5 py-2 text-sm text-slate-400 transition hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {experience.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
            <HiBriefcase className="text-2xl text-indigo-400" />
          </div>

          <h3 className="text-sm font-medium text-white">
            No professional experience yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Add your internships, jobs, freelance work, or volunteer experience.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-200 hover:border-indigo-500/40
hover:shadow-lg
hover:shadow-indigo-500/10 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="flex-1">
                  {/* Job Title */}
                  <div className="flex items-center gap-2">
                    <HiBriefcase className="text-lg text-indigo-400" />

                    <h3 className="text-base font-semibold text-white">
                      {item.role}
                    </h3>
                  </div>

                  {/* Company */}
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    <HiBuildingOffice2 className="text-slate-500" />
                    <span>{item.company}</span>
                  </div>

                  {/* Location */}
                  {item.location && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                      <HiMapPin className="text-slate-500" />
                      <span>{item.location}</span>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <HiCalendarDays className="text-slate-500" />

                    <span>
                      {item.startDate
                        ? new Date(item.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "Unknown"}

                      {" • "}

                      {item.current
                        ? "Present"
                        : item.endDate
                          ? new Date(item.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Present"}
                    </span>
                  </div>

                  {/* Employment Type */}
                  {item.employmentType && (
                    <div className="mt-3">
                      <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                        {item.employmentType}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {item.description && (
                    <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-500/10 hover:text-indigo-400"
                    title="Edit"
                  >
                    <IconEdit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                    title="Delete"
                  >
                    <IconTrash size={18} />
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
