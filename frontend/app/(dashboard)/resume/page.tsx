"use client";

import { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaUserGraduate,
  FaLaptopCode,
  FaCheckCircle,
} from "react-icons/fa";

import { HiOutlineEye } from "react-icons/hi";

import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import ResumeDownloadButton from "@/components/resume/ResumeDownloadButton";
import type { ResumeData } from "@/components/resume/ResumeTypes";
import { IconFileText } from "@tabler/icons-react";
import StudentPreview from "@/components/resume/previews/StudentPreview";
import DeveloperPreview from "@/components/resume/previews/DeveloperPreview";
import ATSPreview from "@/components/resume/previews/ATSPreview";
type Template = "ats" | "student" | "developer";

const TEMPLATES = [
  {
    id: "ats" as Template,
    name: "ATS Professional",
    description: "Clean black & white, optimized for ATS scanners",
    best: "Job applications",
    icon: <FaFilePdf className="text-lg text-indigo-400" />,
  },
  {
    id: "student" as Template,
    name: "Student",
    description: "Modern design for internships and fresh graduates",
    best: "Students",
    icon: <FaUserGraduate className="text-lg text-indigo-400" />,
  },
  {
    id: "developer" as Template,
    name: "Developer",
    description: "Two-column layout focused on technical skills",
    best: "Software Engineers",
    icon: <FaLaptopCode className="text-lg text-indigo-400" />,
  },
];

export default function ResumePage() {
  const { user } = useAuthStore();
  const [portfolio, setPortfolio] = useState<Partial<ResumeData> | null>(null);
  const [certificates, setCertificates] = useState<ResumeData["certificates"]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>("ats");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portfolioRes, certRes] = await Promise.all([
        api.get("/portfolio/me"),
        api.get("/certificates"),
      ]);
      setPortfolio(portfolioRes.data.data);
      setCertificates(
        (certRes.data.data || []).map(
          (c: {
            id: string;
            title: string;
            issuer: string;
            category: string;
          }) => ({
            id: c.id,
            title: c.title,
            issuer: c.issuer,
            category: c.category,
          }),
        ),
      );
    } catch {
      setError("Failed to load your portfolio data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
      </div>
    );
  }

  if (error || !portfolio || !user) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error || "Something went wrong loading your data"}
      </div>
    );
  }

  const resumeData: ResumeData = {
    name: user.name || user.username,
    username: user.username,
    email: user.email,
    headline: portfolio.headline ?? null,
    about: portfolio.about ?? null,
    location: portfolio.location ?? null,
    website: portfolio.website ?? null,
    phone: portfolio.phone ?? null,
    skills: portfolio.skills || [],
    education: portfolio.education || [],
    experience: portfolio.experience || [],
    projects: portfolio.projects || [],
    certificates,
    socialLinks: portfolio.socialLinks || [],
  };

  const isEmpty =
    !portfolio.about &&
    (portfolio.skills?.length ?? 0) === 0 &&
    (portfolio.education?.length ?? 0) === 0 &&
    (portfolio.experience?.length ?? 0) === 0 &&
    (portfolio.projects?.length ?? 0) === 0 &&
    certificates.length === 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Resume</h1>
        <p className="mt-1 text-sm text-slate-400">
          Choose a template and download your resume as a PDF
        </p>
      </div>

      {isEmpty ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10">
          <IconFileText size={32} stroke={1} className="mb-3 text-slate-700" />
          <p className="text-sm text-slate-600">
            Your portfolio is empty — add skills, projects, or experience first
          </p>
          <a
            href="/portfolio"
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Go to Portfolio →
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Template picker */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-white">
              Choose a template
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                    selectedTemplate === t.id
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                    {t.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        {t.name}
                      </h3>
                      {selectedTemplate === t.id && (
                        <FaCheckCircle
                          size={14}
                          className="flex-shrink-0 text-indigo-400"
                        />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {t.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Download button */}
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <HiOutlineEye className="text-xl text-indigo-400" />

                <h3 className="text-lg font-semibold text-white">
                  {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                </h3>
              </div>

              <p className="text-sm text-slate-400">
                {TEMPLATES.find((t) => t.id === selectedTemplate)?.description}
              </p>
            </div>

            <ResumeDownloadButton
              data={resumeData}
              template={selectedTemplate}
              fileName={`${user.username}-resume-${selectedTemplate}.pdf`}
            />
          </div>

          {/* Resume Preview */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineEye className="text-xl text-indigo-400" />

              <h2 className="text-lg font-semibold text-white">
                Resume Preview
              </h2>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTemplate}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.25 }}
                className="
mx-auto
max-w-[850px]
overflow-hidden
rounded-2xl
border
border-slate-200
bg-white
shadow-[0_45px_120px_rgba(0,0,0,.45)]
"
              >
                {selectedTemplate === "student" && (
                  <StudentPreview data={resumeData} />
                )}

                {selectedTemplate === "developer" && (
                  <DeveloperPreview data={resumeData} />
                )}

                {selectedTemplate === "ats" && <ATSPreview data={resumeData} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="text-center text-xs text-slate-600">
            Preview matches the layout of your downloaded PDF.
          </p>
        </div>
      )}
    </div>
  );
}
