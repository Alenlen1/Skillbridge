"use client";

import { useState, useEffect, useRef } from "react";
import {
  IconPlus,
  IconTrash,
  IconCertificate,
  IconExternalLink,
  IconUpload,
} from "@tabler/icons-react";
import api from "@/lib/api";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category: string;
  fileUrl: string;
  issuedAt: string | null;
  createdAt: string;
}

const CATEGORIES = [
  "Technical",
  "Course",
  "Achievement",
  "Certification",
  "Other",
];

const EMPTY_FORM = {
  title: "",
  issuer: "",
  category: "Technical",
  issuedAt: "",
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await api.get("/certificates");
      setCertificates(Array.isArray(data.data) ? data.data : []);
    } catch {
      setError("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError("File must be under 5MB");
        return;
      }
      setError("");
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!form.title.trim() || !form.issuer.trim() || !file) {
      setError("Title, issuer, and a file are required");
      return;
    }

    try {
      setError("");
      setUploading(true);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("issuer", form.issuer.trim());
      formData.append("category", form.category);
      if (form.issuedAt) formData.append("issuedAt", form.issuedAt);
      formData.append("file", file);

      const { data } = await api.post("/certificates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCertificates((prev) => [data.data, ...prev]);
      setForm(EMPTY_FORM);
      setFile(null);
      setAdding(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Failed to upload certificate");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/certificates/${id}`);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete certificate");
    }
  };

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
          <h1 className="text-2xl font-semibold text-white">Certificates</h1>
          <p className="mt-1 text-sm text-slate-400">
            Upload and showcase your certifications
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          <IconPlus size={15} stroke={2} />
          Upload certificate
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
            New Certificate
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. AWS Certified Developer"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Issuer <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
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
                  Date issued
                </label>
                <input
                  type="date"
                  value={form.issuedAt}
                  onChange={(e) =>
                    setForm({ ...form, issuedAt: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                File <span className="text-red-400">*</span>{" "}
                <span className="text-slate-600">
                  (JPG, PNG, WEBP, or PDF — max 5MB)
                </span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={handleFileSelect}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-300 outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-400"
              />
              {file && (
                <p className="mt-1.5 text-xs text-slate-500">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleUpload}
              disabled={
                !form.title.trim() || !form.issuer.trim() || !file || uploading
              }
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Uploading...
                </>
              ) : (
                <>
                  <IconUpload size={15} stroke={2} />
                  Upload
                </>
              )}
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setForm(EMPTY_FORM);
                setFile(null);
                setError("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              disabled={uploading}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {certificates.length === 0 && !adding ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10">
          <IconCertificate
            size={32}
            stroke={1}
            className="mb-3 text-slate-700"
          />
          <p className="text-sm text-slate-600">No certificates yet</p>
          <button
            onClick={() => setAdding(true)}
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Upload your first certificate →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/[0.1]"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                  {cert.category}
                </span>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="text-slate-700 transition hover:text-red-400"
                >
                  <IconTrash size={15} stroke={1.5} />
                </button>
              </div>
              <h3 className="mb-1 font-medium text-white">{cert.title}</h3>
              <p className="text-sm text-slate-400">{cert.issuer}</p>
              {cert.issuedAt && (
                <p className="mt-2 text-xs text-slate-600">
                  Issued {new Date(cert.issuedAt).toLocaleDateString()}
                </p>
              )}
              <a
                href={cert.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 transition hover:text-indigo-300"
              >
                <IconExternalLink size={13} stroke={1.5} />
                View certificate
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
