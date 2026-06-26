"use client";

import { useState, useEffect } from "react";
import { IconFileText } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import ResumeDownloadButton from "@/components/resume/ResumeDownloadButton";
import type { ResumeData } from "@/components/resume/ResumeTypes";

type Template = "ats" | "student" | "developer";

const TEMPLATES = [
  {
    id: "ats" as Template,
    name: "ATS Professional",
    description: "Clean black & white, optimized for ATS scanners",
    best: "Job applications",
    icon: "📄",
  },
  {
    id: "student" as Template,
    name: "Student",
    description: "Modern with indigo accents, highlights certifications",
    best: "Internships & fresh graduates",
    icon: "🎓",
  },
  {
    id: "developer" as Template,
    name: "Developer",
    description: "Two-column with dark sidebar, highlights technical skills",
    best: "Developer roles",
    icon: "</>",
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
    (portfolio.projects?.length ?? 0) === 0;

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
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedTemplate === t.id
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
                  }`}
                >
                  <div className="mb-2 text-2xl">{t.icon}</div>
                  <p
                    className={`text-sm font-semibold ${selectedTemplate === t.id ? "text-indigo-400" : "text-white"}`}
                  >
                    {t.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{t.description}</p>
                  <p className="mt-2 text-xs text-slate-600">
                    Best for: {t.best}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Download button */}
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {TEMPLATES.find((t) => t.id === selectedTemplate)?.description}
              </p>
            </div>
            <ResumeDownloadButton
              data={resumeData}
              template={selectedTemplate}
              fileName={`${user.username}-resume-${selectedTemplate}.pdf`}
            />
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-white/[0.06] bg-white p-8 text-black shadow-2xl">
            <h2 className="text-2xl font-bold">{resumeData.name}</h2>
            {resumeData.headline && (
              <p className="mt-1 text-sm font-semibold text-indigo-600">
                {resumeData.headline}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-gray-500">
              {resumeData.email && <span>{resumeData.email}</span>}
              {resumeData.phone && <span>{resumeData.phone}</span>}
              {resumeData.location && <span>{resumeData.location}</span>}
              <span>skillbridge.app/{resumeData.username}</span>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-5 space-y-5">
              {resumeData.about && (
                <div>
                  <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Summary
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-700">
                    {resumeData.about}
                  </p>
                </div>
              )}

              {resumeData.experience.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Experience
                  </h3>
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="mb-2">
                      <p className="text-xs font-semibold">
                        {exp.role} — {exp.company}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-gray-600">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {resumeData.projects.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Projects
                  </h3>
                  {resumeData.projects.map((p) => (
                    <div key={p.id} className="mb-2">
                      <p className="text-xs font-semibold">{p.title}</p>
                      {p.description && (
                        <p className="text-xs text-gray-600">{p.description}</p>
                      )}
                      {p.techStack.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Tech: {p.techStack.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {resumeData.education.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Education
                  </h3>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="mb-1">
                      <p className="text-xs font-semibold">{edu.school}</p>
                      {edu.degree && (
                        <p className="text-xs text-gray-600">
                          {edu.degree}
                          {edu.field ? ` · ${edu.field}` : ""}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {resumeData.skills.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Skills
                  </h3>
                  <p className="text-xs text-gray-700">
                    {resumeData.skills.map((s) => s.name).join("  ·  ")}
                  </p>
                </div>
              )}

              {resumeData.certificates.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Certifications
                  </h3>
                  {resumeData.certificates.map((cert) => (
                    <p key={cert.id} className="text-xs text-gray-700">
                      • {cert.title} — {cert.issuer}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-center text-xs text-slate-600">
            This is a simplified preview — the downloaded PDF will match your
            selected template
          </p>
        </div>
      )}
    </div>
  );
}
