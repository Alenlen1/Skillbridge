"use client";

import { useState, useEffect } from "react";
import { IconPlus, IconTrash, IconBriefcase } from "@tabler/icons-react";
import api from "@/lib/api";

interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  notes: string | null;
}

const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Rejected"];

const STATUS_STYLES: Record<string, string> = {
  Applied: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  Screening: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  Interview: "border-purple-500/20 bg-purple-500/10 text-purple-400",
  Offer: "border-green-500/20 bg-green-500/10 text-green-400",
  Rejected: "border-red-500/20 bg-red-500/10 text-red-400",
};

const EMPTY_FORM = {
  company: "",
  role: "",
  status: "Applied",
  notes: "",
};

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/applications");
      setApplications(data.data || []);
    } catch {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.company.trim() || !form.role.trim()) return;
    try {
      setError("");
      const { data } = await api.post("/applications", {
        company: form.company.trim(),
        role: form.role.trim(),
        status: form.status,
        notes: form.notes.trim() || null,
      });
      setApplications((prev) => [data.data, ...prev]);
      setForm(EMPTY_FORM);
      setAdding(false);
    } catch {
      setError("Failed to add application");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/applications/${id}`, { status });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    } catch {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError("Failed to delete application");
    }
  };

  const grouped = STATUSES.reduce<Record<string, Application[]>>(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status);
      return acc;
    },
    {},
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Internship Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track your applications from applied to offer
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          <IconPlus size={15} stroke={2} />
          Add application
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {adding && (
        <div className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            New Application
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Google"
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Software Engineer Intern"
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#0f0f1a] px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Notes
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional notes..."
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!form.company.trim() || !form.role.trim()}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add application
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setForm(EMPTY_FORM);
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {applications.length === 0 && !adding ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10">
          <IconBriefcase size={32} stroke={1} className="mb-3 text-slate-700" />
          <p className="text-sm text-slate-600">No applications yet</p>
          <button
            onClick={() => setAdding(true)}
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Add your first application →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STATUSES.map((status) => (
            <div key={status} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
                >
                  {status}
                </span>
                <span className="text-xs text-slate-600">
                  {grouped[status].length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {grouped[status].map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {app.company}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {app.role}
                        </p>
                        {app.notes && (
                          <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                            {app.notes}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-slate-700">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-slate-700 transition hover:text-red-400"
                      >
                        <IconTrash size={14} stroke={1.5} />
                      </button>
                    </div>

                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value)
                      }
                      className="mt-3 w-full rounded-lg border border-white/10 bg-[#0f0f1a] px-2 py-1.5 text-xs text-white outline-none transition focus:border-indigo-500"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
